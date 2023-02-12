package com.doan.appmusic.filter;

import com.doan.appmusic.entity.User;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.security.CustomUserDetails;
import com.doan.appmusic.security.SecurityConstants;
import com.doan.appmusic.utils.JwtUtils;
import com.doan.appmusic.utils.Mapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
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
import java.util.stream.Collectors;

public class CustomTokenGeneratorFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    public CustomTokenGeneratorFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    // authenticationManager được lấy từ bean khởi tạo trong lớp config
    // authenticationManager trong class cha trả về null
    @SneakyThrows
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        if (!request.getMethod().equals("POST"))
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        try {
            byte[] inputStreamBytes = StreamUtils.copyToByteArray(request.getInputStream());
            Map<String, String> jsonRequest = new ObjectMapper().readValue(inputStreamBytes, Map.class);
            String email = jsonRequest.get("email");
            String password = jsonRequest.get("password");
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
            return authenticationManager.authenticate(authenticationToken);
        } catch (Exception exception) {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpStatus.FORBIDDEN.value());
            ResponseDTO<?> responseBody = ResponseDTO.builder().message("Email or password is incorrect").code(HttpStatus.FORBIDDEN.value()).build();
            Mapper.writeValue(response.getOutputStream(), responseBody);
        }
        return null;
    }

    // thay vì mặc định đưa user đã authenticated vào context
    // => trả lại token khi login
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        UserDTO user = entityMapToModel(((CustomUserDetails) authentication.getPrincipal()).getUser());

        String subject = authentication.getName();
        String issuer = request.getRequestURL().toString();
        String roles = JwtUtils.populateAuthorities(authentication.getAuthorities());
        Map<String, String> claims = Map.of("roles", roles, "type", "access_token");
        String accessToken = JwtUtils.generateToken(subject, SecurityConstants.ACCESS_TOKEN_LIFE_TIME, issuer, claims);
        String refreshToken = JwtUtils.generateToken(subject, SecurityConstants.REFRESH_TOKEN_LIFE_TIME, issuer, Map.of("type", "refresh_token"));

        Map<String, Object> data = new HashMap<>();
        data.put("access_token", accessToken);
        data.put("refresh_token", refreshToken);
        data.put("user", user);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.OK.value());
        ResponseDTO<?> responseBody = ResponseDTO.builder().data(data).code(HttpStatus.OK.value()).build();
        Mapper.writeValue(response.getOutputStream(), responseBody);
    }

    private UserDTO entityMapToModel(User user) {
        return UserDTO.builder().id(user.getId()).email(user.getEmail()).firstName(user.getFirstName()).lastName(user.getLastName()).username(user.getUsername()).password("[SECURED]").phone(user.getPhone()).photoUrl(user.getAvatarUrl()).createdAt(user.getCreatedAt()).updatedAt(user.getUpdatedAt()).gender(user.getGender()).roles(user.getRoles().stream().map(role -> RoleDTO.builder().id(role.getId()).roleName(role.getRoleName()).updatedAt(role.getUpdatedAt()).createdAt(role.getCreatedAt()).build()).collect(Collectors.toSet())).build();
    }
}

