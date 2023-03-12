package com.doan.appmusic.controller;

import com.doan.appmusic.model.CommentDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.model.SongDTO;
import com.doan.appmusic.service.CommentService;
import com.doan.appmusic.service.SongService;
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
@RequestMapping("/api/songs")
public class SongController {
    @Autowired
    private SongService service;
    @Autowired
    private CommentService commentService;

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

        List<SongDTO> songs = service.getAll(page - 1, limit, sortBy, orderBy, query);
        long count = service.count(query);
        ResponseDTO<?> response = ResponseDTO.builder().data(songs).results(count).page(page).limit(limit).build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getById(@PathVariable String slug) {
        SongDTO songDTO = service.getBySlug(slug);
        ResponseDTO<?> response = ResponseDTO.builder().data(songDTO).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody SongDTO songDTO) {
        SongDTO songCreated = service.create(songDTO);
        ResponseDTO<?> response = ResponseDTO.builder().code(HttpStatus.CREATED.value()).data(songCreated).build();
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(songCreated.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody SongDTO songDTO) {
        SongDTO songUpdated = service.update(id, songDTO);
        ResponseDTO<?> response = ResponseDTO.builder().data(songUpdated).build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{songId}/comments")
    public ResponseEntity<?> getCommentsById(@RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "10") Integer limit, @PathVariable long songId) {
        page = page < 1 ? 1 : page;
        limit = limit < 0 ? 10 : limit;

        List<CommentDTO> comments = commentService.findCommentBySongId(page - 1, limit, songId);
        ResponseDTO<?> response = ResponseDTO.builder().data(comments).limit(limit).page(page).build();
        return ResponseEntity.ok(response);
    }
}
