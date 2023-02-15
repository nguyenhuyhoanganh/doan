package com.doan.appmusic.filter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.security.SecurityConstants;
import com.doan.appmusic.utils.JwtUtils;
import com.doan.appmusic.utils.Mapper;
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

public class CustomTokenValidatorFilter extends OncePerRequestFilter {
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

            DecodedJWT decodedJWT = JwtUtils.decodeToken(token);
            if (!decodedJWT.getClaim("type").asString().equals("access_token"))
                throw new CommonException("Invalid token");

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(decodedJWT.getSubject(), null, AuthorityUtils.commaSeparatedStringToAuthorityList(decodedJWT.getClaim("roles").asString()));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            System.out.println(authenticationToken);
            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpStatus.FORBIDDEN.value());
            ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.FORBIDDEN.value()).build();
            Mapper.writeValue(response.getOutputStream(), responseBody);
        }
    }
}