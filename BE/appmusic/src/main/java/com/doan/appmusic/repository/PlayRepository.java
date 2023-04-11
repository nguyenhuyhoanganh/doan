package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Play;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlayRepository extends JpaRepository<Play, Long> {
    @Query("SELECT DISTINCT play FROM Play play JOIN play.song song WHERE song.id = :songId")
    List<Play> findBySongId(@Param("songId") long songId);

    @Query("SELECT DISTINCT play FROM Play play JOIN play.song song WHERE song.id = :songId AND play.label = :label")
    Optional<Play> findBySongIdAndLabel(@Param("songId") long songId, @Param("label") String label);

    @Query("SELECT DISTINCT play FROM Play play WHERE play.label = :label ORDER BY play.count DESC")
    List<Play> findTopPlayCount(@Param("label") String label, Pageable pageable);
}
