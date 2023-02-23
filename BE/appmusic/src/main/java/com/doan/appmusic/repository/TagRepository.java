package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long>, JpaSpecificationExecutor<Tag> {
    Optional<Tag> findByTitle(String title);
    Optional<Tag> findBySlug(String slug);
    List<Tag> findByTitleContainingIgnoreCase(String title, PageRequest pageRequest);
    long countByTitle(String title);
}
