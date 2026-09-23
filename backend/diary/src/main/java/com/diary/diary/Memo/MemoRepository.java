package com.diary.diary.Memo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemoRepository extends JpaRepository<Memo, Long> {
    Optional<Memo> findByUsernameAndYearAndMonth(
            String username,
            int year,
            int month
    );
}
