import React, { useState, forwardRef } from "react";
import { toast } from "react-toastify";

const InputFieldd = forwardRef(
  ({ type, name, placeholder, icon, onChange, ...rest }, ref) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const handleChange = (e) => {
      const value = e.target.value;

      if (type === "password") {
        if (value.length < 6 || !/[A-Z]/.test(value)) {
          toast.warn(
            "Password must be at least 6 characters and include an uppercase letter."
          );
        }
      }
    };

    return (
      <div className="input-wrapper">
        <input
          type={isPasswordShown && type === "password" ? "text" : type}
          name={name}
          placeholder={placeholder}
          className="input-field"
          ref={ref}
          {...rest}
          onChange={(e) => {
            handleChange(e);
            rest.onChange?.(e);
          }}
        />

        <i className="material-symbols-rounded">{icon}</i>

        {type === "password" && (
          <i
            onClick={() => setIsPasswordShown((prev) => !prev)}
            className="material-symbols-rounded eye-icon"
            style={{ cursor: "pointer" }}
          >
            {isPasswordShown ? "visibility" : "visibility_off"}
          </i>
        )}
      </div>
    );
  }
);

export default InputFieldd;