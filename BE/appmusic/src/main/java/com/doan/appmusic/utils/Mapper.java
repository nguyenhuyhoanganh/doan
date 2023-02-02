package com.doan.appmusic.utils;

import com.doan.appmusic.exception.CommonException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.IOException;
import java.io.OutputStream;

public class Mapper {
    public static void writeValue(OutputStream out, Object value) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
            objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
            objectMapper.writeValue(out, value);
        } catch (IOException exception) {
            throw  new CommonException(exception.getMessage());
        }
    }
}
