package com.doan.appmusic.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseDTO<T> {
    @Builder.Default
    private int code = HttpStatus.OK.value();

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long totalElements;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer numberOfElements;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer totalPages;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;
}
