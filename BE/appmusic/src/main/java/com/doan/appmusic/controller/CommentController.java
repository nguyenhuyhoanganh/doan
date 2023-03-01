package com.doan.appmusic.controller;

import com.doan.appmusic.model.CommentDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.security.CustomUserDetails;
import com.doan.appmusic.security.JwtUtils;
import com.doan.appmusic.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
public class CommentController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private CommentService service;
    @Autowired
    private JwtUtils jwtUtils;

    // Message send to destination /comment/send will be routed to the addComment() method (because @MessageMapping("/send"))
    // @Header(name = "nativeHeaders", required = false) Map<String, List<String>> headers
    @MessageMapping("/send")
    public void addComment(@Payload CommentDTO comment, StompHeaderAccessor accessor) {
        try {
            if (accessor.getUser() != null) {
                Authentication authentication = (Authentication) accessor.getUser();
                SecurityContextHolder.getContext().setAuthentication(authentication);
                messagingTemplate.convertAndSend("/song/" + comment.getSong().getId() + "/comments", service.create(comment));
            }
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage());
        }
    }

    @MessageExceptionHandler(RuntimeException.class)
    public void handleException(RuntimeException exception, StompHeaderAccessor accessor) {
        log.error(exception.getMessage());
        Authentication authentication = (Authentication) accessor.getUser();
        String userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId().toString();
        ResponseDTO<?> response = ResponseDTO.builder().message(exception.getMessage()).code(HttpStatus.INTERNAL_SERVER_ERROR.value()).build();
        messagingTemplate.convertAndSendToUser(userId, "/error", response);
    }

    // get comments of song
    @GetMapping("/api/song/{songId}/comments")
    public ResponseEntity<?> getComments(@RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "10") Integer limit, @PathVariable long songId) {
        page = page < 1 ? 1 : page;
        limit = limit < 0 ? 10 : limit;

        List<CommentDTO> comments = service.findCommentBySongId(page - 1, limit, songId);
        ResponseDTO<?> response = ResponseDTO.builder().data(comments).limit(limit).page(page).build();
        return ResponseEntity.ok(response);
    }
}

// client connect server : http://localhost:8080/ws
/*
 * socket = new SockJS('http://localhost:8080/ws');
 * stompClient = over(socket);
 * stompClient.connect({}, onConnected, onError);
 * */
// client subscribe : /song/{song_id}/comments
// client send : /comment/send; header: {"Authorization" : "Bearer ..."}; payload: {comment: {..., post: {id: ?}}}
// client subscribe : /user/userId/error => get error
// if authorization error => catch onError

