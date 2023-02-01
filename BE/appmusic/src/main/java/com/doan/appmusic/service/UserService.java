package com.doan.appmusic.service;

import com.doan.appmusic.entity.Role;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.RoleRepository;
import com.doan.appmusic.repository.UserRepository;
import com.doan.appmusic.utils.GenericSpecificationBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public interface UserService {
    UserDTO findByEmail(String email);

    Set<UserDTO> search(int page, int limit, String sortBy, String orderBy, String search);

    UserDTO getById(long id);

    UserDTO create(UserDTO userDTO);

    UserDTO update(long id, UserDTO userDTO);

    void changePassword(long id, String password);

    void delete(long id);

    long count();
}

@Service
@Transactional
class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository repository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public UserDTO findByEmail(String email) {
        return entityMapToModel(repository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found")));
    }

    @Override
    public Set<UserDTO> search(int page, int limit, String sortBy, String orderBy, String search) {
        Set<UserDTO> userDTOs = new HashSet<>();

        // search
        GenericSpecificationBuilder builder = new GenericSpecificationBuilder();
        Pattern patternSearch = Pattern.compile("(\\w+?)(:|<|>)(\\w+( +\\w+)*$?),", Pattern.UNICODE_CHARACTER_CLASS);
        Matcher matcherSearch = patternSearch.matcher(search + ",");
        while (matcherSearch.find()) {
            if (matcherSearch.group(1).compareTo("roles") == 0) {
                String keyword = matcherSearch.group(3);
                Role role = roleRepository.findByRoleNameContainingIgnoreCase(keyword).get(0);
                builder.with("roles", matcherSearch.group(2), role.getRoleName(), "Role");
            } else {
                builder.with(matcherSearch.group(1), matcherSearch.group(2), matcherSearch.group(3), "User");
            }
        }
        Specification<User> specification = builder.build();

        // sort
        List<Sort.Order> sortList = new ArrayList<>();
        if (orderBy == "desc") sortList.add(new Sort.Order(Sort.Direction.DESC, sortBy));
        else sortList.add(new Sort.Order(Sort.Direction.ASC, sortBy));

        Set<User> users = repository.findAll(specification, PageRequest.of(page, limit, Sort.by(sortList))).toSet();

        // convert to Model
        for (User user : users) {
            UserDTO userDTO = entityMapToModel(user);
            userDTO.setPassword("[SECURED]");
            userDTOs.add(userDTO);
        }
        return userDTOs;
    }

    @Override
    public UserDTO getById(long id) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        UserDTO userDTO = entityMapToModel(user);
        userDTO.setPassword("[SECURED]");
        return userDTO;
    }

    @Override
    public UserDTO create(UserDTO userDTO) {
        System.out.println(userDTO);
        User user = modelMapToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        if (user.getPhotoUrl() == null) {
            user.setPhotoUrl("http://localhost:8080/api/files/1");
        }
        UserDTO userCreated = entityMapToModel(repository.save(user));
        userCreated.setPassword("[SECURED]");
        return userCreated;
    }

    @Override
    public UserDTO update(long id, UserDTO userDTO) {
        if (repository.findById(id).isPresent()) {
            userDTO.setId(id);
            User user = modelMapToEntity(userDTO);
            user.setPassword(repository.findById(id).get().getPassword());
            repository.save(user);
            userDTO.setPassword("[SECURED]");
            return userDTO;
        }
        throw new UsernameNotFoundException("User not found");
    }

    @Override
    public void changePassword(long id, String password) {
        Optional<User> userOptional = repository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(password));
            repository.save(user);
        }
    }

    @Override
    public void delete(long id) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        repository.delete(user);
    }

    @Override
    public long count() {
        return repository.count();
    }

    private UserDTO entityMapToModel(User user) {
        return UserDTO.builder().id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .password(user.getPassword())
                .phone(user.getPhone())
                .photoUrl(user.getPhotoUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .gender(user.getGender())
                .roles(user.getRoles().stream().map(role ->
                        RoleDTO.builder().id(role.getId()).roleName(role.getRoleName())
                                .updatedAt(role.getUpdatedAt()).createdAt(role.getCreatedAt()).build())
                        .collect(Collectors.toSet())).build();
    }

    private User modelMapToEntity(UserDTO user) {
        return User.builder().email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .password(passwordEncoder.encode(user.getPassword()))
                .phone(user.getPhone()).photoUrl(user.getPhotoUrl() == null ? "http://localhost:8080/api/files/1" :
                        user.getPhotoUrl())
                .gender(user.getGender())
                .roles(user.getRoles() == null ? new HashSet<>(Arrays.asList(roleRepository.findByRoleName("ROLE_USER"))) :
                        user.getRoles().stream().map(role -> roleRepository.findByRoleName(role.getRoleName()))
                                .collect(Collectors.toSet())).build();
    }

}
