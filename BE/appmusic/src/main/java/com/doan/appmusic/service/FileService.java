package com.doan.appmusic.service;

import com.doan.appmusic.entity.File;
import com.doan.appmusic.enums.StorageOption;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.model.FileDTO;
import com.doan.appmusic.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Optional;


public interface FileService {
    FileDTO saveFile(MultipartFile file, StorageOption storageOption) throws Exception;

    FileDTO getFile(String fileId) throws Exception;

    void deleteFile(String id);
}

@Service
@Transactional
class FileServiceImpl implements FileService {
    @Autowired
    private FileRepository repository;

    @Override
    public FileDTO saveFile(MultipartFile file, StorageOption storageOption) {
        File fileUpload = null;
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            if (storageOption == StorageOption.LOCAL) {
                String ext = fileName.substring(fileName.lastIndexOf("."));
                String newFileName = System.currentTimeMillis() + ext;
                Path uploadPath = null;
                if (file.getContentType().startsWith("audio")) {
                    uploadPath = Paths.get(".\\src\\main\\resources\\audio\\");
                }
                if (file.getContentType().startsWith("image")) {
                    uploadPath = Paths.get(".\\src\\main\\resources\\image\\");
                }
                if (file.getContentType().startsWith("video")) {
                    uploadPath = Paths.get(".\\src\\main\\resources\\video\\");
                }
                if (uploadPath != null && !Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                InputStream inputStream = file.getInputStream();
                Path filePath = uploadPath.resolve(newFileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                File attachment = File.builder().name(newFileName).type(file.getContentType()).storageOption(storageOption).build();
                fileUpload = repository.save(attachment);
            }

            if (storageOption == StorageOption.DATABASE) {
                File attachment = File.builder().name(fileName).type(file.getContentType()).data(file.getBytes()).storageOption(storageOption).build();
                fileUpload = repository.save(attachment);
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new CommonException("Could not save File: " + fileName);
        }
        if (fileUpload == null) throw new CommonException("File saving method not found");
        return FileDTO.builder().id(fileUpload.getId()).name(fileUpload.getName()).type(fileUpload.getType()).storageOption(fileUpload.getStorageOption()).build();
    }

    @Override
    public FileDTO getFile(String fileId) {
        File file = repository.findById(Long.parseLong(fileId)).orElseThrow(() -> new CommonException("File not found with Id: " + fileId));
        if (file.getStorageOption() == StorageOption.LOCAL) {
            try {
                String uploadPath = ".\\src\\main\\resources\\";
                if (file.getType().startsWith("audio")) uploadPath = uploadPath + "audio\\";
                if (file.getType().startsWith("image")) uploadPath = uploadPath + "image\\";
                if (file.getType().startsWith("video")) uploadPath = uploadPath + "video\\";
                java.io.File fileLocal = new java.io.File(uploadPath + java.io.File.separator + file.getName());
                FileInputStream fis = new FileInputStream(fileLocal);
                return FileDTO.builder().name(file.getName()).type(file.getType()).data(fis.readAllBytes()).build();
            } catch (Exception exception) {
                throw new CommonException("Cant find file in local");
            }
        }
        if (file.getStorageOption() == StorageOption.DATABASE) {
            return FileDTO.builder().name(file.getName()).type(file.getType()).data(file.getData()).build();
        }
        throw new CommonException("Invalid file saved");
    }

    @Override
    public void deleteFile(String id) {
        Optional<File> fileOptional = repository.findById(Long.parseLong(id));
        if(fileOptional.isPresent()) {
            File file = fileOptional.get();
            StorageOption storageOption = file.getStorageOption();
            if(storageOption.equals(StorageOption.LOCAL)) {
                String folderPath = ".\\src\\main\\resources\\";
                if (file.getType().startsWith("audio")) folderPath = folderPath + "audio\\";
                if (file.getType().startsWith("image")) folderPath = folderPath + "image\\";
                if (file.getType().startsWith("video")) folderPath = folderPath + "video\\";
                java.io.File fileLocal = new java.io.File(folderPath + java.io.File.separator + file.getName());
                if (fileLocal.exists()) {
                    fileLocal.delete();
                }
            }
            repository.delete(file);
        }
    }

}