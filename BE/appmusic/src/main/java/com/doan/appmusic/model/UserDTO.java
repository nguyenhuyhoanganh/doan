package com.doan.appmusic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import javax.validation.constraints.NotBlank;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    private String firstName;

    private String lastName;

    @NotBlank
    private String email;

    @NotBlank
    private Long phone;

    private String photoUrl;

    private Set<RoleDTO> roles;


}
