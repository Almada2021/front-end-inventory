import { RefObject, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "@/components/Image/Image";
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
  const [hasChangedImage, setHasChangedImage] = useState<boolean>(false);

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
          setHasChangedImage(true);
        }}
      />
      {validation && (
        <p className="text-xs text-red-600">{validationMessage}</p>
      )}
      {imgUrl && previewImg == "" && !hasChangedImage && (
        <div
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="border-dotted border-primary border-2 min-h-[150px] flex justify-center items-center"
        >
          <Image
            className="w-full max-h-[150px] object-contain"
            src={imgUrl}
            alt={`Producto: ${alt}`}
            title={`Producto: ${alt}`}
          />
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
          <Image
            className="w-full max-h-[150px] object-contain"
            src={previewImg}
            alt={`Producto: ${alt}`}
            title={`Producto: ${alt}`}
          />
        </div>
      )}
      {previewImg == "" && hasChangedImage && (
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
      {previewImg == "" && !hasChangedImage && !imgUrl && (
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
