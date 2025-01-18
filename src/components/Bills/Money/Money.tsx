import { useState } from "react";

interface Props {
  src: string | undefined;
  alt: string;
  type?: "coin" | "bill";
  onClick?: () => void;
}
export default function Money({ src, alt, type = "coin", onClick }: Props) {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const handleStart = () => {
    setIsPressed(true);
  };

  const handleEnd = () => {
    setIsPressed(false);
  };

  if (!src) return null;
  return (
    <section
      title={alt}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onDragEnd={handleEnd}
      className=" mx-2 my-2 select-none "
      onClick={onClick}
    >
      <div className="">
        <img
          className={`max-h-[68px] sm:max-h-[130px] md:max-h-[100px] select-none ${
            isPressed ? "opacity-50" : " opacity-100"
          } 
          ${type == "bill" ? "w-full px-10" : ""}
          `}
          alt={alt}
          src={src}
        ></img>
      </div>
    </section>
  );
}
