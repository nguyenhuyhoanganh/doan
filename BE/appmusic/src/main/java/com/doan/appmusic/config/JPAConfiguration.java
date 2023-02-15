package com.doan.appmusic.config;

import com.doan.appmusic.entity.User;
import com.doan.appmusic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditingAware")
public class JPAConfiguration {
    @Autowired
    private UserRepository repository;

    @Bean
    public AuditorAware<User> auditingAware() {
        return new AuditorAwareImpl(repository);
    }

}
