package com.doan.appmusic.repository;

import com.doan.appmusic.entity.ArtistFollow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtistFollowRepository extends JpaRepository<ArtistFollow, Long> {
    Optional<ArtistFollow> findByUserIdAndArtistId(long userId, long artistId);
}
