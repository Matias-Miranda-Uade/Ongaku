package com.uade.tpo.marketplace.controllers.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.OrderStatusType;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;

/**
 * Garantiza que la tabla order_status tenga las cinco filas del catalogo con los
 * ids que usa la aplicacion. Sin esto una instalacion limpia no podria ni crear
 * una orden (no existiria el estado PENDIENTE).
 */
@Component
public class OrderStatusSeeder implements ApplicationRunner {
    private final OrderStatusRepository orderStatusRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        for (OrderStatusType type : OrderStatusType.values()) {
            OrderStatus existing = orderStatusRepository.findById(type.getId()).orElse(null);
            if (existing == null) {
                // Insert nativo: el id es IDENTITY y debe coincidir con el del catalogo.
                jdbcTemplate.update("insert into order_status (id, name, description) values (?, ?, ?)", type.getId(), type.name(), type.getDescription());
            } else if (!type.name().equals(existing.getName())) {
                existing.setName(type.name());
                existing.setDescription(type.getDescription());
            }
        }
    }

    public OrderStatusSeeder(OrderStatusRepository orderStatusRepository, JdbcTemplate jdbcTemplate) {
        this.orderStatusRepository = orderStatusRepository;
        this.jdbcTemplate = jdbcTemplate;
    }
}
