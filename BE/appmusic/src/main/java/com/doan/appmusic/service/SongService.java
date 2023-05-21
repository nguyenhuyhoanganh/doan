package com.doan.appmusic.service;

import com.doan.appmusic.entity.*;
import com.doan.appmusic.exception.CommonException;
import com.doan.appmusic.exception.CustomSQLException;
import com.doan.appmusic.model.*;
import com.doan.appmusic.repository.PlayRepository;
import com.doan.appmusic.repository.SongLikeRepository;
import com.doan.appmusic.repository.SongRepository;
import com.doan.appmusic.repository.UserRepository;
import com.doan.appmusic.repository.specification.GenericSpecificationBuilder;
import com.doan.appmusic.repository.specification.SearchCriteria;
import com.doan.appmusic.security.CustomUserDetails;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public interface SongService {
    List<SongDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query);

    List<SongDTO> getFavoritesList(int page, int limit, String[] sortBy, String[] orderBy);

    long countFavoritesList();

    SongDTO getById(long id);

    SongDTO getBySlug(String slug);

    SongDTO create(SongDTO songDTO);

    SongDTO update(long id, SongDTO songDTO);

    void delete(long id);

    long count(Map<String, String[]> search);

    long count();

    void like(long songId, long userId);

    void unlike(long songId, long userId);

    boolean isLiked(long songId, long userId);

    void deleteComment(long songId, long userId);

    void incrementView(long songId);

    Map<String, Object> chart(int top);

    void updatePlaySongEveryHour();

    Map<String, Long> getSongListeningStatistics();

    long countNewSongs();
}

@Service
@Transactional
class SongServiceImpl implements SongService {

    @Autowired
    private SongRepository repository;
    @Autowired
    private SongLikeRepository likeRepository;
    @Autowired
    private PlayRepository playRepository;
    @Autowired
    private FileService fileService;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<SongDTO> getAll(int page, int limit, String[] sortBy, String[] orderBy, Map<String, String[]> query) {
        // specification
        Specification<Song> specification = buildSpecification(query);

        // sort
        List<Sort.Order> sortList = new ArrayList<>();
        for (int i = 0; i < sortBy.length; i++) {
            if (i < orderBy.length) {
                if (orderBy[i].equals("desc")) {
                    sortList.add(new Sort.Order(Sort.Direction.DESC, sortBy[i]));
                    continue;
                }
            }
            sortList.add(new Sort.Order(Sort.Direction.ASC, sortBy[i]));
        }

        // page request
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(sortList));

        // find
        List<Song> songs = repository.findAll(specification, pageRequest).toList();

        // convert to dto
        return songs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<SongDTO> getFavoritesList(int page, int limit, String[] sortBy, String[] orderBy) {

        // sort
        List<Sort.Order> sortList = new ArrayList<>();
        for (int i = 0; i < sortBy.length; i++) {
            if (i < orderBy.length) {
                if (orderBy[i].equals("desc")) {
                    sortList.add(new Sort.Order(Sort.Direction.DESC, sortBy[i]));
                    continue;
                }
            }
            sortList.add(new Sort.Order(Sort.Direction.ASC, sortBy[i]));
        }

        // page request
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by(sortList));

        // find
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
            List<Song> songs = repository.getListSongLiked(user.getId(), pageRequest);
            // convert to dto
            return songs.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
    }

    @Override
    public long countFavoritesList() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
            return repository.countListSongLiked(user.getId());
        } catch (Exception e) {
            throw new CommonException("You need to login first");
        }
    }

    @Override
    public SongDTO getById(long id) {
        Song song = repository.findById(id).orElseThrow(() -> new CommonException("Song cannot be found"));
        return convertToDTO(song);
    }

    @Override
    public SongDTO getBySlug(String slug) {
        Song song = repository.findBySlug(slug).orElseThrow(() -> new CommonException("Song cannot be found"));
        return convertToDTO(song);
    }

    @Override
    public SongDTO create(SongDTO songDTO) {
        if (repository.findByTitle(songDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));
        Song song = convertToEntity(songDTO);
        // save song
        song.setCommentCount(0l);
        song.setLikeCount(0l);
        song.setView(0l);
        Song songUpdated = repository.save(song);
        // add 24 play for song
        for (int i = 0; i < 24; i++) {
            playRepository.save(Play.builder().count(0).song(Song.builder().id(songUpdated.getId()).build()).label(String.valueOf(i)).build());
        }
        return convertToDTO(songUpdated);
    }

    @Override
    public SongDTO update(long id, SongDTO songDTO) {
        Song song = repository.findById(id).orElseThrow(() -> new CommonException("Song cannot be found"));

        if (!song.getSlug().equals(songDTO.getSlug()) && repository.findBySlug(songDTO.getSlug()).isPresent())
            throw new CustomSQLException("Error", Map.of("slug", "Slug already exists"));
        if (!song.getTitle().equals(songDTO.getTitle()) && repository.findByTitle(songDTO.getTitle()).isPresent())
            throw new CustomSQLException("Error", Map.of("title", "Title already exists"));

        String prefixDownloadUrl = "http://localhost:8080/api/files/download/";
        if (!song.getImageUrl().equals(songDTO.getImageUrl())) {
            if (song.getImageUrl().startsWith(prefixDownloadUrl))
                fileService.deleteFile(song.getImageUrl().substring(prefixDownloadUrl.length()));
        }
        if (!song.getBackgroundImageUrl().equals(songDTO.getBackgroundImageUrl())) {
            if (song.getBackgroundImageUrl().startsWith(prefixDownloadUrl))
                fileService.deleteFile(song.getBackgroundImageUrl().substring(prefixDownloadUrl.length()));
        }
        if (!song.getSourceUrls().get(0).equals(songDTO.getSourceUrls().get(0))) {
            if (song.getSourceUrls().get(0).startsWith(prefixDownloadUrl))
                fileService.deleteFile(song.getSourceUrls().get(0).substring(prefixDownloadUrl.length()));
        }

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(SongDTO.class, Song.class).setProvider(provider -> song).addMappings(mapping -> mapping.skip(Song::setId)).addMappings(mapping -> mapping.skip(Song::setCreatedBy)).addMappings(mapping -> mapping.skip(Song::setUpdatedBy));

        Song songUpdated = mapper.map(songDTO, Song.class);
        return convertToDTO(repository.save(songUpdated));
    }

    @Override
    public void delete(long id) {
        Song song = repository.findById(id).orElseThrow(() -> new CommonException("Song cannot be found"));
        String prefixDownloadUrl = "http://localhost:8080/api/files/download/";
        if (song.getImageUrl().startsWith(prefixDownloadUrl))
            fileService.deleteFile(song.getImageUrl().substring(prefixDownloadUrl.length()));
        if (song.getBackgroundImageUrl().startsWith(prefixDownloadUrl))
            fileService.deleteFile(song.getBackgroundImageUrl().substring(prefixDownloadUrl.length()));
        if (song.getSourceUrls().get(0).startsWith(prefixDownloadUrl))
            fileService.deleteFile(song.getSourceUrls().get(0).substring(prefixDownloadUrl.length()));
        repository.delete(song);
    }

    @Override
    public long count(Map<String, String[]> query) {
        Specification<Song> specification = buildSpecification(query);
        return repository.count(specification);
    }

    @Override
    public long count() {
        return repository.count();
    }

    @Override
    public void like(long songId, long userId) {
        if (likeRepository.findByUserAndSong(userId, songId).isPresent())
            throw new CommonException("You liked this" + " song");
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User cannot be found"));
        Song song = repository.findById(songId).orElseThrow(() -> new CommonException("Song cannot be find"));
        likeRepository.save(SongLike.builder().song(song).user(user).build());
        song.incrementLikeCount();
        repository.save(song);
    }

    @Override
    public void unlike(long songId, long userId) {
        Optional<SongLike> songLikeOptional = likeRepository.findByUserAndSong(userId, songId);
        if (songLikeOptional.isEmpty()) throw new CommonException("You don't like this song");
        likeRepository.delete(songLikeOptional.get());
        Song song = repository.findById(songId).orElseThrow(() -> new CommonException("Song cannot be find"));
        song.decrementCommentCount();
        repository.save(song);
    }

    @Override
    public boolean isLiked(long songId, long userId) {
        Optional<SongLike> songLikeOptional = likeRepository.findByUserAndSong(userId, songId);
        return songLikeOptional.isPresent();
    }


    @Override
    public void deleteComment(long songId, long userId) {

    }

    @Override
    public void incrementView(long songId) {
        Song song = repository.findById(songId).orElseThrow(() -> new CommonException("Song cannot be found"));
        if(song.getView() == null) song.setView(1l);
        else song.incrementView();
        LocalDateTime now = LocalDateTime.now();
        String hour = String.valueOf(now.getHour());
        Optional<Play> playOptional = playRepository.findBySongIdAndLabel(song.getId(), hour);
        if (playOptional.isPresent()) {
            Play play = playOptional.get();
            play.incrementCount();
            playRepository.save(play);
        }
        repository.save(song);
    }

    @Override
    public Map<String, Object> chart(int top) {
        LocalDateTime now = LocalDateTime.now();
        int currentHour = now.getHour();
        int previousHour = currentHour - 1 < 0 ? 23 : currentHour - 1;
        List<Play> plays = playRepository.findTopPlayCount(String.valueOf(currentHour), PageRequest.of(0, top));
        List<Play> oldPlays = playRepository.findTopPlayCount(String.valueOf(previousHour), PageRequest.of(0, top));
        List<Song> songs = plays.stream().map(Play::getSong).collect(Collectors.toList());
        List<Song> oldSongs = oldPlays.stream().map(Play::getSong).collect(Collectors.toList());
//        long minCount = 0, maxCount = 0;
        // datasets
        List<Object> datasets = new ArrayList<>();
        for (Song song : songs) {
            List<Long> counts = song.getPlays().stream().sorted(Comparator.comparing(play -> Integer.parseInt(play.getLabel()))).map(Play::getCount).collect(Collectors.toList());
//            long maxCountOfList = counts.stream().max(Long::compare).get();
//            long minCountOfList = counts.stream().min(Long::compare).get();
//            maxCount = maxCountOfList > maxCount ? maxCountOfList : maxCount;
//            minCount = minCountOfList < minCount ? minCountOfList : minCount;
            List<Long> countsSorted = counts.subList(now.getHour() + 1, counts.size());
            countsSorted.addAll(counts.subList(0, now.getHour() + 1));
            datasets.add(Map.of("data", countsSorted));
        }
        // labels
        String[] labels = new String[24];
        for (int i = 0; i < 24; i++) {
            labels[i] = String.valueOf((now.getHour() + i + 1) % 24);
        }
        // top_song
        List<SongDTO> topSongs = songs.stream().map(song -> {
            int rankChange = 0;
            int previousRank = oldSongs.indexOf(song);
            int currentRank = songs.indexOf(song);
            if (previousRank != -1) {
                rankChange = previousRank - currentRank;
            }
            SongDTO songDTO = convertToDTO(song);
            songDTO.setRankChange(rankChange);
            return songDTO;
        }).collect(Collectors.toList());

        // , "maxCount", maxCount, "minCount", minCount
        return Map.of("datasets", datasets, "labels", labels, "top_songs", topSongs);
    }

    @Override
    @Scheduled(cron = "0 0 * * * *")
    public void updatePlaySongEveryHour() {
//        List<Long> listIdSong = repository.findAllIdSong();
//        LocalDateTime now = LocalDateTime.now();
//        String hour = String.valueOf(now.getHour());
//        for (long idSong : listIdSong) {
//            Optional<Play> playOptional = playRepository.findBySongIdAndLabel(idSong, hour);
//            Play play;
//            if (playOptional.isEmpty()) {
//                play = Play.builder().count(0).song(Song.builder().id(idSong).build()).label(hour).build();
//            } else {
//                play = playOptional.get();
//                play.setCount(0);
//            }
//            playRepository.save(play);
//        }

    }

    @Override
    public Map<String, Long> getSongListeningStatistics() {
        return playRepository.getTotalListensByLabel();
    }

    @Override
    public long countNewSongs() {
        return repository.countNewSongsToday();
    }

    private Specification<Song> buildSpecification(Map<String, String[]> query) {
        GenericSpecificationBuilder builder = new GenericSpecificationBuilder();
        for (Map.Entry<String, String[]> entry : query.entrySet()) {
            // if entry with key is "search" => search by title, artist name, composer name, album title
            if (entry.getKey().equals("search")) {
                builder.with(SearchCriteria.builder().key("title").operation("=").value(entry.getValue()[0]).isOrPredicate(true).build());
                builder.with(SearchCriteria.builder().key("artists.fullName").operation("=").value(entry.getValue()[0]).isOrPredicate(true).joinType(Artist.class).build());
                builder.with(SearchCriteria.builder().key("album.title").operation("=").value(entry.getValue()[0]).isOrPredicate(true).joinType(Album.class).build());
                builder.with(SearchCriteria.builder().key("composer.fullName").operation("=").value(entry.getValue()[0]).isOrPredicate(true).joinType(Composer.class).build());
                continue;
            }
            SearchCriteria searchCriteria = null;
            // request.getParameterMap() can't check query has characters ">" and "<"
            // => return 1 entry with value is "" and key is query itself
            // check case query has characters ">" and "<"
            if (entry.getValue()[0].equals("")) {
                // query split
                Pattern pattern = Pattern.compile("(\\w+)([><])(\\d+)");
                Matcher matcher = pattern.matcher(entry.getKey());
                if (matcher.find()) {
                    searchCriteria = new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), Song.class);
                }
            } else searchCriteria = new SearchCriteria(entry.getKey(), "=", entry.getValue()[0], Song.class);

            if (searchCriteria != null) {
                if (entry.getKey().startsWith("tags")) searchCriteria.setJoinType(Tag.class);
                if (entry.getKey().startsWith("categories")) searchCriteria.setJoinType(Category.class);
                if (entry.getKey().startsWith("artists")) searchCriteria.setJoinType(Artist.class);
                if (entry.getKey().startsWith("composer")) searchCriteria.setJoinType(Composer.class);
                if (entry.getKey().startsWith("album")) searchCriteria.setJoinType(Album.class);
                if (entry.getKey().startsWith("createdBy")) searchCriteria.setJoinType(User.class);
                if (entry.getKey().startsWith("updatedBy")) searchCriteria.setJoinType(User.class);
                if (entry.getKey().startsWith("search")) searchCriteria.setOrPredicate(true);
                builder.with(searchCriteria);
            }

        }
        return builder.build();
    }

    private SongDTO convertToDTO(Song song) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(Song.class, SongDTO.class).setPostConverter(context -> {
            // user
            User createdBy = context.getSource().getCreatedBy();
            User updatedBy = context.getSource().getUpdatedBy();
            context.getDestination().setCreatedBy(UserDTO.builder().id(createdBy.getId()).email(createdBy.getEmail()).build());
            context.getDestination().setUpdatedBy(UserDTO.builder().id(updatedBy.getId()).email(updatedBy.getEmail()).build());

            //like
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
                User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();
                if (user != null) {
                    Optional<SongLike> songLikeOptional = likeRepository.findByUserAndSong(user.getId(), context.getSource().getId());
                    if (songLikeOptional.isPresent()) context.getDestination().setLiked(true);
                }
            }

            // album
            Album album = context.getSource().getAlbum();
            if (album != null)
                context.getDestination().setAlbum(AlbumDTO.builder().id(album.getId()).slug(album.getSlug()).title(album.getTitle()).backgroundImageUrl(album.getBackgroundImageUrl()).build());

            // tags
            List<Tag> tags = context.getSource().getTags();
            if (tags != null)
                context.getDestination().setTags(tags.stream().map(tag -> TagDTO.builder().id(tag.getId()).slug(tag.getSlug()).title(tag.getTitle()).build()).collect(Collectors.toList()));

            // categories
            List<Category> categories = context.getSource().getCategories();
            if (categories != null)
                context.getDestination().setCategories(categories.stream().map(category -> CategoryDTO.builder().id(category.getId()).slug(category.getSlug()).title(category.getTitle()).build()).collect(Collectors.toList()));

            // artist
            List<Artist> artists = context.getSource().getArtists();
            if (artists != null)
                context.getDestination().setArtists(artists.stream().map(artist -> ArtistDTO.builder().id(artist.getId()).fullName(artist.getFullName()).avatarUrl(artist.getAvatarUrl()).slug(artist.getSlug()).build()).collect(Collectors.toList()));

            // view
            if(context.getSource().getView() == null) context.getDestination().setView(0l);

            // composer
            Composer composer = context.getSource().getComposer();
            if (composer != null)
                context.getDestination().setComposer(ComposerDTO.builder().id(composer.getId()).slug(composer.getSlug()).fullName(composer.getFullName()).avatarUrl(composer.getAvatarUrl()).build());
            return context.getDestination();
        }).addMappings(mapping -> mapping.skip(SongDTO::setComments)).addMappings(mapping -> mapping.skip(SongDTO::setLikes));


        return mapper.map(song, SongDTO.class);
    }

    private Song convertToEntity(SongDTO songDTO) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT).setPropertyCondition(Conditions.isNotNull());
        mapper.createTypeMap(SongDTO.class, Song.class).addMappings(mapping -> mapping.skip(Song::setId));

        return mapper.map(songDTO, Song.class);
    }
}

