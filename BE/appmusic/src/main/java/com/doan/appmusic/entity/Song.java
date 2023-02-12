package com.doan.appmusic.entity;

import com.doan.appmusic.utils.StatusEnum;
import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "songs")
public class Song extends UpdateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String title;

    @Column(unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    private StatusEnum status;

    private String imageUrl;

    private String backgroundImageUrl;

    private Long duration;

    private Long view;

    private String lyrics;

    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "source_urls", joinColumns = @JoinColumn(name = "song_id"))
    @Column(name = "source_urls")
    private Set<String> sourceUrls;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "songs_tags", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"song_id", "tag_id"}))
    private Set<Tag> tags;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "songs_categories", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "category_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"song_id", "category_id"}))
    private Set<Category> categories;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "songs_artists", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "artist_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"song_id", "artist_id"}))
    private Set<Artist> artists;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "album_id")
    private Album album;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "composer_id")
    private Composer composer;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "song", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments;

    private Long commentCount;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "song", cascade = CascadeType.ALL)
    private Set<SongLike> likes;

    private Long likeCount;
}
