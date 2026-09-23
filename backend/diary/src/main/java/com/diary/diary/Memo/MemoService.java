package com.diary.diary.Memo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MemoService {

    @Autowired
    private MemoRepository memoRepository;

    // 조회
    public Memo getMemo(String username, int year, int month){
        return memoRepository.findByUsernameAndYearAndMonth(username, year, month).orElse(new Memo()); // 없으면 빈 값
    }

    // 저장
    public Memo saveMemo(String username, int year, int month, String memoTEXT){
        Optional<Memo> existing = memoRepository.findByUsernameAndYearAndMonth(username, year, month);

        Memo memo;

        if(existing.isPresent()){
            memo = existing.get();
        }else {
            memo = new Memo();
            memo.setUsername(username);
            memo.setYear(year);
            memo.setMonth(month);
        }
        memo.setMemo(memoTEXT);
        return memoRepository.save(memo);
    }
}
