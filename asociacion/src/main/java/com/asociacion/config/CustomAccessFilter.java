package com.asociacion.config;

import com.asociacion.Utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

@Component
public class CustomAccessFilter extends OncePerRequestFilter {

    public CustomAccessFilter() {}

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        boolean authorized = isAuthorized(request);

        if (authorized) {
            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(null, null, Collections.emptyList()));
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }
    }

    private boolean isAuthorized(HttpServletRequest request) {
        String currentUrl = request.getRequestURI();
        String[] availableUrl = new String[]{
                "/api/auth/login",
                "/api/auth/register",
                "/api/*"
        };

        boolean authorized = Arrays.asList(availableUrl).contains(currentUrl);
        boolean isAnApiResource = currentUrl.startsWith("/home/");

        if (authorized || !isAnApiResource) {
            return true;
        }

        try {
            String token = request.getHeader("Authorization");
            String adminId = JwtUtil.getUserIdByToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

