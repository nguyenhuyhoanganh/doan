package com.doan.appmusic.controller;

import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleService service;

    @GetMapping("")
    public ResponseEntity<?> getAll(@RequestParam(required = false, defaultValue = "") String roleName, @RequestParam(required = false, defaultValue = "id") String sortBy, @RequestParam(required = false, defaultValue = "asc") String orderBy, @RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "10") Integer limit) {
        page = page < 1 ? 1 : page;
        limit = limit < 0 ? 10 : limit;

        List<RoleDTO> roles = service.findByRoleName(page - 1, limit, sortBy, orderBy, roleName);
        long count = service.count(roleName);
        ResponseDTO<?> response = ResponseDTO.builder().data(roles).results(count).limit(limit).page(page).build();
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
