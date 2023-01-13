package com.doan.appmusic.service;

import com.doan.appmusic.entity.User;
import com.doan.appmusic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<User> {

    @Autowired
    private UserRepository repository;

    @Override
    public Optional<User> getCurrentAuditor() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return repository.findByUsername(username);
    }
}
