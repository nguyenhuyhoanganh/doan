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
@Table(name = "artists")
public class Artist extends UpdateAuditable {
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

    @ManyToMany(mappedBy = "artists")
    private List<Song> songs;

    @ManyToMany()
    @JoinTable(name = "artists_albums", joinColumns = @JoinColumn(name = "artist_id"), inverseJoinColumns = @JoinColumn(name = "album_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"artist_id", "album_id"}))
    private List<Album> albums;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "artist", orphanRemoval = true)
    private List<ArtistFollow> follows;

    private Long followCount;

    public void incrementFollowCount() {
        this.followCount++;
    }

    public void decrementFollowCount() {
        this.followCount--;
    }
}
