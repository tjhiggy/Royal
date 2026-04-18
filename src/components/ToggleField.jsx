export default function ToggleField({ label, name, checked, onChange, helper }) {
  return (
    <label className="toggle-field">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span className="toggle-copy">
        <strong>{label}</strong>
        {helper ? <small>{helper}</small> : null}
      </span>
    </label>
  )
}
