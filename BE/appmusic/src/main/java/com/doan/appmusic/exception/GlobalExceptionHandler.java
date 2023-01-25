package com.doan.appmusic.exception;

import com.doan.appmusic.model.ResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException exception, WebRequest request) {
        ResponseDTO<?> responseBody =
                ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.NOT_FOUND.value()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.NOT_FOUND);
    }
}
