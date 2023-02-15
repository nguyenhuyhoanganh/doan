package com.doan.appmusic.model;

import com.fasterxml.jackson.annotation.JsonInclude;

public class PlaylistDTO {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

//    @JsonInclude(JsonInclude.Include.NON_NULL)
//    private Set<Song> songs;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String title;
}
