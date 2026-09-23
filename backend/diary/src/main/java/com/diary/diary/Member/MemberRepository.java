package com.diary.diary.Member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Repository는 DB접근
// Member DB를 저장/조회/삭제 할 수 있는 인터페이스
public interface MemberRepository extends JpaRepository<Member, Long> {   // Member: 테이블 대상, Long: id타입
    Optional<Member> findByUsername(String username);   // username으로 Member찾아줘!
}
