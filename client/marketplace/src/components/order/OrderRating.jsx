import { useState } from "react"

const OrderRating = ({ item, onRate }) => {

    const [score, setScore] = useState(0)
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')

    // Un vinilo ya reseñado no se puede volver a reseñar
    if (item.review) {
        return (
            <>
            <p>Tu reseña: {'★'.repeat(item.review.score)}{'☆'.repeat(5 - item.review.score)}</p>
            <p>{item.review.comment}</p>
            </>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (score < 1) {
            setError('Elegí un puntaje entre 1 y 5')
            return
        }
        if (comment.trim() === '') {
            setError('El comentario no puede estar vacío')
            return
        }
        onRate(item.vinylId, { score, comment: comment.trim() })
    }

    return (
        <form onSubmit={handleSubmit}>
            <p>Calificá este vinilo</p>
            {
                [1, 2, 3, 4, 5].map((value) => (
                    <button
                        type="button"
                        key={value}
                        aria-label={`${value} estrella(s)`}
                        onClick={() => setScore(value)}
                    >
                        {value <= score ? '★' : '☆'}
                    </button>
                ))
            }
            <br />
            <textarea
                name="comment"
                value={comment}
                maxLength={1000}
                onChange={(e) => setComment(e.target.value)}
            />
            <br />
            <button type="submit">Enviar reseña</button>
            {error && <p role="alert">{error}</p>}
        </form>
    )
}

export default OrderRating
