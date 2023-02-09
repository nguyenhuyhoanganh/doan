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
@Table(name = "playlists")
public class Playlist extends CreateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(name = "playlist_song", joinColumns = @JoinColumn(name = "playlist_id"), inverseJoinColumns =
    @JoinColumn(name = "song_id"), uniqueConstraints = @UniqueConstraint(columnNames = {"playlist_id", "song_id"}))
    private Set<Song> songs;

    private String name;

    private StatusEnum status;
}
