const Checkbox = ({ label, id, name, ...props }) => (
  <div>
    <input id={id || name} name={name} type="checkbox" {...props} />
    <label htmlFor={id || name}>{label}</label>
  </div>
)
export default Checkbox
