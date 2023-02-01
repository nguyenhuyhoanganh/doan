package com.doan.appmusic.exception;

import com.doan.appmusic.model.ResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.io.IOException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleValidFormException(MethodArgumentNotValidException exception, WebRequest request) {
        ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getBindingResult().getAllErrors().get(0).getDefaultMessage()).code(HttpStatus.UNPROCESSABLE_ENTITY.value()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.UNPROCESSABLE_ENTITY);
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException exception, WebRequest request) {
        ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.NOT_FOUND.value()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Object> handleRuntimeException(IOException exception, WebRequest request) {
        ResponseDTO<?> responseBody = ResponseDTO.builder().message("Incorrect data format").code(HttpStatus.BAD_REQUEST.value()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.BAD_REQUEST);
    }

}
