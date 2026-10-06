const ArchiveQuote = ({ quote, author }) => (
  <blockquote><p>{quote}</p>{author && <cite>{author}</cite>}</blockquote>
)
export default ArchiveQuote
