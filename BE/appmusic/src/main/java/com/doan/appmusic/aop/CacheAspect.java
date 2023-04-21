package com.doan.appmusic.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.support.SimpleValueWrapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Aspect
@Component
public class CacheAspect {

    private final CacheManager cacheManager;

    public CacheAspect(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Around("execution(* com.doan.appmusic.service.SongService.chart(..))")
    public Object cache(ProceedingJoinPoint joinPoint) throws Throwable {
        Object[] args = joinPoint.getArgs();
        int top = (int) args[0];
        Cache cache = cacheManager.getCache("chart-data");
        Object value = cache.get(top);
        if (value != null) {
            if (value instanceof SimpleValueWrapper) {
                Object data = ((SimpleValueWrapper) value).get();
                if (data instanceof Map) {
                    value = data;
                }
            }
            return value;
        } else {
            Object result = joinPoint.proceed();
            cache.put(top, result);
            return result;
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    public void clearCache() {
        Cache cache = cacheManager.getCache("chart-data");
        // after 1 hour, clear cache
        cache.clear();
    }
}
