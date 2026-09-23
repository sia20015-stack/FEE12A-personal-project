package com.diary.diary.Member;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;


// 클래스 선언 (CustomUser라는 설계도 만듦!)
// Spring Security 로그인 성공 후, 사용자 정보를 확장해서 들고 다니는 클래스
public class CustomUser extends User{

    // 유저를 제대로 구별하기 위해 필요한 정보 추가 (Security는 아이디, 비밀번호, 권한만 줌)
    public String displayname;
    public Long id;

    // 생성자 생성 (CustomUser를 실제로 만들 때 실행되는 코드), 생성자랑 클래스 이름 같아야 함
    public CustomUser(
                      String username,
                      String password,
                      // 사용자가 가지고 있는 권한 목록
                      Collection<? extends GrantedAuthority> authorities
    ){
        // Spring Security가 로그인 처리할 때 필요한 정보 세팅
        super(username, password, authorities);   // super: 부모 클래스(User) 생성
    }
}

// 즉!!!!!!! CustomUser는 로그인한 유저 정보가 담긴 보따리(객체)임!
// 자세히 말하면 Spring Security가 사용하는 로그인 사용자 정보 객체 + 내가 필요한 정보 추가한 것
