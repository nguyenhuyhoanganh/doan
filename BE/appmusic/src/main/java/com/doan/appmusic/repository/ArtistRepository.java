package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long>, JpaSpecificationExecutor<Artist> {
    Optional<Artist> findBySlug(String slug);

    @Query("SELECT artist FROM Artist artist JOIN artist.albums album " +
            "WHERE album.id = :albumId")
    List<Artist> findByAlbumId(@Param("albumId") long id);
}
