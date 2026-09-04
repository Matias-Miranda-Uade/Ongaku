package com.uade.tpo.marketplace.controllers.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.uade.tpo.marketplace.entity.Role;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req.requestMatchers("/api/v1/auth/register", "/api/v1/auth/authenticate").permitAll()
                    .requestMatchers(HttpMethod.GET,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**",
                            "/average-scores/**",
                            "/reviews/**").permitAll()
                    .requestMatchers("/dashboard", "/dashboard/**").hasAnyAuthority(Role.ADMIN.name())
                    .requestMatchers(HttpMethod.POST,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**",
                            "/order-statuses/**").hasAnyAuthority(Role.ADMIN.name())
                    .requestMatchers(HttpMethod.PUT,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**",
                            "/order-statuses/**").hasAnyAuthority(Role.ADMIN.name())
                    .requestMatchers(HttpMethod.PATCH,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**",
                            "/order-statuses/**").hasAnyAuthority(Role.ADMIN.name())
                    .requestMatchers(HttpMethod.DELETE,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**").hasAnyAuthority(Role.ADMIN.name())
                    .requestMatchers(HttpMethod.GET, "/carts/**","/orders/**", "/favorites/**", "/payments/**")
                        .hasAnyAuthority(Role.USER.name())
                    .requestMatchers(HttpMethod.POST, "/carts/**", "/orders/**", "/favorites/**", "/reviews/**", "/payments/**")
                            .hasAnyAuthority(Role.USER.name())
                    .requestMatchers(HttpMethod.PATCH, "/carts/**", "/favorites/**", "/reviews/**")
                            .hasAnyAuthority(Role.USER.name())
                    .requestMatchers(HttpMethod.DELETE, "/carts/**", "/favorites/**", "/reviews/**")
                            .hasAnyAuthority(Role.USER.name())
                    .requestMatchers(HttpMethod.PATCH, "/orders/**")
                            .hasAnyAuthority(Role.USER.name(), Role.ADMIN.name())
                    .requestMatchers(HttpMethod.PUT, "/orders/**")
                            .hasAnyAuthority(Role.USER.name(), Role.ADMIN.name())
                    .requestMatchers("/users/me", "/users/me/**", "/api/v1/auth/logout").authenticated()
                    .requestMatchers("/users/**").hasAnyAuthority(Role.ADMIN.name())
                    .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // Evita que Spring Boot registre JwtAuthenticationFilter como filtro
    // global de servlet (fuera de la cadena de Spring Security), ya que
    // eso hacia que se ejecutara ANTES de que arranque la cadena de
    // seguridad y su autenticacion se perdiera al llegar al
    // SecurityContextHolderFilter/AnonymousAuthenticationFilter.
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtAuthenticationFilterRegistration(
            JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registrationBean =
                new FilterRegistrationBean<>(filter);
        registrationBean.setEnabled(false);
        return registrationBean;
    }
}