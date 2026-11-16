package com.uade.tpo.marketplace.entity.dto;

public class ReviewRequest {
    /**
     * Opcional: si viene, debe coincidir con el usuario autenticado.
     */
    private int userId;
    private int vinylId;
    private String comment;
    private Integer score;

    public ReviewRequest() {
    }

    /**
     * Opcional: si viene, debe coincidir con el usuario autenticado.
     */
    public int getUserId() {
        return this.userId;
    }

    public int getVinylId() {
        return this.vinylId;
    }

    public String getComment() {
        return this.comment;
    }

    public Integer getScore() {
        return this.score;
    }

    /**
     * Opcional: si viene, debe coincidir con el usuario autenticado.
     */
    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setVinylId(int vinylId) {
        this.vinylId = vinylId;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof ReviewRequest)) return false;
        ReviewRequest other = (ReviewRequest) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getUserId() != other.getUserId()) return false;
        if (this.getVinylId() != other.getVinylId()) return false;
        Object this$score = this.getScore();
        Object other$score = other.getScore();
        if (this$score == null ? other$score != null : !this$score.equals(other$score)) return false;
        Object this$comment = this.getComment();
        Object other$comment = other.getComment();
        if (this$comment == null ? other$comment != null : !this$comment.equals(other$comment)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReviewRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getUserId();
        result = result * PRIME + this.getVinylId();
        Object $score = this.getScore();
        result = result * PRIME + ($score == null ? 43 : $score.hashCode());
        Object $comment = this.getComment();
        result = result * PRIME + ($comment == null ? 43 : $comment.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "ReviewRequest(userId=" + this.getUserId() + ", vinylId=" + this.getVinylId() + ", comment=" + this.getComment() + ", score=" + this.getScore() + ")";
    }
}
