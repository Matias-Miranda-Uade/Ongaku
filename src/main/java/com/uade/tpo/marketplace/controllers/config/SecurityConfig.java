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
    private final RestAuthenticationEntryPoint authenticationEntryPoint;
    private final RestAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
                    .dispatcherTypeMatchers(jakarta.servlet.DispatcherType.ERROR).permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/v1/auth/register", "/api/v1/auth/authenticate").permitAll()
                    // Listados, busquedas y filtros publicos. El detalle requiere login.
                    .requestMatchers(HttpMethod.GET, "/vinyls", "/vinyls/search", "/vinyls/search/*",
                            "/vinyls/filter", "/vinyls/artist/*", "/vinyls/genre/*", "/vinyls/category/*",
                            "/vinyls/year/*", "/vinyls/price/*", "/artists", "/genres",
                            "/reviews", "/reviews/*", "/categories", "/categories/*",
                            "/audio-previews", "/audio-previews/*", "/average-scores", "/average-scores/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/vinyls/*", "/artists/*", "/genres/*", "/genres/*/vinyls",
                            "/orders", "/orders/*", "/payments", "/payments/*",
                            "/order-statuses", "/order-statuses/*").hasAnyAuthority("USER", "ADMIN")
                    // Los servicios verifican ademas que los recursos pertenezcan al usuario.
                    .requestMatchers("/carts", "/carts/**", "/favorites", "/favorites/**").hasAuthority("USER")
                    .requestMatchers(HttpMethod.POST, "/reviews", "/payments", "/orders",
                            "/orders/cart/*", "/orders/from-cart").hasAuthority("USER")
                    .requestMatchers(HttpMethod.PATCH, "/orders/*/status", "/orders/*/status/*").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/orders/*").hasAuthority("ADMIN")
                    .requestMatchers("/dashboard", "/dashboard/**", "/admin/vinyls", "/admin/vinyls/**").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/artists", "/genres", "/categories", "/audio-previews").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/artists/*").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/genres/*").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/artists/*", "/genres/*").hasAuthority("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/users/me").hasAnyAuthority("USER", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/users/me", "/users/me/password").hasAnyAuthority("USER", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/v1/auth/logout").hasAnyAuthority("USER", "ADMIN")
                    .anyRequest().denyAll())
                .exceptionHandling(errors -> errors.authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
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
