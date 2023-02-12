package com.doan.appmusic.service;

import com.doan.appmusic.entity.Playlist;
import com.doan.appmusic.entity.Role;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.RoleRepository;
import com.doan.appmusic.repository.UserRepository;
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

    List<UserDTO> search(int page, int limit, String sortBy, String orderBy, Map<String, String[]> search);

    UserDTO getById(long id);

    UserDTO create(UserDTO userDTO);

    UserDTO update(long id, UserDTO userDTO);

    void changePassword(long id, String password);

    void delete(long id);

    long count(Map<String, String[]> search);
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
    public List<UserDTO> search(int page, int limit, String sortBy, String orderBy, Map<String, String[]> search) {
        List<UserDTO> userDTOs = new ArrayList<>();
        GenericSpecificationBuilder builder = new GenericSpecificationBuilder();
        for (Map.Entry<String, String[]> entry : search.entrySet()) {
            SearchCriteria searchCriteria = null;
            if (entry.getValue()[0].equals("")) {
                Pattern pattern = Pattern.compile("(\\w+)([><])(\\d+)");
                Matcher matcher = pattern.matcher(entry.getKey());
                if (matcher.find()) {
                    searchCriteria = new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), User.class);
                }
            } else {
                searchCriteria = new SearchCriteria(entry.getKey(), "=", entry.getValue()[0], User.class);
            }
            if (searchCriteria != null) {
                if (entry.getKey().startsWith("role")) searchCriteria.setJoinType(Role.class);
                if (entry.getKey().startsWith("playlist")) searchCriteria.setJoinType(Playlist.class);
                builder.with(searchCriteria);
            }

        }
        Specification<User> specification = builder.build();

        // sort
        List<Sort.Order> sortList = new ArrayList<>();
        if (orderBy.equals("desc")) sortList.add(new Sort.Order(Sort.Direction.DESC, sortBy));
        else sortList.add(new Sort.Order(Sort.Direction.ASC, sortBy));

        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(sortList));

        List<User> users = repository.findAll(specification, pageRequest).toList();

        // convert to Model
        for (User user : users) {
            UserDTO userDTO = entityMapToModel(user);
            userDTOs.add(userDTO);
        }
        return userDTOs;
    }

    @Override
    public UserDTO getById(long id) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        UserDTO userDTO = entityMapToModel(user);
        return userDTO;
    }

    @Override
    public UserDTO create(UserDTO userDTO) {
        if (repository.findByEmail(userDTO.getEmail()).isPresent())
            throw new CustomSQLException("Error", Map.of("email", "Email already exists"));
        User user = modelMapToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        if (user.getAvatarUrl() == null) {
            user.setAvatarUrl("http://localhost:8080/api/files/1");
        }
        UserDTO userCreated = entityMapToModel(repository.save(user));
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
    public long count(Map<String, String[]> search) {
        GenericSpecificationBuilder builder = new GenericSpecificationBuilder();
        for (Map.Entry<String, String[]> entry : search.entrySet()) {
            SearchCriteria searchCriteria = null;
            if (entry.getValue()[0].equals("")) {
                Pattern pattern = Pattern.compile("(\\w+)([><])(\\d+)");
                Matcher matcher = pattern.matcher(entry.getKey());
                if (matcher.find()) {
                    searchCriteria = new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), User.class);
                }
            } else {
                searchCriteria = new SearchCriteria(entry.getKey(), "=", entry.getValue()[0], User.class);
            }
            if (searchCriteria != null) {
                if (entry.getKey().startsWith("role")) searchCriteria.setJoinType(Role.class);
                if (entry.getKey().startsWith("playlist")) searchCriteria.setJoinType(Playlist.class);
                builder.with(searchCriteria);
            }

        }
        Specification<User> specification = builder.build();
        return repository.count(specification);
    }

    private UserDTO entityMapToModel(User user) {
        return UserDTO.builder().id(user.getId()).email(user.getEmail()).firstName(user.getFirstName()).lastName(user.getLastName()).username(user.getUsername()).password("[SECURED]").phone(user.getPhone()).photoUrl(user.getAvatarUrl()).createdAt(user.getCreatedAt()).updatedAt(user.getUpdatedAt()).gender(user.getGender()).roles(user.getRoles().stream().map(role -> RoleDTO.builder().id(role.getId()).roleName(role.getRoleName()).updatedAt(role.getUpdatedAt()).createdAt(role.getCreatedAt()).build()).collect(Collectors.toSet())).build();
    }

    private User modelMapToEntity(UserDTO user) {
        return User.builder().email(user.getEmail()).firstName(user.getFirstName()).lastName(user.getLastName()).username(user.getUsername()).password(passwordEncoder.encode(user.getPassword())).phone(user.getPhone()).avatarUrl(user.getPhotoUrl() == null ? "http://localhost:8080/api/files/1" : user.getPhotoUrl()).gender(user.getGender()).roles(user.getRoles() == null ? Set.of(roleRepository.findByRoleName("ROLE_USER")) : user.getRoles().stream().map(role -> roleRepository.findByRoleName(role.getRoleName())).collect(Collectors.toSet())).build();
    }

}
