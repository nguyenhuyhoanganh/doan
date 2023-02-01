package com.doan.appmusic.security;

import com.doan.appmusic.filter.CustomTokenGeneratorFilter;
import com.doan.appmusic.filter.CustomTokenValidatorFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) throws Exception {

        return http.getSharedObject(AuthenticationManagerBuilder.class).userDetailsService(userDetailsService).passwordEncoder(passwordEncoder).and().build();
    }

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
        CustomTokenGeneratorFilter customTokenGeneratorFilter = new CustomTokenGeneratorFilter(authenticationManager);
        customTokenGeneratorFilter.setFilterProcessesUrl("/api/login");

        // cors, csrf
        http.cors(c -> {
            CorsConfigurationSource source = request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("*"));
                config.setAllowedMethods(List.of("*"));
                return config;
            };
            c.configurationSource(source);
        });
        http.csrf().disable();

        // session
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // matcher
//        http.authorizeRequests()
//                .mvcMatchers("/api/login", "/api/register", "/api/refresh-token/**", "/api/logout",
//                        "/api/files/upload", "/api/files/**")
//                .permitAll();
        http.authorizeRequests().anyRequest().permitAll();
//                .authenticated();

        // add filter
        http.addFilter(customTokenGeneratorFilter);
        http.addFilterBefore(new CustomTokenValidatorFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}
