package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Song;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SongRepository extends JpaRepository<Song, Long>, JpaSpecificationExecutor<Song> {
    Optional<Song> findBySlug(String slug);
    Optional<Song> findByTitle(String title);
    @Query("SELECT DISTINCT song FROM Song song JOIN song.album album JOIN song.composer composer " +
            "JOIN song.artists artist " +
            "WHERE song.title LIKE :search OR album.title LIKE :search " +
            "OR composer.fullName LIKE :search OR artist.fullName LIKE :search ")
    List<Song> search(@Param("search") String search, PageRequest pageRequest);
}
