package com.diary.diary.ShareCode;


import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ShareRoomDto {
    private String shareCode;
    private String roomname;
    private List<String> members;
    private Integer maxMembers;
}
