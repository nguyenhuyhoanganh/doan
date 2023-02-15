package com.doan.appmusic.entity;

import lombok.*;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "categories")
public class Category extends UpdateAuditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    private String description;

    private String imageUrl;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "parent_category_id")
    private Category parentCategory;
}
