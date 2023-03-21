package com.doan.appmusic.entity;

import com.doan.appmusic.enums.Status;
import lombok.*;

import javax.persistence.*;
import java.util.List;

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

    @Column(unique = true, nullable = false)
    private String title;

    private String slug;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String imageUrl;

    private String backgroundImageUrl;

    private Long duration;

    private Long view;

    private String lyrics;

    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "source_urls", joinColumns = @JoinColumn(name = "song_id"))
    @Column(name = "source_urls")
    private List<String> sourceUrls;

    @ManyToMany
    @JoinTable(name = "songs_tags", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"song_id", "tag_id"}))
    private List<Tag> tags;

    @ManyToMany
    @JoinTable(name = "songs_categories", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "category_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"song_id", "category_id"}))
    private List<Category> categories;

    @ManyToMany
    @JoinTable(name = "songs_artists", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "artist_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"song_id", "artist_id"}))
    private List<Artist> artists;

    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;

    @ManyToOne
    @JoinColumn(name = "composer_id")
    private Composer composer;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "song", orphanRemoval = true)
    private List<Comment> comments;

    private Long commentCount;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "song")
    private List<SongLike> likes;

    private Long likeCount;

    public void incrementLikeCount() {
        this.likeCount++;
    }

    public void decrementLikeCount() {
        this.likeCount--;
    }

    public void incrementCommentCount() {
        this.commentCount++;
    }

    public void decrementCommentCount() {
        this.commentCount--;
    }
}
