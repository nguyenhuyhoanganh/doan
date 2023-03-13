package com.doan.appmusic.config;

import com.doan.appmusic.filter.CustomTokenGeneratorFilter;
import com.doan.appmusic.filter.CustomTokenValidatorFilter;
import com.doan.appmusic.repository.UserRepository;
import com.doan.appmusic.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Autowired
    private UserRepository repository;

    @Bean
    public JwtUtils jwtUtils() {
        return new JwtUtils(repository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) throws Exception {

        return http.getSharedObject(AuthenticationManagerBuilder.class).userDetailsService(userDetailsService).passwordEncoder(passwordEncoder).and().build();
    }

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager, JwtUtils jwtUtils) throws Exception {
        /* cors, csrf */
        http.cors();
        http.csrf().disable();

//        http.authorizeRequests().antMatchers(HttpMethod.OPTIONS, "/**").permitAll();

        /* j_session */
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        /* matcher */
        http.authorizeRequests().mvcMatchers("/api/login", "/api/register", "/api/refresh-token/**", "/api/logout", "/api/files/upload", "/api/files/**", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/actuator/**").permitAll();
        http.authorizeRequests().anyRequest().permitAll();
//                .authenticated();

        /* add filter */
        CustomTokenGeneratorFilter customTokenGeneratorFilter = new CustomTokenGeneratorFilter();
        customTokenGeneratorFilter.setAuthenticationManager(authenticationManager);
        customTokenGeneratorFilter.setJwtUtils(jwtUtils);
        customTokenGeneratorFilter.setFilterProcessesUrl("/api/login");

        CustomTokenValidatorFilter customTokenValidatorFilter = new CustomTokenValidatorFilter();
        customTokenValidatorFilter.setJwtUtils(jwtUtils);

        http.addFilter(customTokenGeneratorFilter);
        http.addFilterBefore(customTokenValidatorFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

}
