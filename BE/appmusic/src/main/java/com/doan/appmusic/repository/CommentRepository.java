package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Comment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findBySongId(Long songId, PageRequest pageRequest);
}
