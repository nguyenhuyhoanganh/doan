package com.doan.appmusic.service;

import com.doan.appmusic.entity.Role;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.repository.RoleRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public interface RoleService {
    List<RoleDTO> getAll(int page, int limit, String sortBy, String orderBy, String roleName);

    RoleDTO getById(long id);

    RoleDTO create(RoleDTO roleDTO);

    RoleDTO update(long id, RoleDTO roleDTO);

    void delete(long id);

    long count(String roleName);
}

@Service
@Transactional
class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository repository;

    @Override
    public List<RoleDTO> getAll(int page, int limit, String sortBy, String orderBy, String roleName) {
        List<Sort.Order> sortList = new ArrayList<>();
        if (orderBy.equals("desc")) sortList.add(new Sort.Order(Sort.Direction.DESC, sortBy));
        if (orderBy.equals("asc")) sortList.add(new Sort.Order(Sort.Direction.ASC, sortBy));
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(sortList));

        List<Role> roles = repository.findByRoleNameContainingIgnoreCase(roleName, pageRequest);
        return roles.stream().map(role -> convertToDTO(role)).collect(Collectors.toList());
    }

    @Override
    public RoleDTO getById(long id) {
        Role role = repository.findById(id).orElseThrow(() -> new CommonException("Role not found"));
        return convertToDTO(role);
    }

    @Override
    public RoleDTO create(RoleDTO roleDTO) {
        Role role = convertToEntity(roleDTO);
        return convertToDTO(repository.save(role));
    }

    @Override
    public RoleDTO update(long id, RoleDTO roleDTO) {
        if (repository.findById(id).isPresent()) {
            Role role = convertToEntity(roleDTO);
            role.setId(id);
            return convertToDTO(repository.save(role));
        }
        throw new CommonException("Role not found");
    }

    @Override
    public void delete(long id) {
        Role role = repository.findById(id).orElseThrow(() -> new CommonException("Role not found"));
        repository.delete(role);
    }

    @Override
    public long count(String roleName) {
        return repository.countByRoleName(roleName);
    }

    private RoleDTO convertToDTO(Role role) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        return mapper.map(role, RoleDTO.class);
    }


    private Role convertToEntity(RoleDTO roleDTO) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        mapper.createTypeMap(RoleDTO.class, Role.class).addMappings(mapping -> mapping.skip(Role::setId));
        return mapper.map(roleDTO, Role.class);
    }

}
