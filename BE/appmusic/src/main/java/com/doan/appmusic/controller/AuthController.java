package com.doan.appmusic.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.security.SecurityConstants;
import com.doan.appmusic.service.UserService;
import com.doan.appmusic.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private UserService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        UserDTO userCreated = service.create(userDTO);
        ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().code(HttpStatus.CREATED.value()).data(userCreated).build();
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(userCreated.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) throws IOException {
        try {
            String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authorizationHeader == null && !authorizationHeader.startsWith(SecurityConstants.TOKEN_PREFIX))
                throw new RuntimeException("Refresh token is missing");

            String refreshToken = authorizationHeader.substring(SecurityConstants.TOKEN_PREFIX.length());

            DecodedJWT decodedJWT = JwtUtils.decodeToken(refreshToken);

            if (!decodedJWT.getClaim("type").asString().equals("refresh_token"))
                throw new RuntimeException("Invalid token");

            UserDTO userDTO = service.findByUserName(decodedJWT.getSubject());

            String subject = userDTO.getUsername();
            String issuer = request.getRequestURL().toString();
            Map<String, String> claims = new HashMap<>();
            claims.put("roles", JwtUtils.populateAuthorities(userDTO.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getRoleName())).collect(Collectors.toList())));
            String accessToken = JwtUtils.generateToken(subject, 24 * 60 * 60 * 1000, issuer, claims);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("access_token", accessToken);
            tokens.put("refresh_token", refreshToken);
            claims.put("type", "access_token");
            ResponseDTO<?> responseBody = ResponseDTO.builder().data(tokens).code(HttpStatus.CREATED.value()).build();
            URI location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
            return ResponseEntity.created(location).body(responseBody);
        } catch (Exception exception) {
            ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.FORBIDDEN.value()).build();
            return ResponseEntity.badRequest().body(responseBody);
        }
    }
}
