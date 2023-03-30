package com.doan.appmusic.controller;

import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.model.PlaylistDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.security.CustomUserDetails;
import com.doan.appmusic.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {
    @Autowired
    private PlaylistService service;

    @GetMapping("")
    public ResponseEntity<?> getAll(HttpServletRequest request, @RequestParam(required = false, defaultValue = "id") String[] sortBy, @RequestParam(required = false, defaultValue = "desc") String[] orderBy, @RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "10") Integer limit) {
        User user;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
        page = page < 1 ? 1 : page;
        limit = limit < 0 ? 10 : limit;
        sortBy = sortBy.length == 0 ? new String[]{"id"} : sortBy;
        orderBy = orderBy.length == 0 ? new String[]{"desc"} : orderBy;
        List<PlaylistDTO> playlists = service.getAll(user.getId());
        long count = service.count(user.getId());
        ResponseDTO<?> response = ResponseDTO.builder().data(playlists).results(count).page(page).limit(limit).build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        User user;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
        PlaylistDTO playlist = service.getById(Long.parseLong(id), user.getId());
        ResponseDTO<?> response = ResponseDTO.builder().data(playlist).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody PlaylistDTO playlistDTO) {
        User user;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
        PlaylistDTO playlist = service.createPlaylist(playlistDTO, user.getId());
        ResponseDTO<?> response = ResponseDTO.builder().code(HttpStatus.CREATED.value()).data(playlist).build();
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(playlist.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody PlaylistDTO playlistDTO) {
        User user;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
        PlaylistDTO playlist = service.updatePlaylist(id, playlistDTO, user.getId());
        ResponseDTO<?> response = ResponseDTO.builder().data(playlist).build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        User user;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
        service.deletePlaylist(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{playlistId}/add/{songId}")
    public ResponseEntity<?> addSong(@PathVariable String playlistId, @PathVariable String songId) {
        User user;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
        PlaylistDTO playlist = service.addSong(Long.parseLong(songId), Long.parseLong(playlistId), user.getId());
        ResponseDTO<?> response = ResponseDTO.builder().data(playlist).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{playlistId}/remove/{songId}")
    public ResponseEntity<?> removeSong(@PathVariable String playlistId, @PathVariable String songId) {
        User user;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
        PlaylistDTO playlist = service.removeSong(Long.parseLong(songId), Long.parseLong(playlistId), user.getId());
        ResponseDTO<?> response = ResponseDTO.builder().data(playlist).build();
        return ResponseEntity.ok(response);
    }
}
