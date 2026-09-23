package com.diary.diary.Posts;

import com.diary.diary.ShareRoomMember.ShareRoomMember;
import com.diary.diary.ShareRoomMember.ShareRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@RequiredArgsConstructor
@Service
public class PostService {

    // DB 연결!
    private final PostRepository postRepository;
    private final ShareRoomMemberRepository shareRoomMemberRepository;


    // private 게시글 조회(getPrivatePosts: 게시글 목록 가져오기, Pageable pageable: 페이지 처리)
    public Page<PostResponseDto> getPrivatePosts(String username, Pageable pageable){
        return postRepository.findByUsernameAndVisibility(username, "private", pageable).map(PostResponseDto::new);
    }

    // share 게시글 조회
    public Page<PostResponseDto> getByShareCode(String shareCode, Pageable pageable){

        return postRepository
                .findByShareCodeAndVisibility(
                        shareCode,
                        "share",
                        pageable
                )
                .map(PostResponseDto::new);
    }

    // open 게시글 조회(getOpenPosts: 게시글 목록 가져오기, Pageable pageable: 페이지 처리)
    public Page<PostResponseDto> getOpenPosts(Pageable pageable){
        return postRepository.findByVisibility("open", pageable).map(PostResponseDto::new);
    }

    // id로 게시글 조회
    public PostResponseDto getPost(Long id){
        return postRepository.findById(id).map(PostResponseDto::new).orElse(null);
    }

    // 게시글 생성 후 DB에 저장
    public Post createPost(Post post){
        return postRepository.save(post);
    }

    // 게시글 수정 후 DB에 저장
    public PostResponseDto updatePost(Long id, Post updatePost, String username) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("not found"));

        if (!post.getUsername().equals(username)) {
            return null;
        }

        post.setTitle(updatePost.getTitle());
        post.setContent(updatePost.getContent());
        post.setColors(updatePost.getColors());
        post.setThumbnail(updatePost.getThumbnail());

        Post saved = postRepository.save(post);

        return new PostResponseDto(post);
    }

    // 게시글 삭제
    public boolean deletePost(Long id, String username){
        Post post = postRepository.findById(id).orElse(null);

        if (post == null) return false;

        // 작성자 아니면 삭제 불가!
        if (!post.getUsername().equals(username)){
            return false;
        }
        postRepository.delete(post);
        return true;
    }

    
    // 각 게시글 분류별로 권한? 나누기
    public List<PostResponseDto> getPosts(String username, String shareCode){
        return postRepository.findAll().stream().filter(post -> {
        // postRepository.findAll(): DB에 있는 Post 다가져오기, stream(): 하나씩 처리(검사)할 준비, filter: 조건에 맞는 것만 통과

            // 작성자 본인만 볼 수 있음!
            if ("private".equals(post.getVisibility()))
                return username != null && username.equals(post.getUsername());

            // 같은 코드 가진 사람끼리만 볼 수 있음!
            if ("share".equals(post.getVisibility()))
                return shareCode != null && shareCode.equals(post.getShareCode());

            // 공개 글이면 누구나 볼 수 있음!
            if ("open".equals(post.getVisibility()))
                return true;

            // 어떤 조건도 아니면 버림
            return false;
        }).map(PostResponseDto::new).toList();
    }

    // 랜덤 공유코드 만들어주는거
    public String generateShareCode(){
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    // substring(0, 8): 8글자,toUpperCase(): 대문자로 변환


    // 특정 년, 월에 작성한 게시글 골라서 가져오기(mylog용)
    public List<PostResponseDto> getPostByMonth(int year, int month, String username){   // 프론트에서 년, 월 받아옴
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);   // 시작 날짜 만들기(달의 시작)
        LocalDateTime end = start.plusMonths(1);   // 끝 날짜 만들기(달의 끝)

        return postRepository.findByUsernameAndCreatedAtBetween(username, start, end).stream().map(PostResponseDto::new).toList();   // 이 범위 안에 있는 글만 가져오기!
    }

    // 개인, 공유, 공개 일기장 전부 조회(Home용)
    public PostDto getHomePosts(String username, Pageable pageable) {

        PostDto res = new PostDto();

        List<ShareRoomMember> rooms =
                shareRoomMemberRepository.findByUsername(username);

        List<String> codes = rooms.stream()
                .map(r -> r.getShareCode().getShareCode())
                .toList();

        List<PostResponseDto> sharePosts =
                postRepository.findByShareCodeInAndVisibilityOrderByCreatedAtDesc(
                                codes,
                                "share"
                        )
                        .stream()
                        .map(PostResponseDto::new)
                        .toList();

        res.setSharePosts(sharePosts);

        // 공개글은 누구나 조회 가능
        res.setOpenPosts(
                postRepository.findTop5ByVisibilityOrderByCreatedAtDesc("open")
                        .stream()
                        .map(PostResponseDto::new)
                        .toList()
        );

        // 로그인 안했으면 공개글만 반환
        if (username == null || username.isBlank()) {
            res.setMyPostCount(0L);
            res.setPrivatePosts(Collections.emptyList());
            res.setSharePosts(Collections.emptyList());

            return res;
        }

        // 로그인한 경우만 private/share 조회
        long count = postRepository.countByUsername(username);
        res.setMyPostCount(count);

        res.setPrivatePosts(
                postRepository.findByUsernameAndVisibility(username, "private", pageable)
                        .getContent()
                        .stream()
                        .map(PostResponseDto::new)
                        .toList()
        );

//        res.setSharePosts(
//                postRepository.findByShareCodeAndVisibilityOrderByCreatedAtDesc(
//                                shareCode,
//                                "share"
//                        )
//                        .stream()
//                        .map(PostResponseDto::new)
//                        .toList()
//        );

        return res;
    }


}

