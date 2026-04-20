package com.ecommerce.project.security.jwt;

import com.ecommerce.project.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.http.Cookie;
import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        logger.info("========== AUTH FILTER START ==========");
        logger.info("URI: {}", request.getRequestURI());
        logger.info("Method: {}", request.getMethod());
        logger.info("🚀 FILTER EXECUTED FOR URI: {}", request.getRequestURI());
        try {
            String jwt = parseJwt(request);

            logger.info("JWT FROM REQUEST = {}", jwt);

            if (jwt == null) {
                logger.error("❌ JWT is NULL (no cookie found)");
            }

            if (jwt != null) {
                boolean isValid = jwtUtils.validateJwtToken(jwt);
                logger.info("JWT VALID = {}", isValid);

                if (isValid) {
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    logger.info("USERNAME FROM JWT = {}", username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    logger.info("USER DETAILS LOADED = {}", userDetails.getUsername());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    logger.info("✅ SECURITY CONTEXT SET SUCCESSFULLY");
                } else {
                    logger.error("❌ JWT is INVALID");
                }
            }

        } catch (Exception e) {
            logger.error("❌ ERROR IN FILTER: ", e);
        }

        logger.info("========== AUTH FILTER END ==========");

        filterChain.doFilter(request, response);
        System.out.println("=== JWT FILTER DEBUG ===");

        System.out.println("Cookies: " + (request.getCookies() != null));

        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                System.out.println("Cookie: " + c.getName() + " = " + c.getValue());
            }
        }
    }
    private String parseJwt(HttpServletRequest request) {

        logger.info("---- COOKIE DEBUG ----");

        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                logger.info("COOKIE => {} = {}", c.getName(), c.getValue());
            }
        } else {
            logger.error("❌ NO COOKIES FOUND");
        }

        String jwt = jwtUtils.getJwtFromCookies(request);
        logger.info("EXTRACTED JWT = {}", jwt);

        return jwt;

    }

}

