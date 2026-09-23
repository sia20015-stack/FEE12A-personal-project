package com.diary.diary.ShareRoomMember;

import com.diary.diary.ShareCode.ShareCode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
public class ShareRoomMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @ManyToOne // 여러 데이터가 하나의 데이터 참조(ex: 공유방 1개에 참여자 여러명)
    private ShareCode shareCode;
}
