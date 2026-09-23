package com.diary.diary.ShareCode;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShareCodeRepository extends JpaRepository<ShareCode, Long> {
    // 중복된 코드가 생성이 안돼도록 조회하기
    Optional<ShareCode> findByShareCode(String sharecode);
}
