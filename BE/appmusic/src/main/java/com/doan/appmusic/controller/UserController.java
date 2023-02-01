package com.doan.appmusic.controller;

import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import javax.servlet.http.HttpServletRequest;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping("")
    public ResponseEntity<ResponseDTO<Set<UserDTO>>> search(HttpServletRequest request) {
        int page = request.getParameter("page") != null ? Integer.parseInt(request.getParameter("page")) : 0;
        int limit = request.getParameter("limit") != null ? Integer.parseInt(request.getParameter("limit")) : 10;
        String sortBy = request.getParameter("sortBy") != null ? request.getParameter("sortBy") : "id";
        String orderBy = request.getParameter("orderBy") != null ? request.getParameter("orderBy") : "desc";
        String search = request.getParameter("search") != null ? request.getParameter("search") : "desc";
        Set<UserDTO> users = service.search(page, limit, sortBy, orderBy, search);
        long count = service.count();
        ResponseDTO<Set<UserDTO>> response = ResponseDTO.<Set<UserDTO>>builder().data(users).totalPages(count / limit * limit < count ? (int) count / limit + 1 : (int) count / limit).totalElements(count).numberOfElements(limit > count ? (int) count : limit).build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable long id) {
        UserDTO userDTO = service.getById(id);
        ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().data(userDTO).build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody UserDTO userDTO) throws AuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = false;
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals("ROLE_ADMIN")) isAdmin = true;
        }
        if (authentication.getName().equals(service.getById(id).getUsername()) || isAdmin) {
            UserDTO userUpdated = service.update(id, userDTO);
            ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().data(userUpdated).build();
            return ResponseEntity.ok(response);
        }
        throw new AuthenticationException("You do not have the authority to perform this action");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) throws AuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = false;
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals("ROLE_ADMIN")) isAdmin = true;
        }
        if (isAdmin) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        }
        throw new AuthenticationException("You do not have the authority to perform this action");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDTO user = service.findByEmail(authentication.getName());
        ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().data(user).build();
        return ResponseEntity.ok(response);
    }
}
