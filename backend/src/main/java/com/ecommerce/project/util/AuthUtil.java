package com.ecommerce.project.util;

import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class AuthUtil {
    private static final Logger Logger = LoggerFactory.getLogger(AuthUtil.class);
    @Autowired
    private UserRepository userRepository;   // ← ADD THIS ANNOTATION

    public String loggedInEmail(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUserName(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + authentication.getName()));
        return user.getEmail();
    }

    public Long loggedInUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUserName(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + authentication.getName()));
        return user.getUserId();
    }

    public User loggedInUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            Logger.error("❌ AUTH IS NULL");
        } else {
            Logger.info("AUTH NAME = {}", auth.getName());
            Logger.info("AUTH AUTHENTICATED = {}", auth.isAuthenticated());
        }
        return userRepository.findByUserName(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
    }
}