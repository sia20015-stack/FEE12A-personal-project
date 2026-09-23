package com.diary.diary.Memo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memo")
public class MemoController {

    @Autowired
    private MemoService memoService;

    // 조회
    @GetMapping
    public ResponseEntity<Memo> getMemo(
        @RequestParam String username, @RequestParam int year, @RequestParam int month
    ){
        return ResponseEntity.ok(memoService.getMemo(username, year, month));
    }

    // 저장
    @PostMapping
    public ResponseEntity<Memo> saveMemo(@RequestBody Memo req){
        Memo result = memoService.saveMemo(
                req.getUsername(),
                req.getYear(),
                req.getMonth(),
                req.getMemo()
        );
        return ResponseEntity.ok(result);
    }
}
