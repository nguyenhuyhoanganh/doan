package com.doan.appmusic.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = false)
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class UpdateAuditable extends CreateAuditable {

    @LastModifiedBy
    @JoinColumn(name = "updated_by", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User updatedBy;
}
