package com.doan.appmusic.service;

import com.doan.appmusic.entity.Category;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.CategoryDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.CategoryRepository;
import com.doan.appmusic.repository.specification.GenericSpecificationBuilder;
import com.doan.appmusic.repository.specification.SearchCriteria;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public interface CategoryService {
    List<CategoryDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query);

    CategoryDTO getById(long id);

    CategoryDTO create(CategoryDTO categoryDTO);

    CategoryDTO update(long id, CategoryDTO categoryDTO);

    void delete(long id);

    long count(Map<String, String[]> search);
}

@Service
@Transactional
class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository repository;

    @Override
    public List<CategoryDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query) {
        // specification
        Specification<Category> specification = buildSpecification(query);

        // sort
        List<Sort.Order> sortList = new ArrayList<>();
        for (int i = 0; i < sortBy.length; i++) {
            if (i < orderBy.length) {
                if (orderBy[i].equals("desc")) {
                    sortList.add(new Sort.Order(Sort.Direction.DESC, sortBy[i]));
                    continue;
                }
            }
            sortList.add(new Sort.Order(Sort.Direction.ASC, sortBy[i]));
        }

        // page request
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(sortList));

        // find
        List<Category> categories = repository.findAll(specification, pageRequest).toList();

        // convert to dto
        return categories.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getById(long id) {
        Category category = repository.findById(id).orElseThrow(() -> new CommonException("Category cannot be found"));
        return convertToDTO(category);
    }

    @Override
    public CategoryDTO create(CategoryDTO categoryDTO) {
        if (repository.findBySlug(categoryDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        if (repository.findByTitle(categoryDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
        Category category = convertToEntity(categoryDTO);
        return convertToDTO(repository.save(category));
    }

    @Override
    public CategoryDTO update(long id, CategoryDTO categoryDTO) {
        Category category = repository.findById(id).orElseThrow(() -> new CommonException("Category cannot be found"));

        if (!category.getSlug().equals(categoryDTO.getSlug()) && repository.findBySlug(categoryDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        if (!category.getTitle().equals(categoryDTO.getTitle()) && repository.findByTitle(categoryDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(CategoryDTO.class, Category.class).setProvider(provider -> category).addMappings(mapping -> mapping.skip(Category::setId)).addMappings(mapping -> mapping.skip(Category::setCreatedBy)).addMappings(mapping -> mapping.skip(Category::setUpdatedBy));

        return convertToDTO(repository.save(mapper.map(categoryDTO, Category.class)));
    }

    @Override
    public void delete(long id) {
        Category category = repository.findById(id).orElseThrow(() -> new CommonException("Category cannot be found"));
        repository.delete(category);
    }

    @Override
    public long count(Map<String, String[]> query) {
        Specification<Category> specification = buildSpecification(query);
        return repository.count(specification);
    }

    private Specification<Category> buildSpecification(Map<String, String[]> query) {
        GenericSpecificationBuilder builder = new GenericSpecificationBuilder();
        for (Map.Entry<String, String[]> entry : query.entrySet()) {
            SearchCriteria searchCriteria = null;
            if (entry.getValue()[0].equals("")) {
                Pattern pattern = Pattern.compile("(\\w+)([><])(\\d+)");
                Matcher matcher = pattern.matcher(entry.getKey());
                if (matcher.find()) {
                    searchCriteria = new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), User.class);
                }
            } else searchCriteria = new SearchCriteria(entry.getKey(), "=", entry.getValue()[0], User.class);

            if (searchCriteria != null) {
//                if (entry.getKey().startsWith("parentCategory")) searchCriteria.setJoinType(Category.class);
                if (entry.getKey().startsWith("createdBy")) searchCriteria.setJoinType(User.class);
                if (entry.getKey().startsWith("updatedBy")) searchCriteria.setJoinType(User.class);
                builder.with(searchCriteria);
            }

        }
        return builder.build();
    }

    private CategoryDTO convertToDTO(Category category) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Category.class, CategoryDTO.class).setPostConverter(context -> {
            // user
            User createdBy = context.getSource().getCreatedBy();
            User updatedBy = context.getSource().getUpdatedBy();
            context.getDestination().setCreatedBy(UserDTO.builder().id(createdBy.getId()).email(createdBy.getEmail()).build());
            context.getDestination().setUpdatedBy(UserDTO.builder().id(updatedBy.getId()).email(updatedBy.getEmail()).build());

            Category parent = context.getSource().getParentCategory();
            if (parent != null) {
                CategoryDTO parentDTO = convertToDTO(parent);
                context.getDestination().setParentCategory(parentDTO);
            }
            return context.getDestination();
        });

        return mapper.map(category, CategoryDTO.class);
    }

    private Category convertToEntity(CategoryDTO categoryDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(CategoryDTO.class, Category.class).addMappings(mapping -> mapping.skip(Category::setId));

        return mapper.map(categoryDTO, Category.class);
    }
}
