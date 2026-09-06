package com.uade.tpo.marketplace.common;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final int status;
    private final String message;
    private final T data;
    private final Instant timestamp;
    private final List<String> errors;

    private ApiResponse(boolean success, int status, String message, T data, List<String> errors) {
        this.success = success;
        this.status = status;
        this.message = message;
        this.data = data;
        this.timestamp = Instant.now();
        this.errors = errors;
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, 200, "OK", data, null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, 200, message, data, null);
    }

    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(true, 201, "Recurso creado", data, null);
    }

    public static <T> ApiResponse<T> created(T data, String message) {
        return new ApiResponse<>(true, 201, message, data, null);
    }

    public static <T> ApiResponse<T> noContent(String message) {
        return new ApiResponse<>(true, 204, message, null, null);
    }

    public static <T> ApiResponse<List<T>> list(List<T> data, String emptyMessage) {
        boolean empty = data == null || data.isEmpty();
        String message = empty ? emptyMessage : "Se encontraron " + data.size() + " resultado(s)";
        return new ApiResponse<>(true, 200, message, data, null);
    }

    public static <T> ApiResponse<List<T>> list(List<T> data) {
        return list(data, "No se encontraron resultados");
    }

    public static ApiResponse<Object> error(int status, String message) {
        return new ApiResponse<>(false, status, message, null, null);
    }

    public static ApiResponse<Object> error(int status, String message, List<String> errors) {
        return new ApiResponse<>(false, status, message, null, errors);
    }
}
