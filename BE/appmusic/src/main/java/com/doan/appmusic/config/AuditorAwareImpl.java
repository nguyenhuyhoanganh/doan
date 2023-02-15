package com.doan.appmusic.config;

import com.doan.appmusic.entity.User;
import com.doan.appmusic.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.AuditorAware;

import javax.transaction.Transactional;
import java.util.Optional;

@Slf4j
@Data
@AllArgsConstructor
@Transactional
public class AuditorAwareImpl implements AuditorAware<User> {

    private UserRepository repository;

    @Override
    public Optional<User> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }
        String email = authentication.getName();
        User user = repository.findByEmail(email).orElse(null);
        log.info("User '{}' with id {} is set as auditor", user.getEmail(), user.getId());
        return Optional.of(user);
    }
}
