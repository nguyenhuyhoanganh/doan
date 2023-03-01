package com.doan.appmusic.controller;

import com.doan.appmusic.entity.Role;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.model.OnCreate;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.security.CustomUserDetails;
import com.doan.appmusic.security.JwtUtils;
import com.doan.appmusic.service.UserService;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private UserService service;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Validated(OnCreate.class) UserDTO userDTO) {
        Authentication authentication = service.create(userDTO);
        String accessToken = jwtUtils.generateAccessToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(authentication);
        User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        Map<String, Object> data = new HashMap<>();
        data.put("access_token", accessToken);
        data.put("refresh_token", refreshToken);
        data.put("user", convertToDTO(user));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
        ResponseDTO<?> response = ResponseDTO.builder().code(HttpStatus.CREATED.value()).data(data).build();

        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) throws IOException {
        try {
            String token = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (!jwtUtils.isBearerToken(token)) throw new CommonException("Token cannot be found");
            if (!jwtUtils.isRefreshToken(token)) throw new CommonException("Invalid token");
            Authentication authentication = jwtUtils.getAuthentication(token);
            String accessToken = jwtUtils.generateAccessToken(authentication);
            String refreshToken = jwtUtils.generateRefreshToken(authentication);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("access_token", accessToken);
            tokens.put("refresh_token", refreshToken);
            ResponseDTO<?> responseBody = ResponseDTO.builder().data(tokens).code(HttpStatus.CREATED.value()).build();
            URI location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
            return ResponseEntity.created(location).body(responseBody);
        } catch (Exception exception) {
            ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.FORBIDDEN.value()).build();
            return ResponseEntity.badRequest().body(responseBody);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDTO user = service.findByEmail(authentication.getName());
        ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().data(user).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request) {
    }

    private UserDTO convertToDTO(User user) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(User.class, UserDTO.class).addMappings(mapping -> mapping.skip(UserDTO::setPassword)).setPostConverter(context -> {
            List<Role> roles = context.getSource().getRoles();
            if (roles != null)
                context.getDestination().setRoles(roles.stream().map(role -> RoleDTO.builder().roleName(role.getRoleName()).id(role.getId()).build()).collect(Collectors.toList()));
            return context.getDestination();
        });
        return mapper.map(user, UserDTO.class);
    }
}
