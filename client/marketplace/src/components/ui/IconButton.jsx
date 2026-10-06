import Button from './Button'

const IconButton = ({ label, children, ...props }) => (
  <Button aria-label={label} title={label} {...props}>{children}</Button>
)
export default IconButton
