package com.diary.diary.Posts;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


// 홈 화면용 묶음 Dto

@Getter
@Setter
public class PostDto {
    private List<PostResponseDto> privatePosts;
    private List<PostResponseDto> sharePosts;
    private List<PostResponseDto> openPosts;
    private Long myPostCount;

}


