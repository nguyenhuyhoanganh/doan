package com.doan.appmusic.config;

import com.doan.appmusic.entity.User;
import com.doan.appmusic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JPAConfiguration {
    @Autowired
    private UserRepository repository;

    @Bean
    public AuditorAware<User> auditorProvider() {
        return new AuditorAware<User>() {
            @Override
            public Optional<User> getCurrentAuditor() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null) return Optional.empty();
                String username = authentication.getName();
                User user = repository.findByUsername(username).orElse(null);
                return Optional.ofNullable(user);
            }
        };
    }
}
