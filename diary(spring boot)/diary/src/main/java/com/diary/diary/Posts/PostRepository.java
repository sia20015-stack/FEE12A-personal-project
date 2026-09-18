package com.diary.diary.Posts;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // private 조회
    Page<Post> findByUsernameAndVisibility(String username, String visibility, Pageable pageable);

    // share 코드 조회?
//    List<Post> findByShareCode(String shareCode);
    List<Post> findByShareCodeOrderByCreatedAtDesc(String shareCode);

    // 특정 코드를 가진 공유글만 페이지로 가져오기
    Page<Post> findByShareCodeAndVisibility(String shareCode, String visibility, Pageable pageable);

    // open 조회
    List<Post> findTop5ByVisibilityOrderByCreatedAtDesc(String visibility);

    // 게시글 날짜 조회(mylog용)
    List<Post> findByUsernameAndCreatedAtBetween(String username, LocalDateTime start, LocalDateTime end);

    //
    Page<Post> findByVisibility(String visibility, Pageable pageable);

    // 자기가 쓴 게시글 셀라고
    long countByUsername(String username);

    // 홈하면 교환 일기장 목록 뜰 때, 같은 코드방 사람들 글도 다 보이게
    List<Post> findByShareCodeInAndVisibilityOrderByCreatedAtDesc(List<String> shareCodes, String visibility);
}
