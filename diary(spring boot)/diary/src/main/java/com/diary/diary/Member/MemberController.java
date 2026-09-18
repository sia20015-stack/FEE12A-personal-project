package com.diary.diary.Member;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.diary.diary.Member.MemberDto;

import java.util.Map;
import java.util.Objects;


@RestController            // 데이터(JSON)반환
@RequiredArgsConstructor   // 생성자 자동으로 만들어주는거
@CrossOrigin(origins = "*")   // 프론트에서 이 백엔드 API호출해도 허용
public class MemberController {

    private final MemberRepository memberRepository;

    // PasswordEncoder: 비밀번호를 암호화 해주는 도구
    private final PasswordEncoder passwordEncoder;

    // 회원가입 데이터 받음 > 비밀번호 암호화 > DB 저장 > 로그인 페이지 이동
    @PostMapping("/member")
    public String addMember(@RequestBody MemberDto dto){
        Member member = new Member();  // Member 객체 생성 (DB에 저장할 회원 틀 만들기)
        member.setUsername(dto.username);  // 입력된 아이디 저장
        var hash = passwordEncoder.encode(dto.password);  // 비밀번호 암호화
        member.setPassword(hash);  // 암호화된 비밀번호 저장
        member.setEmail(dto.email);  // 이메일 저장
        member.setPhone(dto.phone);  // 폰 번호 저장
        member.setDisplayname(dto.displayname);  // 사용자 이름 저장
        member.setBirth(dto.birth);
        member.setGender(dto.gender);
        memberRepository.save(member);  // DB에 저장

        return "ok";
    }

    // DB에서 데이터 불러와서 로그인!!!!!
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto dto){
        // 아이디로 DB조회
        Member member = memberRepository.findByUsername(dto.username).orElse(null);

        // 아이디 없을 경우
        if(member == null) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "존재하지 않은 아이디입니다"
            ));
        }

        // 비밀번호 비교
        boolean match = passwordEncoder.matches(dto.password, member.getPassword());

        // 만약에 비번 다르면
        if (!match){
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "비밀번호가 틀렸습니다"
            ));
        }

        // 로그인 성공
        return ResponseEntity.ok(Map.of(
                "success", true,
                "username", member.getUsername()
        ));
    }

}
