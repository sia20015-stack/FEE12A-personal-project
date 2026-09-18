package com.diary.diary.Member;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor   // 생성자 자동으로 만들어줘!
@Service                   // 이 클래스는 서비스니까 Spring이 관리해줘!
// 클래스 선언 > Spring Security 로그인 기능을 직접 구현하겠다!
// implements: 규칙(기능)을 반드시 따라야 한다!
// implements UserDetailsService > Spring Security가 요구하는 로그인 처리 규칙을 내가 직접 구현
public class MyUserDetailService implements UserDetailsService {

    // DB연결
    private final MemberRepository memberRepository;

    @Override   // Spring이 요구한 로그인 함수 직접 만들기
    // loadUserByUsername(String username) > 로그인할 때 Spring이 자동으로 호출하는 함수
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{

        // 입력한 아이디로 DB 검색
        var result = memberRepository.findByUsername(username);

        // DB에 유저가 없으면 아이디가 없다고 알려주기
        if(result.isEmpty()){
            throw new UsernameNotFoundException("존재하지 않은 아이디입니다");
        }

        // DB에서 찾은 Member 객체 꺼냄
        var user = result.get();

        // 권한을 담을 리스트 생성
        List<GrantedAuthority> authorities = new ArrayList<>();
        // 만든 리스트에 일반유저 넣기
        authorities.add(new SimpleGrantedAuthority("일반유저"));

        // Spring Security가 이해할 수 있는 로그인 객체로 변환
        CustomUser customUser = new CustomUser(user.getUsername(), user.getPassword(), authorities);
        // 추가 정보 넣기
        customUser.displayname = user.getDisplayname();
        customUser.id = user.getId();

        return customUser;
    }
}
