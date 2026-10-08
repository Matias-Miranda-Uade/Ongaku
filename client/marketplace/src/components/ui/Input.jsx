const Input = ({ label, id, name, type = 'text', ...props }) => (
  <div className="field">
    <label htmlFor={id || name}>{label}</label>
    <input id={id || name} name={name} type={type} {...props} />
  </div>
)
export default Input
