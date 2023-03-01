package com.doan.appmusic.service;

import com.doan.appmusic.entity.Role;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.RoleDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.RoleRepository;
import com.doan.appmusic.repository.UserRepository;
import com.doan.appmusic.security.CustomUserDetails;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public interface UserService {
    UserDTO findByEmail(String email);

    List<UserDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query);

    UserDTO getById(long id);

    Authentication create(UserDTO userDTO);

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

    @Override
    public List<UserDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query) {

        // specification
        Specification<User> specification = buildSpecification(query);

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
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User cannot be found"));
        return convertToDTO(user);
    }

    @Override
    public Authentication create(UserDTO userDTO) {
        if (repository.findByEmail(userDTO.getEmail()).isPresent())
            throw new CustomSQLException("Error", Map.of("email", "Email already exists"));
        User user = convertToEntity(userDTO);
        Role role = roleRepository.findByRoleName("ROLE_USER").orElse(null);
        if (role != null) user.setRoles(List.of(role));
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        CustomUserDetails customUserDetails = new CustomUserDetails(repository.save(user));
        return new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
    }

    @Override
    public UserDTO update(long id, UserDTO userDTO) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User cannot be found"));

        if (!user.getEmail().equals(userDTO.getEmail()) && repository.findByEmail(userDTO.getEmail()).isPresent())
            throw new CustomSQLException("Error", Map.of("email", "Email already exists"));

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(UserDTO.class, User.class).setProvider(provider -> user).addMappings(mapping -> mapping.skip(User::setId));

        return convertToDTO(repository.save(mapper.map(userDTO, User.class)));
    }

    @Override
    public void delete(long id) {
        User user = repository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User cannot be found"));
        repository.delete(user);
    }

    @Override
    public long count(Map<String, String[]> query) {
        Specification<User> specification = buildSpecification(query);
        return repository.count(specification);
    }

    private UserDTO convertToDTO(User user) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(User.class, UserDTO.class).addMappings(mapping -> mapping.skip(UserDTO::setPassword)).setPostConverter(context -> {
            List<Role> roles = context.getSource().getRoles();
            if (roles != null)
                context.getDestination().setRoles(roles.stream().map(role -> RoleDTO.builder().roleName(role.getRoleName()).id(role.getId()).build()).collect(Collectors.toList()));
            return context.getDestination();
        });

        return mapper.map(user, UserDTO.class);
    }

    private User convertToEntity(UserDTO userDTO) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(UserDTO.class, User.class).addMappings(mapping -> mapping.skip(User::setPassword)).addMappings(mapping -> mapping.skip(User::setId)).addMappings(mapping -> mapping.skip(User::setRoles));

        return mapper.map(userDTO, User.class);
    }

    private Specification<User> buildSpecification(Map<String, String[]> query) {
        GenericSpecificationBuilder builder = new GenericSpecificationBuilder();
        for (Map.Entry<String, String[]> entry : query.entrySet()) {
            SearchCriteria searchCriteria = null;
            if (entry.getValue()[0].equals("")) {
                Pattern pattern = Pattern.compile("(\\w+)([><])(\\d+)");
                Matcher matcher = pattern.matcher(entry.getKey());
                if (matcher.find()) {
                    searchCriteria = new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), User.class);
                }
            } else searchCriteria = new SearchCriteria(entry.getKey(), "=", entry.getValue()[0], User.class);
            if (searchCriteria != null) {
                if (entry.getKey().startsWith("roles")) searchCriteria.setJoinType(Role.class);
                builder.with(searchCriteria);
            }

        }
        return builder.build();
    }

}
