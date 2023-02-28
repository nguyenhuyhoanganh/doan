package com.doan.appmusic.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.transaction.Transactional;
import java.util.*;

@Transactional
@AllArgsConstructor
@NoArgsConstructor
public class JwtUtils {
    private UserRepository repository;

    public String getSubject(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getSubject();
    }

    public Authentication getAuthentication(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        String email = decodedJWT.getSubject();
        User user = repository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User cannot be found"));
        CustomUserDetails userDetails = new CustomUserDetails(user);
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    public Map<String, Claim> getClaims(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getClaims();
    }

    public String generateRefreshToken(Authentication authentication) {
        JWTCreator.Builder tokenBuilder = tokenBuilder(authentication, SecurityConstants.ACCESS_TOKEN_LIFE_TIME);
        tokenBuilder.withClaim("type", "refresh_token");
        Algorithm algorithm = algorithm();
        return tokenBuilder.sign(algorithm);
    }

    public String generateAccessToken(Authentication authentication) {
        JWTCreator.Builder tokenBuilder = tokenBuilder(authentication, SecurityConstants.REFRESH_TOKEN_LIFE_TIME);
        tokenBuilder.withClaim("type", "access_token");
        Algorithm algorithm = algorithm();
        return tokenBuilder.sign(algorithm);
    }

    public boolean isBearerToken(String token) {
        return token != null && token.startsWith(SecurityConstants.TOKEN_PREFIX);
    }

    public boolean isAccessToken(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getClaim("type") != null && decodedJWT.getClaim("type").asString().equals("access_token");
    }

    public boolean isRefreshToken(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getClaim("type") != null && decodedJWT.getClaim("type").asString().equals("refresh_token");
    }

    private Algorithm algorithm() {
        return Algorithm.HMAC256(SecurityConstants.SECRET_KEY.getBytes());
    }

    private JWTCreator.Builder tokenBuilder(Authentication authentication, long time) {
        String subject = ((CustomUserDetails) authentication.getPrincipal()).getUsername();
        String roles = populateAuthorities(authentication.getAuthorities());
        JWTCreator.Builder jwtBuilder = JWT.create().withSubject(subject).withExpiresAt(new Date(System.currentTimeMillis() + time)).withClaim("roles", roles);
        return jwtBuilder;
    }

    private DecodedJWT decodeToken(String token) {
        token = token.substring(7);
        Algorithm algorithm = Algorithm.HMAC256(SecurityConstants.SECRET_KEY.getBytes());
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> collection) {
        Set<String> authoritiesSet = new HashSet<>();
        for (GrantedAuthority authority : collection) {
            authoritiesSet.add(authority.getAuthority());
        }
        return String.join(",", authoritiesSet);
    }
}
