package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findByRoleNameContainingIgnoreCase(String roleName);
    Role findByRoleName(String roleName);
}
