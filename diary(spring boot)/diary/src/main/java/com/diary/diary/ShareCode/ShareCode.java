package com.diary.diary.ShareCode;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@Entity
public class ShareCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String shareCode; // 공유일 때 사용(코드 입력한 사람들끼리만 게시글 볼 수 있게)

    private String createdBy; // 누가 만들억ㅆ는지..?

    private String roomname;

    private int maxMember;
}



