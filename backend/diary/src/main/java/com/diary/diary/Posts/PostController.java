package com.diary.diary.Posts;

import com.diary.diary.ShareCode.ShareCode;
import com.diary.diary.ShareCode.ShareCodeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private ShareCodeRepository shareCodeRepository;

    // 게시글 있으면 보여주고 없으면 404 반환
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long id){   //@PathVariable Long id: URL에서 id를 꺼내 변수로 받음(ex. /posts/5 → id = 5)
        PostResponseDto post = postService.getPost(id);

        if(post==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(post);
    }

    // 게시글 목록별 필터?
//    @GetMapping
//    public ResponseEntity<List<Post>> getPosts(
//            @RequestParam(required = false) String username,
//            @RequestParam(required = false) String shareCode
//    ){
//        return ResponseEntity.ok(postService.getPosts(username, shareCode));
//    }

    // private api
    @GetMapping("/private")
    public ResponseEntity<Page<PostResponseDto>> getPrivatePosts(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );
        return ResponseEntity.ok(postService.getPrivatePosts(username, pageable));
    }

    // share api
    @GetMapping("/share")
    public ResponseEntity<Page<PostResponseDto>> getSharePosts(
            @RequestParam String shareCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ){

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return ResponseEntity.ok(
                postService.getByShareCode(shareCode, pageable)
        );
    }

    // open api
    @GetMapping("/open")
    public ResponseEntity<Page<PostResponseDto>> getOpenPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );
        return ResponseEntity.ok(postService.getOpenPosts(pageable));
    }

    // 3개 api 통합해서 조회(home화면에서)
    @GetMapping("/home")
    public ResponseEntity<PostDto> getHomePosts(
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return ResponseEntity.ok(
                postService.getHomePosts(username, pageable)
        );
    }



    // 게시글 데이터 저장
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post){

        // shareCode로 roomname 찾아서 넣기
        if (post.getShareCode() != null) {
            ShareCode room = shareCodeRepository.findByShareCode(post.getShareCode())
                    .orElse(null);

            if (room != null) {
                post.setRoomname(room.getRoomname());
            }
        }

        return ResponseEntity.ok(postService.createPost(post));
    }

    // 게시글 수정(게시글 쓴 사람만 가능하게)
    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDto> updatePost(@PathVariable Long id, @RequestBody Post updatePost, @RequestParam String username){
        PostResponseDto result = postService.updatePost(id, updatePost, username);

        if (result == null){
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(result);
    }

    // 게시글 삭제(게시글 쓴 사람만 가능하게)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, @RequestParam String username){
        boolean deleted = postService.deletePost(id, username);   // true: 삭제 성공, false: 삭제 실패(404화면)
        if (deleted){
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    // 공유 코드 만들어주기
//    @PostMapping("/sharecode")
//    public ResponseEntity<Map<String, String>> createShareCode(
//            @RequestBody Map<String, String> req
//    ) {
//
//        String username = req.get("username");
//
//        String code = postService.generateShareCode();
//
//        Post sharePost = new Post();
//        sharePost.setUsername(username);
//        sharePost.setVisibility("share");
//        sharePost.setShareCode(code);
//
//        postService.createPost(sharePost);
//
//        Map<String, String> res = new HashMap<>();
//        res.put("sharecode", code);
//
//        return ResponseEntity.ok(res);
//    }

    // 게시글

    // mylog에서 글 가져올 때
    @GetMapping("/mylog")
    public List<PostResponseDto> getDiary(@RequestParam int year, @RequestParam int month, @RequestParam String username){
        return postService.getPostByMonth(year, month, username);
    }


}





