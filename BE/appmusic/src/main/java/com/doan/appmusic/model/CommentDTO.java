package com.doan.appmusic.model;

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
public class CommentDTO {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private SongDTO song;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String content;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<CommentLikeDTO> likes;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long likeCount;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long replyCount;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CommentDTO parentComment;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date updatedAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UserDTO createdBy;
}
