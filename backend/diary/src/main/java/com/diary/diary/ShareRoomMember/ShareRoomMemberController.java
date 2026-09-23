package com.diary.diary.ShareRoomMember;

import com.diary.diary.ShareCode.ShareCode;
import com.diary.diary.ShareCode.ShareCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/sharecode")
public class ShareRoomMemberController {

    private final ShareCodeRepository shareCodeRepository;
    private final ShareRoomMemberRepository shareRoomMemberRepository;
    private final ShareRoomMemberService shareRoomMemberService;

    @GetMapping("/myrooms")
    public ResponseEntity<?> getMyRooms(@RequestParam String username) {
        return ResponseEntity.ok(
                shareRoomMemberRepository.findByUsername(username)
        );
    }


    @PostMapping("/join/{code}")
    public ResponseEntity<?> joinRoom(@PathVariable String code, @RequestBody Map<String, String> req){
        String username = req.get("username");

        try{
            shareRoomMemberService.joinRoom(code, username);

            return ResponseEntity.ok("입장 성공");
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 생성된 코드의 DB에 들어있지 않으면 접근 불가(주소 치고 들어가는거 방지)
    @GetMapping("/room/access/{code}")
    public ResponseEntity<?> checkAccess(
            @PathVariable String code,
            @RequestParam String username
    ){

        System.out.println("===== access check =====");
        System.out.println("username = " + username);
        System.out.println("code = " + code);

        boolean joined =
                shareRoomMemberRepository
                        .existsByUsernameAndShareCode_ShareCode(
                                username,
                                code
                        );

        System.out.println("joined = " + joined);

        List<ShareRoomMember> members =
                shareRoomMemberRepository.findByUsername(username);

        System.out.println("members = " + members);

        if (!joined) {
            return ResponseEntity
                    .status(403)
                    .body("접근 권한 없음");
        }

        return ResponseEntity.ok("접근 가능");
    }
}



