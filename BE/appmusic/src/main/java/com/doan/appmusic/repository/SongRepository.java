package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface SongRepository extends JpaRepository<Song, Long>, JpaSpecificationExecutor<Song> {
    Optional<Song> findBySlug(String slug);
    Optional<Song> findByTitle(String title);
}
