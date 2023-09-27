// package com.medisense.backend.security.config.services;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import
// org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import com.medisense.backend.models.User;
// import com.medisense.backend.repository.UserRepository;

// @Service
// public class UserDetailsServiceImpl implements UserDetailsService {

// @Autowired
// UserRepository userRepository;

// @Override
// public UserDetails loadUserByUsername(String username) throws
// UsernameNotFoundException {
// User user = userRepository.findByUsername(username)
// .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email:
// " + username));

// return UserDetailsImpl.build(user);
// }
// }