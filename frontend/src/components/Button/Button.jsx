import React, { useState, useEffect } from "react";
import "./button.css"; // Import the CSS for ripple effect

const CustomButton = ({
  children,
  icon: Icon,
  color = "customButton",
  outline = false,
  fullWidth = false,
  rounded = "lg",
  type = "button",
  onClick,
  style, // Conditionally apply style
}) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => setRipples([]), 600); // Adjusted for the animation duration
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const handleRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    setRipples((prevRipples) => [...prevRipples, { x, y, size }]);
  };

  const buttonClass = `
    relative inline-flex items-center justify-center py-2 px-4 mb-6 mt-3
    ${fullWidth ? "w-full" : "w-auto"}
    ${
      outline
        ? `border border-${color} text-${color} bg-transparent`
        : `bg-customButton text-white`
    }
    ${rounded === "lg" ? "rounded-lg" : "rounded"}
    ${outline ? "hover:bg-transparent" : `hover:bg-orange-900`}
    focus:outline-none overflow-hidden
    transition-colors duration-300
    relative
  `;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={(event) => {
        handleRipple(event);
        if (onClick) onClick(event);
      }}
      style={style} // Conditionally apply style
    >
      {Icon && <Icon />} {/* Render Icon component */}
      {children}
      {ripples.map((ripple, index) => (
        <span
          key={index}
          className={outline ? "ripple outline" : "ripple"}
          style={{
            width: ripple.size,
            height: ripple.size,
            top: ripple.y,
            left: ripple.x,
          }}
        />
      ))}
    </button>
  );
};

export default CustomButton;
