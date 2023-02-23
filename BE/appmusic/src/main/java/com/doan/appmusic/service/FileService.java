package com.doan.appmusic.service;

import com.doan.appmusic.entity.File;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.Objects;


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
    public File saveFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            if (fileName.contains(".."))
                throw new CommonException("Filename contains invalid path sequence " + fileName);
            File attachment = File.builder().name(fileName).type(file.getContentType()).data(file.getBytes()).build();
            return repository.save(attachment);

        } catch (Exception e) {
            throw new CommonException("Could not save File: " + fileName);
        }
    }

    @Override
    public File getFile(String fileId) {
        return repository.findById(Long.parseLong(fileId)).orElseThrow(() -> new CommonException("File not found with Id: " + fileId));
    }
}