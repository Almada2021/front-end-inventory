import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "@/components/Image/Image";
import { Plus, X } from "lucide-react";

interface Props {
  maxImages?: number;
  onChange?: (files: File[]) => void;
  validation?: boolean;
  validationMessage?: string;
}

export default function MultiImgUploader({
  maxImages = 10,
  onChange,
  validation = false,
  validationMessage = "",
}: Props) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    // Convert FileList to Array and filter out any null values
    const newFiles = Array.from(selectedFiles).filter(Boolean);

    // Limit the number of files to maxImages
    const filesToAdd = newFiles.slice(0, maxImages - files.length);

    if (filesToAdd.length === 0) return;

    // Create preview URLs for the new files
    const newPreviewUrls = filesToAdd.map((file) => URL.createObjectURL(file));

    // Update state
    setFiles((prev) => [...prev, ...filesToAdd]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // Notify parent component
    if (onChange) {
      onChange([...files, ...filesToAdd]);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    // Remove the file and preview URL
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // Notify parent component
    if (onChange) {
      onChange(files.filter((_, i) => i !== index));
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <Label htmlFor="images" className="invisible h-[0.1px]">
        Imágenes
      </Label>
      <Input
        className="invisible h-[0.1px]"
        id="images"
        ref={fileInputRef}
        type="file"
        accept="image/png, image/gif, image/jpeg"
        multiple
        onChange={handleFileChange}
      />

      {validation && (
        <p className="text-xs text-red-600">{validationMessage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Image previews */}
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-md overflow-hidden"
          >
            <div className="aspect-square relative">
              <Image
                className="w-full h-full object-cover"
                src={url}
                alt={`Preview ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Add more button */}
        {files.length < maxImages && (
          <div
            className="border-dashed border-2 border-gray-300 rounded-md flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-primary"
            onClick={openFileDialog}
          >
            <Plus size={24} className="text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Agregar imagen</p>
          </div>
        )}
      </div>
    </div>
  );
}
