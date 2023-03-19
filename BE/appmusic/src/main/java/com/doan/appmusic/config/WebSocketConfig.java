package com.doan.appmusic.config;

import com.doan.appmusic.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Autowired
    private JwtUtils jwtUtils;

    // STOMP messages whose destination header begins with "/app" are routed to @MessageMapping methods in @Controller classes.
    // 	Use the built-in message broker for subscriptions and broadcasting and route messages whose destination header begins with "/comment" to the broker.
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/comment");
        registry.enableSimpleBroker("/song", "/user");
        registry.setUserDestinationPrefix("/user");
    }

    // "/ws" is the HTTP URL for the endpoint to which a WebSocket (or SockJS) client needs to connect for the WebSocket handshake.
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000").withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) throws AuthenticationException {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                System.out.println(accessor.getUser());
                if (accessor != null && StompCommand.SEND.equals(accessor.getCommand())) {
                    String token = accessor.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);
                    if (jwtUtils.isBearerToken(token) && jwtUtils.isAccessToken(token)) {
                        Authentication authentication = jwtUtils.getAuthentication(token);
                        accessor.setUser(authentication);
                    }
                }
                return message;
            }
        });
    }
}