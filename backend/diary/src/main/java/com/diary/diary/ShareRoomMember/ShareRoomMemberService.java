package com.diary.diary.ShareRoomMember;


import com.diary.diary.ShareCode.ShareCode;
import com.diary.diary.ShareCode.ShareCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShareRoomMemberService {

    private final ShareCodeRepository shareCodeRepository;
    private final ShareRoomMemberRepository shareRoomMemberRepository;

    // 방 입장 로직
    public void joinRoom(String code, String username){

        // 방 찾기
        ShareCode room = shareCodeRepository.findByShareCode(code).orElseThrow(() -> new RuntimeException("방이 존재하지 않습니다"));

        // 현재 인원 수
        int currentCount = shareRoomMemberRepository.countByShareCode(room);

        // 인원 제한 체크
        if (currentCount >= room.getMaxMember()){
            throw new RuntimeException("정원 초과입니다");
        }

        // 이미 참여하고 있는지 체크(중복 방지)
        boolean alreadyJoined = shareRoomMemberRepository.existsByUsernameAndShareCode_ShareCode(username, room.getShareCode());

        if (alreadyJoined){
            throw new RuntimeException("이미 참여한 방입니다");
        }
        
        // 방 멤버 저장
        ShareRoomMember member = new ShareRoomMember();
        member.setUsername(username);
        member.setShareCode(room);

        shareRoomMemberRepository.save(member);
    }
}
