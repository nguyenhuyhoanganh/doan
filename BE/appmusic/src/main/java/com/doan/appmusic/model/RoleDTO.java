package com.doan.appmusic.model;

import com.doan.appmusic.utils.OnCreate;
import com.doan.appmusic.utils.OnUpdate;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    @NotBlank(message = "Role name is required", groups = {OnCreate.class, OnUpdate.class})
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String roleName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date updatedAt;

}
