package com.doan.appmusic.service;

import com.doan.appmusic.entity.*;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.*;
import com.doan.appmusic.repository.PlaylistRepository;
import com.doan.appmusic.repository.SongLikeRepository;
import com.doan.appmusic.repository.SongRepository;
import com.doan.appmusic.security.CustomUserDetails;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public interface PlaylistService {
    PlaylistDTO getById(long playlistId, long createdById);

    List<PlaylistDTO> getAll(long createdById);

    PlaylistDTO createPlaylist(PlaylistDTO playlistDTO, long createdById);

    PlaylistDTO updatePlaylist(long playlistId, PlaylistDTO playlistDTO, long createdById);

    long count(long createdById);

    void deletePlaylist(long playlistId, long createdById);

    PlaylistDTO addSong(long songId, long playlistId, long createdById);

    PlaylistDTO removeSong(long songId, long playlistId, long createdById);
}

@Service
@Transactional
class PlaylistServiceImpl implements PlaylistService {
    @Autowired
    private PlaylistRepository repository;
    @Autowired
    private SongRepository songRepository;
    @Autowired
    private SongLikeRepository likeRepository;

    @Override
    public PlaylistDTO getById(long playlistId, long createdById) {
        Playlist playlist = repository.findByPlaylistId(playlistId, createdById).orElseThrow(() -> new CommonException("Playlist cannot be found"));
        return convertToDTO(playlist);
    }

    @Override
    public List<PlaylistDTO> getAll(long createdById) {
        List<Playlist> playlists = repository.findByCreatedBy_Id(createdById);
        return playlists.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public PlaylistDTO createPlaylist(PlaylistDTO playlistDTO, long createdById) {
        if (repository.findByTitle(playlistDTO.getTitle(), createdById).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
        Playlist playlist = convertToEntity(playlistDTO);
        return convertToDTO(repository.save(playlist));
    }

    @Override
    public PlaylistDTO updatePlaylist(long playlistId, PlaylistDTO playlistDTO, long createdById) {
        Playlist playlistFindById = repository.findById(playlistId).orElseThrow(() -> new CommonException("Playlist " + "cannot be found"));
        if (playlistFindById.getCreatedBy().getId().equals(createdById)) {
            Optional<Playlist> playlistFindByTitleOptional = repository.findByTitle(playlistDTO.getTitle(), createdById);
            if (playlistFindByTitleOptional.isPresent() && playlistFindById.getTitle().equals(playlistFindByTitleOptional.get().getTitle()))
                throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
            ModelMapper mapper = new ModelMapper();
            mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
            mapper.createTypeMap(PlaylistDTO.class, Playlist.class).setProvider(provider -> playlistFindById).addMappings(mapping -> mapping.skip(Playlist::setId)).addMappings(mapping -> mapping.skip(Playlist::setCreatedBy));

            return convertToDTO(repository.save(mapper.map(playlistDTO, Playlist.class)));
        }
        throw new CommonException("Playlist cannot be found");
    }

    @Override
    public long count(long createdById) {
        return repository.countByCreatedBy_Id(createdById);
    }

    @Override
    public void deletePlaylist(long playlistId, long createdById) {
        Playlist playlist = repository.findByPlaylistId(playlistId, createdById).orElseThrow(() -> new CommonException("Playlist cannot be found"));
        repository.delete(playlist);
    }

    @Override
    public PlaylistDTO addSong(long songId, long playlistId, long createdById) {
        Playlist playlist = repository.findByPlaylistId(playlistId, createdById).orElseThrow(() -> new CommonException("Playlist cannot be found"));
        Song song = songRepository.findById(songId).orElseThrow(() -> new CommonException("Song cannot be found"));
        List<Song> songs = playlist.getSongs();
        boolean hasSong = songs.stream().anyMatch(s -> s.getId() == songId);
        if (!hasSong) songs.add(song);
        playlist.setSongs(songs);
        return convertToDTO(repository.save(playlist));
    }

    @Override
    public PlaylistDTO removeSong(long songId, long playlistId, long createdById) {
        Playlist playlist = repository.findByPlaylistId(playlistId, createdById).orElseThrow(() -> new CommonException("Playlist cannot be found"));
        songRepository.findById(songId).orElseThrow(() -> new CommonException("Song cannot be found"));
        List<Song> songs = playlist.getSongs();
        boolean hasSong = songs.stream().anyMatch(s -> s.getId() == songId);
        if (!hasSong) throw new CommonException("Song cannot be found in playlist");
        playlist.setSongs(songs.stream().filter(s -> s.getId() != songId).collect(Collectors.toList()));
        return convertToDTO(repository.save(playlist));
    }


    private PlaylistDTO convertToDTO(Playlist playlist) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Playlist.class, PlaylistDTO.class).setPostConverter(context -> {
            // user
            User createdBy = context.getSource().getCreatedBy();
            context.getDestination().setCreatedBy(UserDTO.builder().id(createdBy.getId()).email(createdBy.getEmail()).build());
            // songs
            List<Song> songs = context.getSource().getSongs();
            if (songs != null && songs.size() > 0) {
                context.getDestination().setSongs(songs.stream().map(this::convertSongDTO).collect(Collectors.toList()));
            }
            return context.getDestination();
        });

        return mapper.map(playlist, PlaylistDTO.class);
    }

    private SongDTO convertSongDTO(Song song) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Song.class, SongDTO.class).setPostConverter(context -> {
            // user
            User createdBy = context.getSource().getCreatedBy();
            User updatedBy = context.getSource().getUpdatedBy();
            context.getDestination().setCreatedBy(UserDTO.builder().id(createdBy.getId()).email(createdBy.getEmail()).build());
            context.getDestination().setUpdatedBy(UserDTO.builder().id(updatedBy.getId()).email(updatedBy.getEmail()).build());

            //like
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
                User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
                if (user != null) {
                    Optional<SongLike> songLikeOptional = likeRepository.findByUserAndSong(user.getId(), context.getSource().getId());
                    if (songLikeOptional.isPresent()) context.getDestination().setLiked(true);
                }
            }

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

    private Playlist convertToEntity(PlaylistDTO playlistDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(PlaylistDTO.class, Playlist.class).addMappings(mapping -> mapping.skip(Playlist::setId));

        return mapper.map(playlistDTO, Playlist.class);
    }
}
