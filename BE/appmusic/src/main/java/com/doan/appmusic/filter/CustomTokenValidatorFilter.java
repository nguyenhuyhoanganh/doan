package com.doan.appmusic.filter;

import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.security.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.Data;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Data
public class CustomTokenValidatorFilter extends OncePerRequestFilter {
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (!request.getServletPath().equals("/api/login") && !request.getServletPath().equals("/api/refresh-token") && !request.getServletPath().equals("/api/register") && !request.getServletPath().equals("/api/logout")) {
            String token = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (jwtUtils.isBearerToken(token)) {
                try {
                    if (!jwtUtils.isAccessToken(token)) throw new CommonException("Invalid token");
                    Authentication authentication = jwtUtils.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    filterChain.doFilter(request, response);
                } catch (Exception exception) {
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.FORBIDDEN.value()).build();
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.findAndRegisterModules();
                    objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
                    objectMapper.writeValue(response.getOutputStream(), responseBody);
                }
                return;
            }
            filterChain.doFilter(request, response);
            return;
        }
        filterChain.doFilter(request, response);
        return;
    }
}