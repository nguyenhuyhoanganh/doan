package com.doan.appmusic.repository;

import com.doan.appmusic.entity.Role;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findByRoleNameContainingIgnoreCase(String roleName);
    List<Role> findByRoleNameContainingIgnoreCase(String roleName, PageRequest pageRequest);
    Role findByRoleName(String roleName);
    long countByRoleName(String roleName);
}
