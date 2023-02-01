package com.doan.appmusic.model;

import com.doan.appmusic.utils.OnCreate;
import com.doan.appmusic.utils.OnUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;
import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;

    // sử dụng email để login
    private String username;

    @NotBlank(message = "Password is required", groups = {OnCreate.class, OnUpdate.class})
    @Size(min = 6, max = 160, message = "Password length from 6 - 160 characters", groups = {OnCreate.class,
            OnUpdate.class})
    private String password;

    private String firstName;

    private String lastName;

    private String gender;

    @NotBlank(message = "Email is required", groups = {OnCreate.class, OnUpdate.class})
    @Email(message = "Email is not valid", groups = {OnCreate.class, OnUpdate.class})
    @Size(min = 5, max = 160, message = "Email length from 5 - 160 characters", groups = {OnCreate.class, OnUpdate.class})
    private String email;

    private Long phone;

    private String photoUrl;

    private Set<RoleDTO> roles;

    private Date createdAt;

    private Date updatedAt;
}