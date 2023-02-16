package com.doan.appmusic.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlbumDTO {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    @NotBlank(message = "Title is required", groups = {OnCreate.class, OnUpdate.class})
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String title;

    @NotBlank(message = "Slug is required", groups = {OnCreate.class, OnUpdate.class})
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String slug;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String description;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String backgroundImageUrl;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<ArtistDTO> artists;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<SongDTO> songs;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date updatedAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UserDTO createdBy;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UserDTO updatedBy;
}
