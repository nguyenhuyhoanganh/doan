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
// uniqueConstraints ràng buộc cặp created_by và slug là duy nhất
@Table(name = "playlists", uniqueConstraints = {@UniqueConstraint(columnNames = {"created_by", "slug"}),
        @UniqueConstraint(columnNames = {"created_by", "title"}), @UniqueConstraint(columnNames = {"title", "slug"})})
public class Playlist extends CreateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(cascade = CascadeType.REMOVE)
    @JoinTable(name = "playlists_songs", joinColumns = @JoinColumn(name = "playlist_id"), inverseJoinColumns = @JoinColumn(name = "song_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"playlist_id", "song_id"}))
    private Set<Song> songs;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String slug;

    @Enumerated(EnumType.STRING)
    private StatusEnum status;
}
