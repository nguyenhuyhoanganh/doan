package com.doan.appmusic.entity;

import com.doan.appmusic.enums.Gender;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "composers")
public class Composer extends UpdateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender = Gender.UNKNOWN;

    @Column(unique = true, nullable = false)
    private String slug;

    private String description;

    private String avatarUrl;

    private String backgroundImageUrl;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "composer", orphanRemoval = true)
    private List<Song> songs;

}