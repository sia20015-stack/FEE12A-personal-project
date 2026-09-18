package com.diary.diary.Posts;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@ToString
@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;

    @ElementCollection   // List같은 여러 값을 DB에서 따로 관리하기 위한 JPA방식
    private List<String> colors;
    // 색상 3개를 저장해야하는데 그냥 String하면 1개만 저장하니까 위에처럼 써주기
    // 그러면 colors = ["#000000", "#111111", "#222222"] 이런시긍로 드러감


    private String username;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @CreationTimestamp
    private LocalDateTime createdAt;

    private String visibility;   // 개인, 공유, 전체 볼 수 있는 권한 나눌라고

    private String shareCode;   // 공유일 때 사용(코드 입력한 사람들끼리만 게시글 볼 수 있게)

    private String thumbnail;

    private String roomname;
}



