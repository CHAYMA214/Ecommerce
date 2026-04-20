package com.ecommerce.project.controller;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.User;
import java.util.Set;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.Set;
import java.util.Collections;

// Your repository and utils
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.security.jwt.JwtUtils;
import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.RoleRepository;

// Google OAuth libs
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
@RestController
@RequestMapping("/api/auth")
public class oauthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/login/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) throws Exception {
        String token = body.get("token");

        // Verify Google Token
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList("YOUR_GOOGLE_CLIENT_ID"))
                .build();

        GoogleIdToken idToken = verifier.verify(token);
        if (idToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token");
        }

        String email = idToken.getPayload().getEmail();
        String name = idToken.getPayload().get("name").toString();

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserName(name);
                    newUser.setEmail(email);

                    Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Role USER not found"));

                    newUser.setRoles(Set.of(userRole));
                    return userRepository.save(newUser);
                });

        String jwt = jwtUtils.generateTokenFromUsername(user.getEmail());

        return ResponseEntity.ok(Map.of("token", jwt, "user", user));
    }
}
