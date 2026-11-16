package com.uade.tpo.marketplace.entity.dto;

/**
 * Edicion parcial de una reseña propia: se aplica solo lo que venga informado.
 */
public class ReviewUpdateRequest {
    private String comment;
    private Integer score;

    public ReviewUpdateRequest() {
    }

    public String getComment() {
        return this.comment;
    }

    public Integer getScore() {
        return this.score;
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
        if (!(o instanceof ReviewUpdateRequest)) return false;
        ReviewUpdateRequest other = (ReviewUpdateRequest) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$score = this.getScore();
        Object other$score = other.getScore();
        if (this$score == null ? other$score != null : !this$score.equals(other$score)) return false;
        Object this$comment = this.getComment();
        Object other$comment = other.getComment();
        if (this$comment == null ? other$comment != null : !this$comment.equals(other$comment)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReviewUpdateRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $score = this.getScore();
        result = result * PRIME + ($score == null ? 43 : $score.hashCode());
        Object $comment = this.getComment();
        result = result * PRIME + ($comment == null ? 43 : $comment.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "ReviewUpdateRequest(comment=" + this.getComment() + ", score=" + this.getScore() + ")";
    }
}
