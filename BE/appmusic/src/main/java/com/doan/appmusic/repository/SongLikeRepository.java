package com.doan.appmusic.repository;

import com.doan.appmusic.entity.SongLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SongLikeRepository extends JpaRepository<SongLike, Long> {
    @Query("SELECT lk FROM SongLike lk JOIN lk.user user JOIN lk.song song " +
            "WHERE user.id = :userId AND song.id = :songId")
    Optional<SongLike> findByUserAndSong(@Param("userId") long userId, @Param("songId") long songId);
}

