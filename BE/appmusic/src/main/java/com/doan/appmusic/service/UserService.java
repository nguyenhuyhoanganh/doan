package com.doan.appmusic.service;

import com.doan.appmusic.entity.Playlist;
import com.doan.appmusic.entity.Role;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.RoleRepository;
import com.doan.appmusic.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
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

    List<UserDTO> search(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> search);

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
        return convertToDTO(repository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found")));
    }

    @Override
    public List<UserDTO> search(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> search) {

        // build specification
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
        for (int i = 0; i < sortBy.length; i++) {
            if (i < orderBy.length) {
                if (orderBy[i].equals("desc")) {
                    sortList.add(new Sort.Order(Sort.Direction.DESC, sortBy[i]));
                    continue;
                }
            }
            sortList.add(new Sort.Order(Sort.Direction.ASC, sortBy[i]));
        }

        // page request
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(sortList));

        // find
        List<User> users = repository.findAll(specification, pageRequest).toList();

        // convert to dto
        return users.stream().map(user -> convertToDTO(user)).collect(Collectors.toList());
    }

    @Override
    public UserDTO getById(long id) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return convertToDTO(user);
    }

    @Override
    public UserDTO create(UserDTO userDTO) {
        if (repository.findByEmail(userDTO.getEmail()).isPresent())
            throw new CustomSQLException("Error", Map.of("email", "Email already exists"));
        User user = convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        UserDTO userCreated = convertToDTO(repository.save(user));
        return userCreated;
    }

    @Override
    public UserDTO update(long id, UserDTO userDTO) {
        if (repository.findById(id).isPresent()) {
            // convert skip setPassword, setId
            User user = convertToEntity(userDTO);
            user.setId(id);
            return convertToDTO(repository.save(user));
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

    private UserDTO convertToDTO(User user) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        mapper.createTypeMap(User.class, UserDTO.class).setPostConverter(context -> {
            context.getDestination().setPassword("[Secured]");
            return context.getDestination();
        });

        return mapper.map(user, UserDTO.class);
    }

    private User convertToEntity(UserDTO userDTO) {

        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        mapper.createTypeMap(UserDTO.class, User.class).setPostConverter(context -> {
            if (context.getSource().getAvatarUrl() == null)
                context.getDestination().setAvatarUrl("http://localhost:8080/api/files/1");
            if (context.getSource().getRoles() == null)
                context.getDestination().setRoles(Set.of(roleRepository.findByRoleName("ROLE_USER")));
            return context.getDestination();
        }).addMappings(mapping -> mapping.skip(User::setPassword)).addMappings(mapping -> mapping.skip(User::setId));

        return mapper.map(userDTO, User.class);
    }

}
