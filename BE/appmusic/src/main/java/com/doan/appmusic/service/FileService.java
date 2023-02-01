package com.doan.appmusic.service;

import com.doan.appmusic.entity.File;
import com.doan.appmusic.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;


public interface FileService {
    File saveFile(MultipartFile file) throws Exception;

    File getFile(String fileId) throws Exception;
}

@Service
@Transactional
class FileServiceImpl implements FileService {
    @Autowired
    private FileRepository repository;

    @Override
    public File saveFile(MultipartFile file) throws Exception {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }
            File attachment = File.builder().name(fileName).type(file.getContentType()).data(file.getBytes()).build();
            return repository.save(attachment);

        } catch (Exception e) {
            throw new RuntimeException("Could not save File: " + fileName);
        }
    }

    @Override
    public File getFile(String fileId) throws Exception {
        return repository.findById(Long.parseLong(fileId)).orElseThrow(() -> new Exception("File not found with Id: " + fileId));
    }
}