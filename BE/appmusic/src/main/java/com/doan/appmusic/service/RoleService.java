package com.doan.appmusic.service;

import com.doan.appmusic.entity.Role;
import com.doan.appmusic.exception.NotFoundException;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.Set;

public interface RoleService {
    Set<RoleDTO> getAll(int page, int limit);

    RoleDTO getById(long id);

    RoleDTO create(RoleDTO roleDTO);

    RoleDTO update(long id, RoleDTO roleDTO);

    void delete(long id);

    long count();
}

@Service
@Transactional
class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository repository;

    @Override
    public Set<RoleDTO> getAll(int page, int limit) {
        Set<RoleDTO> roleDTOs = new HashSet<>();
        Set<Role> roles = repository.findAll(PageRequest.of(page, limit)).toSet();
        for (Role role : roles) {
            roleDTOs.add(entityMapToModel(role));
        }
        return roleDTOs;
    }

    @Override
    public RoleDTO getById(long id) {
        Role role = repository.findById(id).orElseThrow(() -> new NotFoundException("Role not found"));
        return entityMapToModel(role);
    }

    @Override
    public RoleDTO create(RoleDTO roleDTO) {
        roleDTO.setId(null);
        Role role = modelMapToEntity(roleDTO);
        return entityMapToModel(repository.save(role));
    }

    @Override
    public RoleDTO update(long id, RoleDTO roleDTO) {
        Role role = repository.findById(id).orElseThrow(() -> new NotFoundException("Role not found"));
        roleDTO.setId(role.getId());
        repository.save(modelMapToEntity(roleDTO));
        return roleDTO;
    }

    @Override
    public void delete(long id) {
        Role role = repository.findById(id).orElseThrow(() -> new NotFoundException("Role not found"));
        repository.delete(role);
    }

    @Override
    public long count() {
        return repository.count();
    }

    private RoleDTO entityMapToModel(Role role) {
        return RoleDTO.builder().id(role.getId()).roleName(role.getRoleName()).build();
    }


    private Role modelMapToEntity(RoleDTO role) {
        return Role.builder().id(role.getId()).roleName(role.getRoleName()).build();
    }

}
