import React, { useState, forwardRef } from "react";

const InputField = forwardRef(({
  label,
  id,
  type = "text",
  placeholder,
  register,
  errors = {}, // ✅ défaut vide
  icon,
  ...rest
}, ref) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const inputType = (type === "password" && isPasswordShown) ? "text" : type;

  // ✅ register optionnel
  const registerProps = register && id ? register(id, { required: `${label} is required` }) : {};

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>} {/* ✅ label optionnel */}
      <div className="input-wrapper">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className="input-field"
          ref={ref}
          {...registerProps}
          {...rest} // ✅ value + onChange passent ici
        />
        {icon && <i className="material-symbols-rounded">{icon}</i>}
        {type === "password" && (
          <i
            onClick={() => setIsPasswordShown(prev => !prev)}
            className="material-symbols-rounded eye-icon"
            style={{ cursor: "pointer" }}
          >
            {isPasswordShown ? "visibility" : "visibility_off"}
          </i>
        )}
      </div>
      {errors[id] && <span className="error">{errors[id].message}</span>}
    </div>
  );
});

export default InputField;