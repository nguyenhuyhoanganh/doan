package com.doan.appmusic.controller;

import com.doan.appmusic.model.CommentDTO;
import com.doan.appmusic.model.ResponseDTO;
import com.doan.appmusic.security.JwtUtils;
import com.doan.appmusic.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class CommentController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private CommentService service;
    @Autowired
    private JwtUtils jwtUtils;

    // These methods will be responsible for receiving messages from one client and then broadcasting it to others
    // All the messages sent from clients with a destination starting with /app
    // will be routed to these message handling methods annotated with @MessageMapping
    // Ex: A message with destination /comment will be routed to the addComment() method (because @MessageMapping(""))
    @MessageMapping("/send")
    public CommentDTO addComment(@Payload CommentDTO comment, @Header(name = "nativeHeaders", required = false) Map<String, List<String>> headers) {
        String token = headers.get(HttpHeaders.AUTHORIZATION).get(0);
        if (jwtUtils.isBearerToken(token) && jwtUtils.isAccessToken(token)) {
            Authentication authentication = jwtUtils.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        CommentDTO commentCreated = service.create(comment);
        messagingTemplate.convertAndSend("/song/" + comment.getSong().getId() + "/comments", commentCreated);
        return commentCreated;
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
// client subscribe : /song/{song_id}/comments
// client send : /comment/send  payload comment: {..., post: {id: ?}}
