package com.doan.appmusic.controller;


import com.doan.appmusic.enums.StorageOption;
import com.doan.appmusic.model.FileDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.service.FileService;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Autowired
    private FileService service;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam(required = false,
            defaultValue = "DATABASE") StorageOption storageOption) throws Exception {

        FileDTO fileUpload = service.saveFile(file, storageOption);
        String downloadUrl =
                ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/files/download/").path(fileUpload.getId().toString()).toUriString();

        Map<String, Object> response = new HashMap<>();
        response.put("id", fileUpload.getId());
        response.put("name", fileUpload.getName());
        response.put("type", fileUpload.getType());
        response.put("download_url", downloadUrl);
        response.put("storage_option", storageOption);

        if (fileUpload.getType().startsWith("audio")) {
            FFmpegFrameGrabber frameGrabber = new FFmpegFrameGrabber(file.getInputStream());
            frameGrabber.start();
            long duration = (long) (frameGrabber.getLengthInAudioFrames() / frameGrabber.getAudioFrameRate());
            Map<String, String> metadata = frameGrabber.getMetadata();
            frameGrabber.stop();
            response.put("duration", duration);
            response.put("meta_data", metadata);
        }

        return ResponseEntity.ok().body(ResponseDTO.builder().code(HttpStatus.CREATED.value()).data(response).build());
    }

    @GetMapping("download/{fileId}")
    public ResponseEntity<?> downloadFile(@PathVariable String fileId) throws Exception {
        FileDTO file = service.getFile(fileId);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(file.getType())).header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"").body(new ByteArrayResource(file.getData()));
    }

}
