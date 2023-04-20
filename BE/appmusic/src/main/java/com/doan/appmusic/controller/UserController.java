package com.doan.appmusic.controller;

import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.security.CustomUserDetails;
import com.doan.appmusic.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping("")
    public ResponseEntity<?> getAll(HttpServletRequest request, @RequestParam(required = false, defaultValue = "id") String[] sortBy, @RequestParam(required = false, defaultValue = "desc") String[] orderBy, @RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "10") Integer limit) {

        page = page < 1 ? 1 : page;
        limit = limit < 0 ? 10 : limit;
        sortBy = sortBy.length == 0 ? new String[]{"id"} : sortBy;
        orderBy = orderBy.length == 0 ? new String[]{"desc"} : orderBy;

        Map<String, String[]> query = new HashMap<>(request.getParameterMap());
        query.remove("page");
        query.remove("limit");
        query.remove("sortBy");
        query.remove("orderBy");

        List<UserDTO> users = service.getAll(page - 1, limit, sortBy, orderBy, query);
        long count = service.count(query);
        ResponseDTO<?> response = ResponseDTO.builder().data(users).results(count).page(page).limit(limit).build();
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
        if (isAuthenticatedUser(authentication, id) || isAdmin(authentication)) {
            UserDTO userUpdated = service.update(id, userDTO);
            ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().data(userUpdated).build();
            return ResponseEntity.ok(response);
        }
        throw new AuthenticationException("You do not have the authority to perform this action");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) throws AuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(authentication)) {
            service.delete(id);
            return ResponseEntity.noContent().build();
        }
        throw new AuthenticationException("You do not have the authority to perform this action");
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals(
                "ROLE_ADMIN"));
    }

    private boolean isAuthenticatedUser(Authentication authentication, long id) {
        return ((CustomUserDetails) authentication.getPrincipal()).getUser().getId().equals(id);
    }
}
