package com.diary.diary.Posts;


import lombok.Getter;
import lombok.Setter;

import java.time.format.DateTimeFormatter;
import java.util.List;


// 게시글용 Dto

@Getter
@Setter
public class PostResponseDto {
    private Long id;
    private String title;
    private String content;
    private List<String> colors;
    private String username;
    private String createdAt;
    private String visibility;
    private String shareCode;
    private String thumbnail;
    private String roomname;

    public PostResponseDto(Post post){
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.colors = post.getColors();
        this.username = post.getUsername();
        this.createdAt = post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.visibility = post.getVisibility();
        this.shareCode = post.getShareCode();
        this.thumbnail = post.getThumbnail();
        this.roomname = post.getRoomname();

    }



}



