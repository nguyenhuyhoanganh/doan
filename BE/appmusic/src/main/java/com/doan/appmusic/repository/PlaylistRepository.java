package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long>, JpaSpecificationExecutor<Playlist> {

    @Query("SELECT playlist FROM Playlist playlist JOIN playlist.createdBy createdBy " +
            "WHERE playlist.title = :title AND createdBy.id = :createdById")
    Optional<Playlist> findByTitle(@Param("title") String title, @Param("createdById") long createdById);

    @Query("SELECT playlist FROM Playlist playlist JOIN playlist.createdBy createdBy " +
            "WHERE playlist.id = :id AND createdBy.id = :createdById")
    Optional<Playlist> findByPlaylistId(@Param("id") long id, @Param("createdById") long createdById);

    long countByCreatedBy_Id(long userId);

    List<Playlist> findByCreatedBy_Id(long userId);
}
