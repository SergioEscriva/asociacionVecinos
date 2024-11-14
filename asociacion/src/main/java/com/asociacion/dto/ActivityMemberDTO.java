package com.asociacion.dto;

import lombok.Data;

@Data
public class ActivityMemberDTO {
    private Long activityId;
    private String activityName;
    private Long memberId;
}
