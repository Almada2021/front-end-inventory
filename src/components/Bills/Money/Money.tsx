import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  type?: "coin" | "bill";
  onClick?: () => void;
  className?: string;
}

export default function Money({
  src,
  alt,
  type = "coin",
  onClick,
  className,
}: Props) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      title={alt}
      onClick={() => {
        if (onClick) onClick();
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`active:scale-95 transition-transform ${className} ${
        isPressed ? "opacity-75" : "opacity-100"
      } select-none`}
      aria-label={`Seleccionar ${alt}`}
    >
      <img
        className={`w-full h-auto object-contain ${
          type === "bill"
            ? "max-h-[120px] md:max-h-[150px]"
            : "max-h-[80px] md:max-h-[100px]"
        }`}
        alt={alt}
        src={src}
        draggable="false"
      />
    </button>
  );
}
