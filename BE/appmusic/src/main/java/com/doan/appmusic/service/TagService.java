package com.doan.appmusic.service;

import com.doan.appmusic.entity.Tag;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.TagDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.TagRepository;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public interface TagService {
    TagDTO create(TagDTO tagDTO);

    TagDTO update(long id, TagDTO tagDTO);

    void delete(long id);

    long count(String title);

    List<TagDTO> findByTitle(int page, int limit, String sortBy, String orderBy, String title);

    TagDTO getBySlug(String slug);

    TagDTO getById(long id);
}

@Service
@Transactional
class TagServiceImpl implements TagService {
    @Autowired
    private TagRepository repository;

    @Override
    public TagDTO create(TagDTO tagDTO) {
        if (repository.findByTitle(tagDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
        if (repository.findBySlug(tagDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        Tag tag = convertToEntity(tagDTO);
        return convertToDTO(repository.save(tag));
    }

    @Override
    public TagDTO update(long id, TagDTO tagDTO) {
        Tag tag = repository.findById(id).orElseThrow(() -> new CommonException("Tag is not found"));

        if (!tag.getTitle().equals(tagDTO.getTitle()) && repository.findByTitle(tagDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
        if (!tag.getSlug().equals(tagDTO.getSlug()) && repository.findBySlug(tagDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(TagDTO.class, Tag.class).setProvider(provider -> tag).addMappings(mapping -> mapping.skip(Tag::setId)).addMappings(mapping -> mapping.skip(Tag::setCreatedBy)).addMappings(mapping -> mapping.skip(Tag::setUpdatedBy));

        return convertToDTO(repository.save(mapper.map(tagDTO, Tag.class)));
    }

    @Override
    public void delete(long id) {
        Tag tag = repository.findById(id).orElseThrow(() -> new CommonException("Tag is not found"));
        repository.delete(tag);
    }

    @Override
    public long count(String title) {
        return repository.countByTitle(title);
    }

    @Override
    public List<TagDTO> findByTitle(int page, int limit, String sortBy, String orderBy, String title) {
        List<Sort.Order> sortList = new ArrayList<>();
        if (orderBy.equals("desc")) sortList.add(new Sort.Order(Sort.Direction.DESC, sortBy));
        if (orderBy.equals("asc")) sortList.add(new Sort.Order(Sort.Direction.ASC, sortBy));
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(sortList));

        List<Tag> tags = repository.findByTitleContainingIgnoreCase(title, pageRequest);
        return tags.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public TagDTO getBySlug(String slug) {
        return convertToDTO(repository.findBySlug(slug).orElseThrow(() -> new CommonException("Tag is not found")));
    }

    @Override
    public TagDTO getById(long id) {
        return convertToDTO(repository.findById(id).orElseThrow(() -> new CommonException("Tag is not found")));
    }

    private Tag convertToEntity(TagDTO tagDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(TagDTO.class, Tag.class).addMappings(mapping -> mapping.skip(Tag::setId));

        return mapper.map(tagDTO, Tag.class);
    }

    private TagDTO convertToDTO(Tag tag) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Tag.class, TagDTO.class).setPostConverter(context -> {
            User createdBy = context.getSource().getCreatedBy();
            User updatedBy = context.getSource().getUpdatedBy();
            context.getDestination().setCreatedBy(UserDTO.builder().email(createdBy.getEmail()).id(createdBy.getId()).build());
            context.getDestination().setUpdatedBy(UserDTO.builder().email(updatedBy.getEmail()).id(updatedBy.getId()).build());
            return context.getDestination();
        });

        return mapper.map(tag, TagDTO.class);
    }
}
