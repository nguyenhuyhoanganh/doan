package com.doan.appmusic.model;

import com.doan.appmusic.enums.Status;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SongDTO {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String title;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String slug;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Status status;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String imageUrl;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String backgroundImageUrl;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long duration;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long view;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String lyrics;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String description;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<String> sourceUrls;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<TagDTO> tags;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<CategoryDTO> categories;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<ArtistDTO> artists;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private AlbumDTO album;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ComposerDTO composer;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<CommentDTO> comments;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long commentCount;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<SongLikeDTO> likes;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long likeCount;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date updatedAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UserDTO createdBy;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UserDTO updatedBy;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private boolean isLiked = false;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private int rankChange;
}
