package com.uade.tpo.marketplace.entity.dto;

import java.time.LocalDateTime;

public class ReviewResponse {
    private Long id;
    private String comment;
    private Integer score;
    private Long userId;
    private String userName;
    private Long vinylId;
    private String vinylName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean edited;

    public ReviewResponse() {
    }

    public Long getId() {
        return this.id;
    }

    public String getComment() {
        return this.comment;
    }

    public Integer getScore() {
        return this.score;
    }

    public Long getUserId() {
        return this.userId;
    }

    public String getUserName() {
        return this.userName;
    }

    public Long getVinylId() {
        return this.vinylId;
    }

    public String getVinylName() {
        return this.vinylName;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public boolean isEdited() {
        return this.edited;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setVinylId(Long vinylId) {
        this.vinylId = vinylId;
    }

    public void setVinylName(String vinylName) {
        this.vinylName = vinylName;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setEdited(boolean edited) {
        this.edited = edited;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof ReviewResponse)) return false;
        ReviewResponse other = (ReviewResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.isEdited() != other.isEdited()) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$score = this.getScore();
        Object other$score = other.getScore();
        if (this$score == null ? other$score != null : !this$score.equals(other$score)) return false;
        Object this$userId = this.getUserId();
        Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        Object this$vinylId = this.getVinylId();
        Object other$vinylId = other.getVinylId();
        if (this$vinylId == null ? other$vinylId != null : !this$vinylId.equals(other$vinylId)) return false;
        Object this$comment = this.getComment();
        Object other$comment = other.getComment();
        if (this$comment == null ? other$comment != null : !this$comment.equals(other$comment)) return false;
        Object this$userName = this.getUserName();
        Object other$userName = other.getUserName();
        if (this$userName == null ? other$userName != null : !this$userName.equals(other$userName)) return false;
        Object this$vinylName = this.getVinylName();
        Object other$vinylName = other.getVinylName();
        if (this$vinylName == null ? other$vinylName != null : !this$vinylName.equals(other$vinylName)) return false;
        Object this$createdAt = this.getCreatedAt();
        Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        Object this$updatedAt = this.getUpdatedAt();
        Object other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !this$updatedAt.equals(other$updatedAt)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReviewResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + (this.isEdited() ? 79 : 97);
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $score = this.getScore();
        result = result * PRIME + ($score == null ? 43 : $score.hashCode());
        Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        Object $vinylId = this.getVinylId();
        result = result * PRIME + ($vinylId == null ? 43 : $vinylId.hashCode());
        Object $comment = this.getComment();
        result = result * PRIME + ($comment == null ? 43 : $comment.hashCode());
        Object $userName = this.getUserName();
        result = result * PRIME + ($userName == null ? 43 : $userName.hashCode());
        Object $vinylName = this.getVinylName();
        result = result * PRIME + ($vinylName == null ? 43 : $vinylName.hashCode());
        Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        Object $updatedAt = this.getUpdatedAt();
        result = result * PRIME + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "ReviewResponse(id=" + this.getId() + ", comment=" + this.getComment() + ", score=" + this.getScore() + ", userId=" + this.getUserId() + ", userName=" + this.getUserName() + ", vinylId=" + this.getVinylId() + ", vinylName=" + this.getVinylName() + ", createdAt=" + this.getCreatedAt() + ", updatedAt=" + this.getUpdatedAt() + ", edited=" + this.isEdited() + ")";
    }
}
