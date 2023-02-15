package com.doan.appmusic.repository;

import com.doan.appmusic.entity.SongLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongLikeRepository extends JpaRepository<SongLike, Long> {
}
