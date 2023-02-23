package com.doan.appmusic.entity;

import lombok.*;

import javax.persistence.*;



@Data
@NoArgsConstructor
@RequiredArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tags")
//, uniqueConstraints = @UniqueConstraint(columnNames = {"title", "slug"})
public class Tag extends UpdateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NonNull
    private Long id;

    private String description;

    @Column(unique = true)
    private String title;

    @Column(unique = true)
    private String slug;
}
