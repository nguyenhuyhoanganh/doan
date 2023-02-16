package com.doan.appmusic.service;

import com.doan.appmusic.entity.Playlist;
import com.doan.appmusic.entity.Role;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.RoleRepository;
import com.doan.appmusic.repository.UserRepository;
import org.modelmapper.Conditions;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public interface UserService {
    UserDTO findByEmail(String email);

    List<UserDTO> search(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> search);

    UserDTO getById(long id);

    UserDTO create(UserDTO userDTO);

    UserDTO update(long id, UserDTO userDTO);

//    void changePassword(long id, String password);

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

    private Specification<User> buildSpecification(Map<String, String[]> search) {
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
        return builder.build();
    }


    @Override
    public List<UserDTO> search(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> search) {

        // specification
        Specification<User> specification = buildSpecification(search);

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
        return users.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO getById(long id) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User is not found"));
        return convertToDTO(user);
    }

    @Override
    public UserDTO create(UserDTO userDTO) {
        if (repository.findByEmail(userDTO.getEmail()).isPresent())
            throw new CustomSQLException("Error", Map.of("email", "Email already exists"));
        User user = convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return convertToDTO(repository.save(user));
    }

    @Override
    public UserDTO update(long id, UserDTO userDTO) {

        Optional<User> optionalUser = repository.findById(id);
        if (optionalUser.isEmpty()) throw new UsernameNotFoundException("User is not found");

        User user = optionalUser.get();
        if (!user.getEmail().equals(user.getEmail()) && repository.findByEmail(userDTO.getEmail()).isPresent())
            throw new CustomSQLException("Error", Map.of("email", "Email already exists"));

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(UserDTO.class, User.class).setProvider(provider -> user).addMappings(mapping -> mapping.skip(User::setId));

        return convertToDTO(repository.save(mapper.map(userDTO, User.class)));
    }

//    @Override
//    public void changePassword(long id, String password) {
//        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User is not found"));
//        user.setPassword(passwordEncoder.encode(password));
//        repository.save(user);
//
//    }

    @Override
    public void delete(long id) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User is not found"));
        repository.delete(user);
    }

    @Override
    public long count(Map<String, String[]> search) {
        Specification<User> specification = buildSpecification(search);
        return repository.count(specification);
    }

    private UserDTO convertToDTO(User user) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(User.class, UserDTO.class).setPostConverter(context -> {
            List<Role> roles = context.getSource().getRoles();
            context.getDestination().setPassword("[PROTECTED]");

            context.getDestination().setRoles(roles.stream().map(role -> RoleDTO.builder().roleName(role.getRoleName()).id(role.getId()).build()).collect(Collectors.toList()));
            return context.getDestination();
        });

        return mapper.map(user, UserDTO.class);
    }

    private User convertToEntity(UserDTO userDTO) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(UserDTO.class, User.class).setPostConverter(context -> {
            if (context.getSource().getAvatarUrl() == null)
                context.getDestination().setAvatarUrl("http://localhost:8080/api/files/1");
            if (context.getSource().getRoles() == null)
                context.getDestination().setRoles(List.of(roleRepository.findByRoleName("ROLE_USER").orElse(null)));
            return context.getDestination();
        }).addMappings(mapping -> mapping.skip(User::setPassword)).addMappings(mapping -> mapping.skip(User::setId));

        return mapper.map(userDTO, User.class);
    }

}
