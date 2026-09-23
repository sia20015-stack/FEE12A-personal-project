
package com.diary.diary.Member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// DB테이블 설계
@Setter     // 객체 안의 데이터 넣기, 수정
@Getter     // 객체 안의 데이터 꺼내기
@ToString   // 객체 내용을 문자열로 보기좋기 보여주는 것
@Entity     // 이 클래스는 DB 테이블로 만들어질 대상이다! 라는걸 알려주는 것
public class Member {   // class > 테이블 구조

    @Id   // 테이블에서 각 행을 구분하는 고유한 값이 id다!
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // id값을 DB가 자동으로 만들어줌
    private Long id;

    @Column(unique = true)   // 이 컬럼값은 중복되면 안된다!
    private String username;
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String phone;

    private String displayname;
    private String password;
    private String birth;
    private String gender;

}
