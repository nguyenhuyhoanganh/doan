package com.doan.appmusic.entity;

import com.doan.appmusic.utils.GenderEnum;
import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "artists")
public class Artist extends UpdateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private GenderEnum gender = GenderEnum.UNKNOWN;

    @Column(unique = true, nullable = false)
    private String slug;

    private String description;

    private String avatarUrl;

    private String backgroundImageUrl;

    @ManyToMany(mappedBy = "artists", cascade = CascadeType.REMOVE)
    private Set<Song> songs;

    @ManyToMany(cascade = CascadeType.REMOVE)
    @JoinTable(name = "artists_albums", joinColumns = @JoinColumn(name = "artist_id"), inverseJoinColumns = @JoinColumn(name = "album_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"artist_id", "album_id"}))
    private Set<Album> albums;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "artist", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<ArtistFollow> follows;

    private Long followCount;
}
