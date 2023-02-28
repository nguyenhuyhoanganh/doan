package com.doan.appmusic.service;

import com.doan.appmusic.entity.Comment;
import com.doan.appmusic.entity.Song;
import com.doan.appmusic.entity.User;
import com.doan.appmusic.model.CommentDTO;
import com.doan.appmusic.model.SongDTO;
import com.doan.appmusic.model.UserDTO;
import com.doan.appmusic.repository.CommentRepository;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public interface CommentService {
    List<CommentDTO> findCommentBySongId(int page, int limit, long songId);

    CommentDTO create(CommentDTO commentDTO);
}

@Service
@Transactional
class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository repository;

    @Override
    public List<CommentDTO> findCommentBySongId(int page, int limit, long songId) {
        List<Sort.Order> sortList = new ArrayList<>();
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(new Sort.Order(Sort.Direction.DESC, "id")));
        List<Comment> comments = repository.findBySongId(songId, pageRequest);
        return comments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public CommentDTO create(CommentDTO commentDTO) {
        Comment comment = convertToEntity(commentDTO);
        return convertToDTO(repository.save(comment));
    }

    private CommentDTO convertToDTO(Comment comment) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Comment.class, CommentDTO.class).setPostConverter(context -> {
            // user
            User createdBy = context.getSource().getCreatedBy();
            if (createdBy != null)
                context.getDestination().setCreatedBy(UserDTO.builder().id(createdBy.getId()).email(createdBy.getEmail()).firstName(createdBy.getFirstName()).lastName(createdBy.getLastName()).build());

            // song
            Song song = context.getSource().getSong();
            if (song != null) context.getDestination().setSong(SongDTO.builder().id(song.getId()).build());

            return context.getDestination();
        });

        return mapper.map(comment, CommentDTO.class);
    }


    private Comment convertToEntity(CommentDTO commentDTO) {
        // mapper
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(CommentDTO.class, Comment.class).addMappings(mapping -> mapping.skip(Comment::setId));

        return mapper.map(commentDTO, Comment.class);
    }
}