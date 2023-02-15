package com.doan.appmusic.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "comments")
public class Comment extends CreateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "song_id")
    private Song song;

    private String content;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "comment", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<CommentLike> likes;

    private Long likeCount;

    private Long replyCount;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;
}
