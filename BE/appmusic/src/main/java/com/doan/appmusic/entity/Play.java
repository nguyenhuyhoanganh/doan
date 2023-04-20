package com.doan.appmusic.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@ToString
@Table(name = "plays")
public class Play {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "song_id")
    private Song song;

    private LocalDateTime time;

    private long count;

    private String label;

    public void incrementCount() {
        this.count++;
    }
}
