package com.doan.appmusic.service;

import com.doan.appmusic.entity.Playlist;
import com.doan.appmusic.entity.Song;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.PlaylistDTO;
import com.doan.appmusic.model.SongDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.PlaylistRepository;
import com.doan.appmusic.repository.SongRepository;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    public PlaylistDTO getById(long playlistId, long createdById) {
        Playlist playlist = repository.findByPlaylistId(playlistId, createdById)
                .orElseThrow(() -> new CommonException("Playlist cannot be found"));
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
        Playlist playlist = repository.findByPlaylistId(playlistId, createdById)
                        .orElseThrow(() -> new CommonException("Playlist cannot be found"));
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
            // album
            List<Song> songs = context.getSource().getSongs();
            if (songs != null && songs.size() > 0) {
                context.getDestination().setSongs(songs.stream().map(song -> SongDTO.builder().id(song.getId()).sourceUrls(song.getSourceUrls()).imageUrl(song.getImageUrl()).likeCount(song.getLikeCount()).title(song.getTitle()).duration(song.getDuration()).slug(song.getSlug()).build()).collect(Collectors.toList()));
            }
            return context.getDestination();
        });

        return mapper.map(playlist, PlaylistDTO.class);
    }

    private Playlist convertToEntity(PlaylistDTO playlistDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(PlaylistDTO.class, Playlist.class).addMappings(mapping -> mapping.skip(Playlist::setId));

        return mapper.map(playlistDTO, Playlist.class);
    }
}
