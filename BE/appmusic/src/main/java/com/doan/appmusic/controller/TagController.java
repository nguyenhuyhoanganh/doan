package com.doan.appmusic.controller;

import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.TagDTO;
import com.doan.appmusic.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
    private TagService service;

    @GetMapping("")
    public ResponseEntity<?> getAll(@RequestParam(required = false, defaultValue = "") String title, @RequestParam(required = false, defaultValue = "id") String sortBy, @RequestParam(required = false, defaultValue = "asc") String orderBy, @RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "10") Integer limit) {
        page = page < 1 ? 1 : page;
        limit = limit < 0 ? 10 : limit;

        List<TagDTO> tags = service.findByTitle(page - 1, limit, sortBy, orderBy, title);
        long count = service.count(title);
        ResponseDTO<?> response = ResponseDTO.builder().data(tags).results(count).limit(limit).page(page).build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getById(@PathVariable String slug) {
        TagDTO tagDTO = service.getBySlug(slug);
        ResponseDTO<?> response = ResponseDTO.builder().data(tagDTO).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{slug}")
    public ResponseEntity<?> findBySlug(@PathVariable String slug) {
        TagDTO tagDTO = service.getBySlug(slug);
        ResponseDTO<?> response = ResponseDTO.builder().data(tagDTO).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody TagDTO tagDTO) {
        TagDTO tagCreated = service.create(tagDTO);
        ResponseDTO<?> response = ResponseDTO.builder().code(HttpStatus.CREATED.value()).data(tagCreated).build();
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(tagCreated.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody TagDTO tagDTO) {
        TagDTO tagUpdated = service.update(id, tagDTO);
        ResponseDTO<?> response = ResponseDTO.builder().data(tagUpdated).build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
