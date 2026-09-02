package com.uade.tpo.marketplace.controllers.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

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
                .authorizeHttpRequests(req -> req
                    .requestMatchers("/api/v1/auth/register", "/api/v1/auth/authenticate").permitAll()
                    .requestMatchers(HttpMethod.GET,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**",
                            "/average-scores/**").permitAll()
                    .requestMatchers("/dashboard", "/dashboard/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**",
                            "/order-statuses/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PATCH,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE,
                            "/vinyls/**",
                            "/artists/**",
                            "/genres/**",
                            "/categories/**",
                            "/audio-previews/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/carts/**", "/orders/**", "/favorites/**", "/reviews/**", "/payments/**")
                            .hasRole("USER")
                    .requestMatchers(HttpMethod.PATCH, "/carts/**", "/favorites/**", "/reviews/**")
                            .hasRole("USER")
                    .requestMatchers(HttpMethod.DELETE, "/carts/**", "/favorites/**", "/reviews/**")
                            .hasRole("USER")
                    .requestMatchers(HttpMethod.PATCH, "/orders/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/orders/**").hasRole("ADMIN")
                    .requestMatchers("/carts/**", "/favorites/**", "/reviews/**", "/payments/**")
                            .hasRole("USER")
                    .requestMatchers("/users/me", "/users/me/**", "/api/v1/auth/logout").authenticated()
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
