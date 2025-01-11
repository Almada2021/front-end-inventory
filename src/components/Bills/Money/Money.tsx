import { useState } from "react";

interface Props {
  src: string | undefined;
  alt: string;
  type?: "coin" | "bill";
  onClick?: () => void;
}
export default function Money({ src, alt, type = "coin", onClick }: Props) {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const turnPress = () => {
    setIsPressed(!isPressed);
  };
  if (!src) return null;
  return (
    <section
      title={alt}
      onTouchStart={turnPress}
      onTouchEnd={turnPress}
      onMouseUp={turnPress}
      onMouseDown={turnPress}
      className=" mx-2 my-2"
      onClick={onClick}
    >
      <div className="">
        <img
          className={`max-h-[68px] sm:max-h-[130px] md:max-h-[100px] ${
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
