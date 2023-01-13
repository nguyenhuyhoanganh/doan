package com.doan.appmusic.controller;

import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleService service;

    @GetMapping("")
    public ResponseEntity<?> getAll(HttpServletRequest request) {
        int page = request.getParameter("page") != null ? Integer.parseInt(request.getParameter("page")) : 0;
        int limit = request.getParameter("limit") != null ? Integer.parseInt(request.getParameter("limit")) : 10;
        Set<RoleDTO> roles = service.getAll(page, limit);
        long count = service.count();
        ResponseDTO<Set<RoleDTO>> response = ResponseDTO.<Set<RoleDTO>>builder().data(roles).totalPages(count / limit * limit < count ? (int) count / limit + 1 : (int) count / limit).totalElements(count).numberOfElements(limit > count ? (int) count : limit).build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable long id) {
        RoleDTO roleDTO = service.getById(id);
        ResponseDTO<RoleDTO> response = ResponseDTO.<RoleDTO>builder().data(roleDTO).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody RoleDTO roleDTO) {
        RoleDTO roleCreated = service.create(roleDTO);
        ResponseDTO<RoleDTO> response = ResponseDTO.<RoleDTO>builder().code(HttpStatus.CREATED.value()).data(roleCreated).build();
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(roleCreated.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody RoleDTO roleDTO) {
        RoleDTO roleUpdated = service.update(id, roleDTO);
        ResponseDTO<RoleDTO> response = ResponseDTO.<RoleDTO>builder().data(roleUpdated).build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
