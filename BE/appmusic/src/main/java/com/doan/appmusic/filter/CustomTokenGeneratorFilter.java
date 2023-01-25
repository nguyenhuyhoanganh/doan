package com.doan.appmusic.filter;

import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.utils.JwtUtils;
import com.doan.appmusic.utils.Mapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
public class CustomTokenGeneratorFilter extends UsernamePasswordAuthenticationFilter {
    private AuthenticationManager authenticationManager;

    // authenticationManager được lấy từ bean khởi tạo trong lớp config
    // authenticationManager trong class cha trả về null
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        if (!request.getMethod().equals("POST"))
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        try {
            byte[] inputStreamBytes = StreamUtils.copyToByteArray(request.getInputStream());
            Map<String, String> jsonRequest = new ObjectMapper().readValue(inputStreamBytes, Map.class);
            String username = jsonRequest.get("username");
            String password = jsonRequest.get("password");
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            return authenticationManager.authenticate(authenticationToken);
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage());
        }
    }

    // thay vì mặc định đưa user đã authenticated vào context
    // => trả lại token khi login
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        String subject = authentication.getName();
        String issuer = request.getRequestURL().toString();
        Map<String, String> claims = new HashMap<>();
        claims.put("roles", JwtUtils.populateAuthorities(authentication.getAuthorities()));
        claims.put("type", "access_token");
        String accessToken = JwtUtils.generateToken(subject, 24 * 60 * 60 * 1000, issuer, claims);
        Map<String, String> refreshTokenClaims = new HashMap<>();
        refreshTokenClaims.put("type", "refresh_token");
        String refreshToken = JwtUtils.generateToken(subject, 10 * 24 * 60 * 60 * 1000, issuer, refreshTokenClaims);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);
        tokens.put("refresh_token", refreshToken);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.OK.value());
        ResponseDTO<?> responseBody = ResponseDTO.builder().data(tokens).code(HttpStatus.OK.value()).build();
        Mapper.writeValue(response.getOutputStream(), responseBody);
    }
}

