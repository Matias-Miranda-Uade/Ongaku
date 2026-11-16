const Checkbox = ({ label, id, name, ...props }) => (
  <div className="checkbox-field">
    <input id={id || name} name={name} type="checkbox" {...props} />
    <label htmlFor={id || name}>{label}</label>
  </div>
)
export default Checkbox
