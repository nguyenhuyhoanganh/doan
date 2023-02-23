package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long>, JpaSpecificationExecutor<Album> {
    Optional<Album> findByTitle(String title);

    Optional<Album> findBySlug(String slug);
}
