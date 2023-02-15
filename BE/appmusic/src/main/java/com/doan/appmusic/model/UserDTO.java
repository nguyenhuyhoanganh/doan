package com.doan.appmusic.model;

import com.doan.appmusic.utils.GenderEnum;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    // use email to login, register
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String username;

    @NotBlank(message = "Password is required", groups = {OnCreate.class, OnUpdate.class})
    @Size(min = 6, max = 160, message = "Password length from 6 - 160 characters", groups = {OnCreate.class,
            OnUpdate.class})
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String password;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String firstName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String lastName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private GenderEnum gender;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer age;

    @NotBlank(message = "Email is required", groups = {OnCreate.class, OnUpdate.class})
    @Email(message = "Email is not valid", groups = {OnCreate.class, OnUpdate.class})
    @Size(min = 5, max = 160, message = "Email length from 5 - 160 characters", groups = {OnCreate.class, OnUpdate.class})
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String email;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long phone;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String avatarUrl;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String backgroundImageUrl;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Set<RoleDTO> roles;
}

//    @JsonInclude(JsonInclude.Include.NON_NULL)
//    private Set<PlaylistDTO> playlists;