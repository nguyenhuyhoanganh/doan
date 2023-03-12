package com.doan.appmusic.controller;

import com.doan.appmusic.model.AlbumDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    @Autowired
    private AlbumService service;

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

        List<AlbumDTO> albums = service.getAll(page - 1, limit, sortBy, orderBy, query);
        long count = service.count(query);
        ResponseDTO<?> response = ResponseDTO.builder().data(albums).results(count).page(page).limit(limit).build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getById(@PathVariable String slug) {
        AlbumDTO albumDTO = service.getBySlug(slug);
        ResponseDTO<AlbumDTO> response = ResponseDTO.<AlbumDTO>builder().data(albumDTO).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody AlbumDTO albumDTO) {
        AlbumDTO albumCreated = service.create(albumDTO);
        ResponseDTO<?> response = ResponseDTO.builder().code(HttpStatus.CREATED.value()).data(albumCreated).build();
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(albumCreated.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody AlbumDTO albumDTO) {
        AlbumDTO albumUpdated = service.update(id, albumDTO);
        ResponseDTO<AlbumDTO> response = ResponseDTO.<AlbumDTO>builder().data(albumUpdated).build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
