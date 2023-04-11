package com.doan.appmusic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayDTO {
    private long id;

    private SongDTO song;

    private LocalDateTime time;

    private long count;

    private String label;
}
