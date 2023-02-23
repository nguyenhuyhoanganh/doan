package com.doan.appmusic.service;

import com.doan.appmusic.entity.Album;
import com.doan.appmusic.entity.Artist;
import com.doan.appmusic.entity.Song;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.AlbumDTO;
import com.doan.appmusic.model.ArtistDTO;
import com.doan.appmusic.model.SongDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.AlbumRepository;
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

public interface AlbumService {

    List<AlbumDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query);

    AlbumDTO getById(long id);

    AlbumDTO create(AlbumDTO albumDTO);

    AlbumDTO update(long id, AlbumDTO albumDTO);

    void delete(long id);

    long count(Map<String, String[]> search);
}

@Service
@Transactional
class AlbumServiceImpl implements AlbumService {
    @Autowired
    private AlbumRepository repository;

    @Override
    public List<AlbumDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query) {
        // specification
        Specification<Album> specification = buildSpecification(query);

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
        List<Album> albums = repository.findAll(specification, pageRequest).toList();

        // convert to dto
        return albums.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public AlbumDTO getById(long id) {
        Album album = repository.findById(id).orElseThrow(() -> new CommonException("Album is not found"));
        return convertToDTO(album);
    }

    @Override
    public AlbumDTO create(AlbumDTO albumDTO) {
        if (repository.findByTitle(albumDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
        if (repository.findBySlug(albumDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        Album album = convertToEntity(albumDTO);
        return convertToDTO(repository.save(album));
    }

    @Override
    public AlbumDTO update(long id, AlbumDTO albumDTO) {
        Album album = repository.findById(id).orElseThrow(() -> new CommonException("Album is not found"));

        if (!album.getTitle().equals(albumDTO.getTitle()) && repository.findByTitle(albumDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
        if (!album.getSlug().equals(albumDTO.getSlug()) && repository.findBySlug(albumDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(AlbumDTO.class, Album.class).setProvider(provider -> album).addMappings(mapping -> mapping.skip(Album::setId)).addMappings(mapping -> mapping.skip(Album::setCreatedBy)).addMappings(mapping -> mapping.skip(Album::setUpdatedBy));

        return convertToDTO(repository.save(mapper.map(albumDTO, Album.class)));
    }

    @Override
    public void delete(long id) {
        Album album = repository.findById(id).orElseThrow(() -> new CommonException("Album is not found"));
        repository.delete(album);
    }

    @Override
    public long count(Map<String, String[]> query) {
        Specification<Album> specification = buildSpecification(query);
        return repository.count(specification);
    }

    private Specification<Album> buildSpecification(Map<String, String[]> query) {
        GenericSpecificationBuilder builder = new GenericSpecificationBuilder();
        for (Map.Entry<String, String[]> entry : query.entrySet()) {
            SearchCriteria searchCriteria = null;
            if (entry.getValue()[0].equals("")) {
                Pattern pattern = Pattern.compile("(\\w+)([><])(\\d+)");
                Matcher matcher = pattern.matcher(entry.getKey());
                if (matcher.find()) {
                    searchCriteria = new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), User.class);
                }
            } else {
                searchCriteria = new SearchCriteria(entry.getKey(), "=", entry.getValue()[0], User.class);
            }
            if (searchCriteria != null) {
                if (entry.getKey().startsWith("artists")) searchCriteria.setJoinType(Artist.class);
                if (entry.getKey().startsWith("songs")) searchCriteria.setJoinType(Song.class);
                if (entry.getKey().startsWith("createdBy")) searchCriteria.setJoinType(User.class);
                if (entry.getKey().startsWith("updatedBy")) searchCriteria.setJoinType(User.class);
                builder.with(searchCriteria);
            }

        }
        return builder.build();
    }

    private AlbumDTO convertToDTO(Album album) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Album.class, AlbumDTO.class).setPostConverter(context -> {
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

            // artists
            List<Artist> artists = context.getSource().getArtists();
            if (artists != null) {
                context.getDestination().setArtists(artists.stream().map(artist -> ArtistDTO.builder().id(artist.getId()).fullName(artist.getFullName()).avatarUrl(artist.getAvatarUrl()).build()).collect(Collectors.toList()));
            }
            return context.getDestination();
        });

        return mapper.map(album, AlbumDTO.class);
    }

    private Album convertToEntity(AlbumDTO albumDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(AlbumDTO.class, Album.class).addMappings(mapping -> mapping.skip(Album::setId));

        return mapper.map(albumDTO, Album.class);
    }
}
