package com.freesia.imyourfreesia.dto.challenge;

import com.freesia.imyourfreesia.domain.challenge.Challenge;
import com.freesia.imyourfreesia.domain.user.User;
import lombok.Getter;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ChallengeListResponseDto {
    private Long id;
    private User uid;
    private String title;
    private String contents;
    //private Long thumnailId;
    private String filePath;
    private LocalDate createdDate;
    private LocalDate modifiedDate;
    // private String createdDate;
    // private String modifiedDate;

    public ChallengeListResponseDto(Challenge entity){
        this.id = entity.getId();
        this.uid = entity.getUid();
        this.title = entity.getTitle();
        this.contents = entity.getContents();

        String absolutePath = new File("").getAbsolutePath() + File.separator + File.separator;

        if(!entity.getImage().isEmpty()){
            this.filePath = absolutePath + entity.getImage().get(0).getFilePath();
        }else{
            this.filePath = "";
        }

        this.createdDate = entity.getCreatedDate();
        this.modifiedDate = entity.getModifiedDate();
    }
}
