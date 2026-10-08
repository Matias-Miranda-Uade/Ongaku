const ArchiveQuote = ({ quote, author }) => (
  <blockquote className="archive-quote"><p>{quote}</p>{author && <cite>{author}</cite>}</blockquote>
)
export default ArchiveQuote
