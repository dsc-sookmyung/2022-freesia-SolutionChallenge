package com.freesia.imyourfreesia.controller;


import com.freesia.imyourfreesia.domain.likes.Likes;
import com.freesia.imyourfreesia.dto.likes.LikeSaveRequestDto;
import com.freesia.imyourfreesia.service.LikesService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(tags={"Likes API"})
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LikesController {
    private final LikesService likesService;

    /* 좋아요 설정 */
    @ApiOperation(value="좋아요 설정", notes="좋아요 설정 API")
    @ApiImplicitParam(name = "LikeSaveRequestDto", value = "좋아요 설정 dto")
    @PostMapping("/likes")
    public ResponseEntity<Likes> likes(@RequestBody LikeSaveRequestDto requestDto){
        return ResponseEntity.ok()
                .body(likesService.likes(requestDto));
    }

    /* 좋아요 해제 */
    @ApiOperation(value="좋아요 해제", notes="좋아요 해제 API")
    @ApiImplicitParam(name = "id", value = "좋아요 id", dataType="Long", paramType="query")
    @DeleteMapping("/likes")
    public ResponseEntity<?> unLikes(@RequestParam Long id){
        likesService.unLikes(id);
        return ResponseEntity.noContent().build();
    }

    /* 좋아요 목록 조회 */
    @ApiOperation(value="좋아요 목록 조회", notes="좋아요 목록 조회 API")
    @ApiImplicitParam(name = "pid", value = "게시글 id", dataType="Long", paramType="query")
    @GetMapping("/likes")
    public ResponseEntity<List<Likes>> loadLikes(@RequestParam Long pid){
        return ResponseEntity.ok()
                .body(likesService.findAllByPid(pid));
    }

    /* 좋아요 개수 조회 */
    @ApiOperation(value="좋아요 개수 조회", notes="좋아요 개수 조회 API")
    @ApiImplicitParam(name = "pid", value = "게시글 id", dataType="Long", paramType="query")
    @GetMapping("/likes/cnt")
    public Long countLikes(@RequestParam Long pid){
        return likesService.countByPid(pid);
    }
}