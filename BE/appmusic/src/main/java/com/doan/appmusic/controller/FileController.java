package com.doan.appmusic.controller;

import com.doan.appmusic.entity.File;
import com.doan.appmusic.model.FileDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Autowired
    private FileService service;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        File fileUpload = service.saveFile(file);
        String downloadURl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/")
                .path(fileUpload.getId().toString())
                .toUriString();
        FileDTO fileDTO =
                FileDTO.builder().id(fileUpload.getId()).name(fileUpload.getName()).type(fileUpload.getType()).url(downloadURl).build();

        ResponseDTO<FileDTO> response =
                ResponseDTO.<FileDTO>builder().code(HttpStatus.CREATED.value()).data(fileDTO).build();
        URI location =
                ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(fileUpload.getId()).toUri();
        return ResponseEntity.created(location).body(response);

    }

    @GetMapping("/{fileId}")
    public ResponseEntity<?> downloadFile(@PathVariable String fileId) throws Exception {
        File file = service.getFile(fileId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getName()
                                + "\"")
                .body(new ByteArrayResource(file.getData()));
    }

}
