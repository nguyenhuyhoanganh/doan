package com.doan.appmusic.security;

public class CustomAuthenticationProvider {}

//@Service
//@Transactional
//public class CustomAuthenticationProvider implements AuthenticationProvider {
//
//    @Autowired
//    private CustomUserDetailsService userDetailsService;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Override
//    public Authentication authenticate(Authentication authentication)
//            throws AuthenticationException {
//
//        String username = authentication.getName();
//        String password = authentication.getCredentials()
//                .toString();
//
//        CustomUserDetails user = (CustomUserDetails) userDetailsService.loadUserByUsername(username);
//
//        if (passwordEncoder.matches(password, user.getPassword())) {
//            return new UsernamePasswordAuthenticationToken(user.getUsername(),
//                    user.getPassword(), user.getAuthorities());
//        } else
//            throw new BadCredentialsException("Bad credentials");
//    }
//
//    @Override
//    public boolean supports(Class<?> aClass) {
//        return UsernamePasswordAuthenticationToken.class
//                .isAssignableFrom(aClass);
//    }
//
//}
