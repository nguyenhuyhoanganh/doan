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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name="source_urls", joinColumns=@JoinColumn(name="song_id"))
    @Column(name="source_url")
    private Set<String> sourceUrls;

    private Long duration;

    @Enumerated(EnumType.STRING)
    private StatusEnum status;

    private String slug;

    @ManyToMany
    @JoinTable(name = "song_artist", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "artist_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"song_id", "artist_id"}))
    private Set<Artist> artists;

    @ManyToMany
    @JoinTable(name = "song_tag", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"song_id", "tag_id"}))
    private Set<Tag> tags;

    @ManyToMany
    @JoinTable(name = "song_category", joinColumns = @JoinColumn(name = "song_id"), inverseJoinColumns = @JoinColumn(name = "category_id"), uniqueConstraints = {@UniqueConstraint(columnNames = {"song_id", "category_id"})})
    private Set<Category> categories;

    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments;
}
