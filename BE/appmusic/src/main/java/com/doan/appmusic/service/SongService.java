package com.doan.appmusic.service;

import com.doan.appmusic.entity.*;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.*;
import com.doan.appmusic.repository.SongLikeRepository;
import com.doan.appmusic.repository.SongRepository;
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

public interface SongService {
    List<SongDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query);

    SongDTO getById(long id);

    SongDTO getBySlug(String slug);

    SongDTO create(SongDTO songDTO);

    SongDTO update(long id, SongDTO songDTO);

    void delete(long id);

    long count(Map<String, String[]> search);

    void like(long songId, long userId);

    void unlike(long songId, long userId);

    void comment(long songId, long userId);

    void deleteComment(long songId, long userId);
}

@Service
@Transactional
class SongServiceImpl implements SongService {

    @Autowired
    private SongRepository repository;
    @Autowired
    private SongLikeRepository likeRepository;

    @Override
    public List<SongDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query) {
        // specification
        Specification<Song> specification = buildSpecification(query);

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
        List<Song> songs = repository.findAll(specification, pageRequest).toList();

        // convert to dto
        return songs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public SongDTO getById(long id) {
        Song song = repository.findById(id).orElseThrow(() -> new CommonException("Song cannot be found"));
        return convertToDTO(song);
    }

    @Override
    public SongDTO getBySlug(String slug) {
        Song song = repository.findBySlug(slug).orElseThrow(() -> new CommonException("Song cannot be found"));
        return convertToDTO(song);
    }

    @Override
    public SongDTO create(SongDTO songDTO) {
        if (repository.findBySlug(songDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        if (repository.findByTitle(songDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
        Song song = convertToEntity(songDTO);
        song.setCommentCount(0l);
        song.setLikeCount(0l);
        return convertToDTO(repository.save(song));
    }

    @Override
    public SongDTO update(long id, SongDTO songDTO) {
        Song song = repository.findById(id).orElseThrow(() -> new CommonException("Song cannot be found"));

        if (!song.getSlug().equals(songDTO.getSlug()) && repository.findBySlug(songDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        if (!song.getTitle().equals(songDTO.getTitle()) && repository.findByTitle(songDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(SongDTO.class, Song.class).setProvider(provider -> song).addMappings(mapping -> mapping.skip(Song::setId)).addMappings(mapping -> mapping.skip(Song::setCreatedBy)).addMappings(mapping -> mapping.skip(Song::setUpdatedBy));

        return convertToDTO(repository.save(mapper.map(songDTO, Song.class)));
    }

    @Override
    public void delete(long id) {
        Song song = repository.findById(id).orElseThrow(() -> new CommonException("Song cannot be found"));
        repository.delete(song);
    }

    @Override
    public long count(Map<String, String[]> query) {
        Specification<Song> specification = buildSpecification(query);
        return repository.count(specification);
    }

    @Override
    public void like(long songId, long userId) {

    }

    @Override
    public void unlike(long songId, long userId) {

    }

    @Override
    public void comment(long songId, long userId) {

    }

    @Override
    public void deleteComment(long songId, long userId) {

    }

    private Specification<Song> buildSpecification(Map<String, String[]> query) {
        GenericSpecificationBuilder builder = new GenericSpecificationBuilder();
        for (Map.Entry<String, String[]> entry : query.entrySet()) {
            // if entry with key is "search" => search by title, artist name, composer name, album title
            if (entry.getKey().equals("search")) {
                builder.with(SearchCriteria.builder().key("title").operation("=").value(entry.getValue()[0]).isOrPredicate(true).build());
                builder.with(SearchCriteria.builder().key("artists.fullName").operation("=").value(entry.getValue()[0]).isOrPredicate(true).joinType(Artist.class).build());
                builder.with(SearchCriteria.builder().key("album.title").operation("=").value(entry.getValue()[0]).isOrPredicate(true).joinType(Album.class).build());
                builder.with(SearchCriteria.builder().key("composer.fullName").operation("=").value(entry.getValue()[0]).isOrPredicate(true).joinType(Composer.class).build());
                continue;
            }
            SearchCriteria searchCriteria = null;
            // request.getParameterMap() can't check query has characters ">" and "<"
            // => return 1 entry with value is "" and key is query itself
            // check case query has characters ">" and "<"
            if (entry.getValue()[0].equals("")) {
                // query split
                Pattern pattern = Pattern.compile("(\\w+)([><])(\\d+)");
                Matcher matcher = pattern.matcher(entry.getKey());
                if (matcher.find()) {
                    searchCriteria = new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), Song.class);
                }
            } else searchCriteria = new SearchCriteria(entry.getKey(), "=", entry.getValue()[0], Song.class);

            if (searchCriteria != null) {
                if (entry.getKey().startsWith("tags")) searchCriteria.setJoinType(Tag.class);
                if (entry.getKey().startsWith("categories")) searchCriteria.setJoinType(Category.class);
                if (entry.getKey().startsWith("artists")) searchCriteria.setJoinType(Artist.class);
                if (entry.getKey().startsWith("composer")) searchCriteria.setJoinType(Composer.class);
                if (entry.getKey().startsWith("album")) searchCriteria.setJoinType(Album.class);
                if (entry.getKey().startsWith("createdBy")) searchCriteria.setJoinType(User.class);
                if (entry.getKey().startsWith("updatedBy")) searchCriteria.setJoinType(User.class);
                if (entry.getKey().startsWith("search")) searchCriteria.setOrPredicate(true);
                builder.with(searchCriteria);
            }

        }
        return builder.build();
    }

    private SongDTO convertToDTO(Song song) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Song.class, SongDTO.class).setPostConverter(context -> {
            // user
            User createdBy = context.getSource().getCreatedBy();
            User updatedBy = context.getSource().getUpdatedBy();
            context.getDestination().setCreatedBy(UserDTO.builder().id(createdBy.getId()).email(createdBy.getEmail()).build());
            context.getDestination().setUpdatedBy(UserDTO.builder().id(updatedBy.getId()).email(updatedBy.getEmail()).build());

            // album
            Album album = context.getSource().getAlbum();
            if (album != null)
                context.getDestination().setAlbum(AlbumDTO.builder().id(album.getId()).slug(album.getSlug()).title(album.getTitle()).backgroundImageUrl(album.getBackgroundImageUrl()).build());

            // tags
            List<Tag> tags = context.getSource().getTags();
            if (tags != null)
                context.getDestination().setTags(tags.stream().map(tag -> TagDTO.builder().id(tag.getId()).slug(tag.getSlug()).title(tag.getTitle()).build()).collect(Collectors.toList()));

            // categories
            List<Category> categories = context.getSource().getCategories();
            if (categories != null)
                context.getDestination().setCategories(categories.stream().map(category -> CategoryDTO.builder().id(category.getId()).slug(category.getSlug()).title(category.getTitle()).build()).collect(Collectors.toList()));

            // artist
            List<Artist> artists = context.getSource().getArtists();
            if (artists != null)
                context.getDestination().setArtists(artists.stream().map(artist -> ArtistDTO.builder().id(artist.getId()).fullName(artist.getFullName()).avatarUrl(artist.getAvatarUrl()).slug(artist.getSlug()).build()).collect(Collectors.toList()));

            // composer
            Composer composer = context.getSource().getComposer();
            if (composer != null)
                context.getDestination().setComposer(ComposerDTO.builder().id(composer.getId()).slug(composer.getSlug()).fullName(composer.getFullName()).avatarUrl(composer.getAvatarUrl()).build());
            return context.getDestination();
        }).addMappings(mapping -> mapping.skip(SongDTO::setComments)).addMappings(mapping -> mapping.skip(SongDTO::setLikes));

        return mapper.map(song, SongDTO.class);
    }

    private Song convertToEntity(SongDTO songDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(SongDTO.class, Song.class).addMappings(mapping -> mapping.skip(Song::setId));

        return mapper.map(songDTO, Song.class);
    }
}

