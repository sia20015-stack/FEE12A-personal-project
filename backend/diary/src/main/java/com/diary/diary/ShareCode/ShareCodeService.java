package com.diary.diary.ShareCode;


import com.diary.diary.ShareRoomMember.ShareRoomMember;
import com.diary.diary.ShareRoomMember.ShareRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RequiredArgsConstructor   // 생성자 자동으로 만들어줘!
@Service                   // 이 클래스는 서비스니까 Spring이 관리해줘!
public class ShareCodeService {

    // DB 연결
    private final ShareCodeRepository shareCodeRepository;
    private final ShareRoomMemberRepository shareRoomMemberRepository;

    // 공유코드 생성
    public ShareCode createShareCode(String username){
        ShareCode shareCode = new ShareCode();

        shareCode.setShareCode(generatUniqueCode());
        shareCode.setCreatedBy(username);
        shareCode.setRoomname(null);

        return shareCodeRepository.save(shareCode);
    }

    // 코드로 조회
    public Optional<ShareCode> getByCode(String code){
        return shareCodeRepository.findByShareCode(code);
    }

    // 코드 생성(중복생성 안돼도록)
    public String generatUniqueCode() {
        String code;

        do{
            code = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();   // 코드 8자리 생성하는데
        } while (shareCodeRepository.findByShareCode(code).isPresent());   // 만약 중복 있으면 다시 생성

        return code;
    }

    // 공유방 참여자 이름 보이도록
    public List<ShareRoomDto> getRoomsWithMembers(){

        List<ShareCode> rooms = shareCodeRepository.findAll();

        return rooms.stream().map(room -> {
            List<String> members = shareRoomMemberRepository
                    .findByShareCode(room)
                    .stream()
                    .map(ShareRoomMember::getUsername)
                    .toList();

            return new ShareRoomDto(
                    room.getShareCode(),
                    room.getRoomname(),
                    members,
                    room.getMaxMember()
            );
        }).toList();
    }
}
