package com.diary.diary.ShareCode;


import com.diary.diary.ShareRoomMember.ShareRoomMember;
import com.diary.diary.ShareRoomMember.ShareRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {
    "https://feel2a.vercel.app",
    "http://localhost:3000"
})
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/sharecode")
public class ShareCodeController {

    private final ShareCodeRepository shareCodeRepository;
    private final ShareCodeService shareCodeService;
    private final ShareRoomMemberRepository shareRoomMemberRepository;

    // 공유코드 생성
    @PostMapping
    public ResponseEntity<Map<String, String>> createShareCode(
        @RequestBody Map<String, String> req
    ){
        String username = req.get("username");

        ShareCode shareCode = shareCodeService.createShareCode(username);

        Map<String, String> res = new HashMap<>();
        res.put("sharecode", shareCode.getShareCode());

        return ResponseEntity.ok(res);
    }

    // 코드 검증
    @GetMapping("/{code}")
    public ResponseEntity<Map<String, Object>> checkCode(@PathVariable String code, @RequestParam String username){
        Optional<ShareCode> optional = shareCodeRepository.findByShareCode(code);

        Map<String, Object> res = new HashMap<>();

        // 코드 없음
        if(optional.isEmpty()){
            res.put("exists", false);

            return ResponseEntity.ok(res);
        }

        ShareCode room = optional.get();

        res.put("exists", true);

        // 방 생성 전
        res.put("isNewRoom", room.getRoomname() == null);

        // 이미 참여 했을 때
        boolean alreadyJoined = shareRoomMemberRepository.existsByUsernameAndShareCode_ShareCode(username, room.getShareCode());

        res.put("alreadyJoined", alreadyJoined);

        return ResponseEntity.ok(res);
    }

    // 방 설정 api
    @PostMapping("/room/{code}")
    public ResponseEntity<?> createRoom(@PathVariable String code, @RequestBody Map<String, String> req){
        ShareCode room = shareCodeRepository.findByShareCode(code).orElseThrow();

        room.setRoomname(req.get("roomname"));
        room.setMaxMember(Integer.parseInt(req.get("maxMember")));
        shareCodeRepository.save(room);

        return ResponseEntity.ok().build();
    }

    // 방 정보 조회 api
    @GetMapping("/room/{code}")
    public ResponseEntity<?> getRoom(
            @PathVariable String code
    ){

        ShareCode room = shareCodeRepository
                .findByShareCode(code)
                .orElseThrow();

        return ResponseEntity.ok(room);
    }

    // 방 목록 api 추가
    @GetMapping("/list")
    public ResponseEntity<?> getRooms(
            @RequestParam String username,
            @RequestParam int page,
            @RequestParam int size
    ) {

        List<ShareCode> rooms = shareRoomMemberRepository
                .findByUsername(username)
                .stream()
                .map(ShareRoomMember::getShareCode)
                .toList();

        int start = page * size;
        int end = Math.min(start + size, rooms.size());

        List<ShareCode> pageRooms = rooms.subList(start, end);

        List<ShareRoomDto> result = pageRooms.stream()
                .map(room -> {

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
                })
                .toList();

        Map<String, Object> res = new HashMap<>();
        res.put("content", result);
        res.put("totalPages", (int) Math.ceil((double) rooms.size() / size));

        return ResponseEntity.ok(res);
    }
}
