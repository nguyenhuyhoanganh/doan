package com.doan.appmusic.service;

import com.doan.appmusic.entity.Composer;
import com.doan.appmusic.entity.Song;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.ComposerDTO;
import com.doan.appmusic.model.SongDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.ComposerRepository;
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

public interface ComposerService {
    List<ComposerDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query);

    ComposerDTO getById(long id);

    ComposerDTO create(ComposerDTO composerDTO);

    ComposerDTO update(long id, ComposerDTO composerDTO);

    void delete(long id);

    long count(Map<String, String[]> search);
}

@Service
@Transactional
class ComposerServiceImpl implements ComposerService {
    @Autowired
    private ComposerRepository repository;

    @Override
    public List<ComposerDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query) {
        // specification
        Specification<Composer> specification = buildSpecification(query);

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
        List<Composer> artists = repository.findAll(specification, pageRequest).toList();

        // convert to dto
        return artists.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public ComposerDTO getById(long id) {
        Composer composer = repository.findById(id).orElseThrow(() -> new CommonException("Composer is not found"));
        return convertToDTO(composer);
    }

    @Override
    public ComposerDTO create(ComposerDTO composerDTO) {
        if (repository.findBySlug(composerDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        Composer composer = convertToEntity(composerDTO);
        return convertToDTO(repository.save(composer));
    }

    @Override
    public ComposerDTO update(long id, ComposerDTO composerDTO) {
        Composer composer = repository.findById(id).orElseThrow(() -> new CommonException("Composer is not found"));

        if (!composer.getSlug().equals(composerDTO.getSlug()) && repository.findBySlug(composerDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(ComposerDTO.class, Composer.class).setProvider(provider -> composer).addMappings(mapping -> mapping.skip(Composer::setId)).addMappings(mapping -> mapping.skip(Composer::setCreatedBy)).addMappings(mapping -> mapping.skip(Composer::setUpdatedBy));

        return convertToDTO(repository.save(mapper.map(composerDTO, Composer.class)));
    }

    @Override
    public void delete(long id) {
        Composer composer = repository.findById(id).orElseThrow(() -> new CommonException("Composer is not found"));
        repository.delete(composer);
    }

    @Override
    public long count(Map<String, String[]> query) {
        Specification<Composer> specification = buildSpecification(query);
        return repository.count(specification);
    }

    private Specification<Composer> buildSpecification(Map<String, String[]> query) {
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
                if (entry.getKey().startsWith("songs")) searchCriteria.setJoinType(Song.class);
                if (entry.getKey().startsWith("createdBy")) searchCriteria.setJoinType(User.class);
                if (entry.getKey().startsWith("updatedBy")) searchCriteria.setJoinType(User.class);
                builder.with(searchCriteria);
            }

        }
        return builder.build();
    }

    private ComposerDTO convertToDTO(Composer composer) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Composer.class, ComposerDTO.class).setPostConverter(context -> {
            // user
            User createdBy = context.getSource().getCreatedBy();
            User updatedBy = context.getSource().getUpdatedBy();
            context.getDestination().setCreatedBy(UserDTO.builder().id(createdBy.getId()).email(createdBy.getEmail()).build());
            context.getDestination().setUpdatedBy(UserDTO.builder().id(updatedBy.getId()).email(updatedBy.getEmail()).build());

            // songs
            List<Song> songs = context.getSource().getSongs();
            if (songs != null) {
                context.getDestination().setSongs(songs.stream().map(song -> SongDTO.builder().id(song.getId()).title(song.getTitle()).slug(song.getSlug()).imageUrl(song.getImageUrl()).build()).collect(Collectors.toList()));
            }

            return context.getDestination();
        });

        return mapper.map(composer, ComposerDTO.class);
    }

    private Composer convertToEntity(ComposerDTO composerDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(ComposerDTO.class, Composer.class).addMappings(mapping -> mapping.skip(Composer::setId));

        return mapper.map(composerDTO, Composer.class);
    }
}
