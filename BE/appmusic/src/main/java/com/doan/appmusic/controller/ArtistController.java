package com.doan.appmusic.controller;

import com.doan.appmusic.model.ArtistDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.service.ArtistService;
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
@RequestMapping("/api/artists")
public class ArtistController {
    @Autowired
    private ArtistService service;

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

        List<ArtistDTO> artists = service.getAll(page - 1, limit, sortBy, orderBy, query);
        long count = service.count(query);
        ResponseDTO<?> response = ResponseDTO.builder().data(artists).results(count).page(page).limit(limit).build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getById(@PathVariable String slug) {
        ArtistDTO artistDTO = service.getBySlug(slug);
        ResponseDTO<?> response = ResponseDTO.builder().data(artistDTO).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ArtistDTO artistDTO) {
        ArtistDTO artistCreated = service.create(artistDTO);
        ResponseDTO<?> response = ResponseDTO.builder().code(HttpStatus.CREATED.value()).data(artistCreated).build();
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(artistCreated.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody ArtistDTO artistDTO) {
        ArtistDTO artistUpdated = service.update(id, artistDTO);
        ResponseDTO<?> response = ResponseDTO.builder().data(artistUpdated).build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
