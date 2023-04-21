package com.doan.appmusic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AppMusicApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppMusicApplication.class, args);
    }
}
