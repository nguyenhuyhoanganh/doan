package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Composer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ComposerRepository extends JpaRepository<Composer, Long>, JpaSpecificationExecutor<Composer> {
}
