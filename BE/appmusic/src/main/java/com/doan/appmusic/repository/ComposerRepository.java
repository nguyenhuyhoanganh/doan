package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Composer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ComposerRepository extends JpaRepository<Composer, Long>, JpaSpecificationExecutor<Composer> {
    Optional<Composer> findBySlug(String slug);
}
