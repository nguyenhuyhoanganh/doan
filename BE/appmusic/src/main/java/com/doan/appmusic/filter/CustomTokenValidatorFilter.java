package com.doan.appmusic.filter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.repository.UserRepository;
import com.doan.appmusic.security.SecurityConstants;
import com.doan.appmusic.utils.JwtUtils;
import com.doan.appmusic.utils.Mapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@AllArgsConstructor
public class CustomTokenValidatorFilter extends OncePerRequestFilter {

    private UserRepository repository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().equals("/api/login") || request.getServletPath().equals("/api/refresh-token") || request.getServletPath().equals("/api/register") || request.getServletPath().equals("/api/logout")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorizationHeader == null || !authorizationHeader.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            String token = authorizationHeader.substring(SecurityConstants.TOKEN_PREFIX.length());

            // verify token
            DecodedJWT decodedJWT = JwtUtils.decodeToken(token);
            if (!decodedJWT.getClaim("type").asString().equals("access_token"))
                throw new CommonException("Invalid token");

            // inject user to principal
            Optional<User> optionalUser = repository.findByEmail(decodedJWT.getSubject());
            if(optionalUser.isEmpty()) throw new CommonException("User is not found");
            User user = optionalUser.get();
            user.setPassword("[PROTECTED]");

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null, AuthorityUtils.commaSeparatedStringToAuthorityList(decodedJWT.getClaim("roles").asString()));

            // set authenticated
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpStatus.FORBIDDEN.value());
            ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.FORBIDDEN.value()).build();
            Mapper.writeValue(response.getOutputStream(), responseBody);
        }
    }
}