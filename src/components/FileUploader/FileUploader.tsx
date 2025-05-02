import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { BackendApi } from "@/core/api/api";
import LoadingScreen from "@/layouts/Loading/LoadingScreen";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface FileUploaderProps {
  title: string;
  description: string;
  maxFiles?: number;
  maxFileSizeMB?: number;
  endpoint: string;
  method?: "get" | "post" | "put" | "patch" | "delete";
  additionalFormData?: Record<
    string,
    string | number | boolean | File | Record<string, number>
  >;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  showBackButton?: boolean;
  backPath?: string;
  buttonText?: string;
  accept?: string;
  customValidation?: (files: File[]) => string | null;
}

export default function FileUploader({
  title,
  description,
  maxFiles = 10,
  maxFileSizeMB = 20,
  endpoint,
  method = "post",
  additionalFormData = {},
  onSuccess,
  onError,
  showBackButton = false,
  backPath = "/",
  buttonText = "Confirmar",
  accept = "image/*",
  customValidation,
}: FileUploaderProps) {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all object URLs to prevent memory leaks
      previews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length === 0) return;

    // Convert FileList to Array
    const newFilesArray = Array.from(newFiles);

    // Check if adding new files would exceed the file limit
    if (files.length + newFilesArray.length > maxFiles) {
      toast.error(`No se pueden agregar más de ${maxFiles} imágenes`);
      return;
    }

    // Check if any file is larger than the max size
    const maxSizeBytes = maxFileSizeMB * 1000000;
    const oversizedFiles = newFilesArray.filter(
      (file) => file.size > maxSizeBytes
    );
    if (oversizedFiles.length > 0) {
      toast.error(`No se permiten ficheros de más de ${maxFileSizeMB} MB`);
      return;
    }

    // Run custom validation if provided
    if (customValidation) {
      const validationError = customValidation(newFilesArray);
      if (validationError) {
        toast.error(validationError);
        return;
      }
    }

    // Create preview URLs for new files
    const newPreviews = newFilesArray.map((file) => URL.createObjectURL(file));

    // Update files and previews arrays
    setFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    // Remove file and preview at the specified index
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => {
      // Revoke the URL of the removed preview
      URL.revokeObjectURL(prevPreviews[index]);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (files.length === 0) {
        throw new Error("No se ha seleccionado ningún archivo.");
      }

      const formData = new FormData();

      // Add files to FormData
      files.forEach((file) => {
        formData.append("img", file);
      });

      // Add additional form data
      Object.entries(additionalFormData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      setLoading(true);
      try {
        let response;
        switch (method) {
          case "get":
            response = await BackendApi.get(endpoint, {
              params: formData,
              headers: { "Content-Type": "multipart/form-data" },
            });
            break;
          case "post":
            response = await BackendApi.post(endpoint, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            break;
          case "put":
            response = await BackendApi.put(endpoint, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            break;
          case "patch":
            response = await BackendApi.patch(endpoint, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            break;
          case "delete":
            response = await BackendApi.delete(endpoint, {
              data: formData,
              headers: { "Content-Type": "multipart/form-data" },
            });
            break;
          default:
            response = await BackendApi.post(endpoint, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
        }
        setLoading(false);
        return response.data;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        toast.success("Archivos subidos con éxito");
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleSubmit = async () => {
    await uploadMutation.mutate();
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center px-4">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(backPath)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="space-y-4 px-4 md:px-0">
        <div
          className="border-2 border-dashed rounded-xl min-h-[400px] w-full flex flex-col items-center justify-center gap-4 p-6 text-center hover:bg-accent/30 transition-colors cursor-pointer relative"
          onClick={() => fileInputRef.current?.click()}
        >
          {previews.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <button
                    className="absolute top-2 left-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {previews.length < maxFiles && (
                <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                  <PlusCircle className="w-8 h-8 text-primary" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Agregar más
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <PlusCircle className="w-12 h-12 text-primary" />
              <div>
                <p className="font-medium">Haz clic para subir</p>
                <p className="text-sm text-muted-foreground">
                  {accept === "image/*" ? "PNG, JPG" : accept} (máx.{" "}
                  {maxFileSizeMB}MB)
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Puedes seleccionar hasta {maxFiles} archivos
                </p>
              </div>
            </>
          )}
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={files.length === 0}
        >
          {buttonText} {files.length > 0 ? `(${files.length} archivos)` : ""}
        </Button>
      </div>
    </div>
  );
}
