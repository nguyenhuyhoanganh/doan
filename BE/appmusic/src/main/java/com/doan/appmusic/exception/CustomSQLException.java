package com.doan.appmusic.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

@Data
@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class CustomSQLException extends RuntimeException {
    private Map<String, String> error;

    public CustomSQLException(String message) {
        super(message);
    }

    public CustomSQLException(String message, Map<String, String> error) {
        super(message);
        this.error = error;
    }
}
