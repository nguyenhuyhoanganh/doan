package com.doan.appmusic.entity;

import com.doan.appmusic.enums.StorageOption;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "files")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;
    @Lob
    private byte[] data;

    @Enumerated(EnumType.STRING)
    private StorageOption storageOption;
}
