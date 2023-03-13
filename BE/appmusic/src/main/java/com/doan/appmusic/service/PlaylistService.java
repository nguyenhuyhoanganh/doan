package com.doan.appmusic.service;

import com.doan.appmusic.model.PlaylistDTO;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

public interface PlaylistService {
    PlaylistDTO getBySlug(String slug);
    PlaylistDTO addSong(long songId, long playlistId);
    PlaylistDTO removeSong(long songId, long playlistId);
}

@Service
@Transactional
class PlaylistServiceImpl implements PlaylistService {

    @Override
    public PlaylistDTO getBySlug(String slug) {
        return null;
    }

    @Override
    public PlaylistDTO addSong(long songId, long playlistId) {
        return null;
    }

    @Override
    public PlaylistDTO removeSong(long songId, long playlistId) {
        return null;
    }
}
