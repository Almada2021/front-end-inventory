import { RefObject, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
interface Props {
  validation: boolean;
  validationMessage: string;
  fileInputRef: RefObject<HTMLInputElement>;
  alt: string;
  imgUrl?: string;
  setFieldValue: (key: string, file: File | null) => void;
}
export default function ImgUploader({
  validation,
  validationMessage,
  fileInputRef,
  alt = "",
  imgUrl,
  setFieldValue,
}: Props) {
  const [previewImg, setPreviewImg] = useState<string>("");

  return (
    <div className="grid ">
      <Label htmlFor="image" className="invisible h-[0.1px]">
        Imagen del Producto
      </Label>
      <Input
        className="invisible h-[0.1px]"
        id="image"
        ref={fileInputRef}
        type="file"
        accept="image/png, image/gif, image/jpeg"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          setPreviewImg(URL.createObjectURL(file!));
          setFieldValue("image", file || null);
        }}
      />
      {validation && (
        <p className="text-xs text-red-600">{validationMessage}</p>
      )}
      {imgUrl && previewImg == "" && (
        <div
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="border-dotted border-primary border-2 min-h-[150px] flex justify-center items-center"
        >
          <img
            className="w-full max-h-[150px] object-contain"
            src={imgUrl}
            alt={`Producto: ${alt}`}
            title={`Producto: ${alt}`}
          ></img>
        </div>
      )}
      {previewImg != "" && (
        <div
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="border-dotted border-primary border-2 min-h-[150px] flex justify-center items-center"
        >
          <img
            className="w-full max-h-[150px] object-contain"
            src={previewImg}
            alt={`Producto: ${alt}`}
            title={`Producto: ${alt}`}
          ></img>
        </div>
      )}
      {previewImg == "" && (
        <div
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="border-dotted border-primary border-2 min-h-[150px] flex justify-center items-center"
        >
          <h3 className="text-primary font-bold text-center">
            Click Para Elegir la foto del producto
          </h3>
        </div>
      )}
    </div>
  );
}
