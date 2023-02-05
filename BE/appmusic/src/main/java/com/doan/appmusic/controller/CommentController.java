package com.doan.appmusic.controller;

import com.doan.appmusic.entity.Comment;
import com.doan.appmusic.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class CommentController {
//    @Autowired
//    private SimpMessageSendingOperations messagingTemplate;
//
//    @Autowired
//    private CommentRepository commentRepository;
//
//    @MessageMapping("/addComment")
//    @SendTo("/topic/comments")
//    public String addComment(String comment) {
//        System.out.println("connect");
////        comment.setCreatedAt(LocalDateTime.now());
////        commentRepository.save(comment);
//        System.out.println(comment);
//        return comment;
//    }
}
