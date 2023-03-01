package com.doan.appmusic.service;

import com.doan.appmusic.entity.*;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.AlbumDTO;
import com.doan.appmusic.model.ArtistDTO;
import com.doan.appmusic.model.SongDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.ArtistFollowRepository;
import com.doan.appmusic.repository.ArtistRepository;
import com.doan.appmusic.repository.UserRepository;
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
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public interface ArtistService {
    List<ArtistDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query);

    ArtistDTO getById(long id);

    ArtistDTO create(ArtistDTO artistDTO);

    ArtistDTO update(long id, ArtistDTO artistDTO);

    void delete(long id);

    long count(Map<String, String[]> search);

    void follow(long artistId, long userId);

    void unfollow(long artistId, long userId);
}

@Service
@Transactional
class ArtistServiceImpl implements ArtistService {
    @Autowired
    private ArtistRepository repository;
    @Autowired
    private ArtistFollowRepository followRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ArtistDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query) {
        // specification
        Specification<Artist> specification = buildSpecification(query);

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
        List<Artist> artists = repository.findAll(specification, pageRequest).toList();

        // convert to dto
        return artists.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public ArtistDTO getById(long id) {
        Artist artist = repository.findById(id).orElseThrow(() -> new CommonException("Artist cannot be found"));
        return convertToDTO(artist);
    }

    @Override
    public ArtistDTO create(ArtistDTO artistDTO) {
        if (repository.findBySlug(artistDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        Artist artist = convertToEntity(artistDTO);
        artist.setFollowCount(0l);
        return convertToDTO(repository.save(artist));
    }

    @Override
    public ArtistDTO update(long id, ArtistDTO artistDTO) {
        Artist artist = repository.findById(id).orElseThrow(() -> new CommonException("Artist cannot be found"));

        if (!artist.getSlug().equals(artistDTO.getSlug()) && repository.findBySlug(artistDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(ArtistDTO.class, Artist.class).setProvider(provider -> artist).addMappings(mapping -> mapping.skip(Artist::setId)).addMappings(mapping -> mapping.skip(Artist::setCreatedBy)).addMappings(mapping -> mapping.skip(Artist::setUpdatedBy));

        return convertToDTO(repository.save(mapper.map(artistDTO, Artist.class)));
    }

    @Override
    public void delete(long id) {
        Artist artist = repository.findById(id).orElseThrow(() -> new CommonException("Artist cannot be found"));
        repository.delete(artist);
    }

    @Override
    public long count(Map<String, String[]> query) {
        Specification<Artist> specification = buildSpecification(query);
        return repository.count(specification);
    }

    @Override
    public void follow(long artistId, long userId) {
        Optional<ArtistFollow> optionalArtistFollow = followRepository.findByUserIdAndArtistId(userId, artistId);
        if (optionalArtistFollow.isPresent()) return;
        Artist artist = repository.findById(artistId).orElseThrow(() -> new CommonException("Artist cannot be found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new CommonException("User cannot be found"));
        artist.incrementFollowCount();
        repository.save(artist);
        followRepository.save(ArtistFollow.builder().artist(artist).user(user).build());
    }

    @Override
    public void unfollow(long artistId, long userId) {
        Optional<ArtistFollow> optionalArtistFollow = followRepository.findByUserIdAndArtistId(userId, artistId);
        if (optionalArtistFollow.isEmpty()) return;
        ArtistFollow artistFollow = optionalArtistFollow.get();
        Artist artist = artistFollow.getArtist();
        artist.decrementFollowCount();
        repository.save(artist);
        followRepository.delete(artistFollow);
    }

    private Specification<Artist> buildSpecification(Map<String, String[]> query) {
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
                if (entry.getKey().startsWith("albums")) searchCriteria.setJoinType(Album.class);
                if (entry.getKey().startsWith("songs")) searchCriteria.setJoinType(Song.class);
                if (entry.getKey().startsWith("createdBy")) searchCriteria.setJoinType(User.class);
                if (entry.getKey().startsWith("updatedBy")) searchCriteria.setJoinType(User.class);
                builder.with(searchCriteria);
            }

        }
        return builder.build();
    }

    private ArtistDTO convertToDTO(Artist artist) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Artist.class, ArtistDTO.class).setPostConverter(context -> {
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

            // albums
            List<Album> albums = context.getSource().getAlbums();
            if (albums != null) {
                context.getDestination().setAlbums(albums.stream().map(album -> AlbumDTO.builder().id(album.getId()).title(album.getTitle()).backgroundImageUrl(album.getBackgroundImageUrl()).build()).collect(Collectors.toList()));
            }
            return context.getDestination();
        });

        return mapper.map(artist, ArtistDTO.class);
    }

    private Artist convertToEntity(ArtistDTO artistDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(ArtistDTO.class, Artist.class).addMappings(mapping -> mapping.skip(Artist::setId));

        return mapper.map(artistDTO, Artist.class);
    }
}
