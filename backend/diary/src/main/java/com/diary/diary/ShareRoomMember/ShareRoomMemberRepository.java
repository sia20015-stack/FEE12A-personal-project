package com.diary.diary.ShareRoomMember;

import com.diary.diary.ShareCode.ShareCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShareRoomMemberRepository extends JpaRepository<ShareRoomMember, Long> {

    // 특정 방에 몇 명 있는지
    int countByShareCode(ShareCode shareCode);

    // 중복 방지 + 접근 권한 확인
    boolean existsByUsernameAndShareCode_ShareCode(String username, String shareCode);

    // 유저가 참여한 방만 보이게
    List<ShareRoomMember> findByUsername(String username);

    List<ShareRoomMember> findByShareCode(ShareCode shareCode);
}
