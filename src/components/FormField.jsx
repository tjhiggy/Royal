export default function FormField({
  label,
  type = 'number',
  name,
  value,
  onChange,
  step = 'any',
  min,
  placeholder,
  helper,
  inputMode,
  fullWidth = false,
}) {
  return (
    <label className={`field ${fullWidth ? 'field-full' : ''}`}>
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        step={step}
        min={min}
        placeholder={placeholder}
        inputMode={inputMode}
      />
      {helper ? <small className="field-helper">{helper}</small> : null}
    </label>
  )
}
