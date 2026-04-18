export default function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  helper,
  fullWidth = false,
}) {
  return (
    <label className={`field ${fullWidth ? 'field-full' : ''}`}>
      <span className="field-label">{label}</span>
      <textarea
        className="field-input field-textarea"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {helper ? <small className="field-helper">{helper}</small> : null}
    </label>
  )
}
