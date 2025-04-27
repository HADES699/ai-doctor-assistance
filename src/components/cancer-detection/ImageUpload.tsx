import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import AnalysisResults from "./AnalysisResults";
import { useResults } from "@/context/ResultsContext";
interface ImageUploadProps {
  type: string;
  uploadInstructions: string;
  modelUrl: string;
  setError: Function;
}

const ImageUpload = ({
  type,
  uploadInstructions,
  modelUrl,
  setError,
}: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { results, setResults } = useResults();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  console.log(selectedFile);
  const allowedFileTypes =
    type === "breast"
      ? ["image/dicom", "image/png", "image/jpeg"]
      : ["image/png", "image/jpeg"];

  const handleFileChange = (file: File) => {
    if (!allowedFileTypes.includes(file.type)) {
      setError(
        type === "breast"
          ? "Please upload a valid mammogram image (DICOM, PNG, or JPEG)."
          : "Please upload a PNG or JPEG image."
      );
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setError(null);
    setSelectedFile(file);

    if (file.type !== "image/dicom") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove("border-blue-400", "bg-blue-50");

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add("border-blue-400", "bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove("border-blue-400", "bg-blue-50");
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !modelUrl) {
      setError("Please upload an image to analyze.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("type", type);
      console.log(formData);
      const response = await fetch(`${modelUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze the image.");
        setError(errorData);
      }

      const data = await response.json();
      if (!data.class_label || typeof data.confidence !== "number") {
        throw new Error("Invalid response format from server.");
      }

      const mappedLabel =
        type === "breast" && data.class_label === "Benign"
          ? "Normal"
          : type === "breast" && data.class_label === "Malignant"
          ? "Breast Cancer"
          : data.class_label;

      setResults({
        class_label: mappedLabel,
        confidence: data.confidence,
      });
      toast.success("Analysis completed successfully!");
    } catch (err: any) {
      setError(
        err.message || "Failed to analyze the image. Please try again later."
      );
      toast.error(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Upload an Image</h3>

      <div
        ref={dropZoneRef}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewUrl ? (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
          </div>
        ) : (
          <div className="py-8">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 mb-2">
              Drag and drop your photo here or click to browse
            </p>
          </div>
        )}

        <div className="mt-3 flex justify-center gap-3">
          <input
            type="file"
            id={`file-upload-${type}`}
            className="hidden"
            accept={allowedFileTypes.join(",")}
            onChange={handleInputChange}
            ref={fileInputRef}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>

          {selectedFile && (
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Image"
              )}
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        <strong className="font-semibold">For accurate results:</strong>{" "}
        {uploadInstructions}
      </p>
    </>
  );
};

export default ImageUpload;
