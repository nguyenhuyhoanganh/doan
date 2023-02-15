package com.doan.appmusic.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

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

    @ManyToMany(mappedBy = "albums", cascade = CascadeType.REMOVE)
    private Set<Artist> artists;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "album", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Song> songs;
}
