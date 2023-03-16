package com.doan.appmusic.entity;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "albums")
public class Album extends UpdateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    private String description;

    private String backgroundImageUrl;

    private String thumbnailUrl;

    @ManyToMany(mappedBy = "albums")
    private List<Artist> artists;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "album", orphanRemoval = true)
    private List<Song> songs;
}
