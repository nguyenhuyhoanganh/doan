package com.doan.appmusic.exception;

import com.doan.appmusic.model.ResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import javax.naming.AuthenticationException;
import java.sql.SQLIntegrityConstraintViolationException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleValidFormException(MethodArgumentNotValidException exception, WebRequest request) {
        ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getBindingResult().getAllErrors().get(0).getDefaultMessage()).code(HttpStatus.UNPROCESSABLE_ENTITY.value()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.UNPROCESSABLE_ENTITY);
    }


    @ExceptionHandler(CommonException.class)
    public ResponseEntity<Object> handleCommonException(CommonException exception, WebRequest request) {
        ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.NOT_FOUND.value()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationException(AuthenticationException exception, WebRequest request) {
        ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.NOT_FOUND.value()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CustomSQLException.class)
    public ResponseEntity<Object> handleCustomSQLException(CustomSQLException exception, WebRequest request) {
        ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.UNPROCESSABLE_ENTITY.value()).error(exception.getError()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<Object> handleSQLIntegrityConstraintViolationException(SQLIntegrityConstraintViolationException exception, WebRequest request) {
        ResponseDTO<?> responseBody = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.BAD_REQUEST.value()).build();
        return new ResponseEntity<Object>(responseBody, HttpStatus.BAD_REQUEST);
    }

//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<Object> handleException(RuntimeException exception, WebRequest request) {
//        log.error("Error:" + exception.getMessage());
//        log.error("Localized Message:" + exception.getLocalizedMessage());
//        log.error("Stack Trace:" + exception.getStackTrace());
//        ResponseDTO<?> responseBody = ResponseDTO.builder().message("Server error, please try again later").code(HttpStatus.INTERNAL_SERVER_ERROR.value()).build();
//        return new ResponseEntity<Object>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
//    }

}
