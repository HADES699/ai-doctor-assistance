import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Brain, CircleX } from "lucide-react";
import { toast } from "sonner";

interface ResultsData {
  class_label: string;
  confidence: number;
}

const MODEL_URL = import.meta.env.VITE_MODEL_URL;
const XrayMriPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">X-Ray & MRI Analysis</h1>
          <p className="text-gray-600 mb-8">
            Upload your medical scans for AI-powered analysis and interpretation
          </p>

          <Tabs defaultValue="xray" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="xray">X-Ray Analysis</TabsTrigger>
              <TabsTrigger value="mri">MRI Analysis</TabsTrigger>
              <TabsTrigger value="ct">CT Scan Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="xray">
              <XrayAnalysisTab />
            </TabsContent>

            <TabsContent value="mri">
              <MriAnalysisTab />
            </TabsContent>

            <TabsContent value="ct">
              <CtAnalysisTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

const XrayAnalysisTab = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [results, setResults] = useState<ResultsData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !selectedType) return;

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("type", selectedType);
      console.log(formData);
      const response = await fetch(`${MODEL_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze the image.");
      }

      const data = await response.json();
      if (!data.class_label || typeof data.confidence !== "number") {
        throw new Error("Invalid response format from server.");
      }

      setResults({
        class_label: data?.class_label,
        confidence: data?.confidence,
      });
      toast.success("Analysis completed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const isCancer = results?.class_label !== "Normal";
  const confidencePercentage = (results?.confidence * 100).toFixed(2);
  const { level: riskLevel, color: riskColor } = getRiskLevel(
    results?.class_label,
    results?.confidence
  );
  const resultMessage = isCancer
    ? `The analysis indicates a potential presence of ${results?.class_label} with a confidence of ${confidencePercentage}%.`
    : `No concerning indicators detected (Normal) with a confidence of ${confidencePercentage}%.`;
  const recommendation = isCancer
    ? "Please consult a healthcare provider immediately for a professional evaluation."
    : "Regular medical check-ups are recommended to monitor your health.";
  const riskExplanation =
    riskLevel === "High"
      ? "This indicates a strong likelihood of concern, requiring urgent medical attention."
      : riskLevel === "Moderate"
      ? "This suggests some uncertainty; further evaluation is advised."
      : "This suggests a low likelihood of concern, but regular monitoring is still recommended.";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Upload an X-ray Image</h2>

          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="xray-type">X-ray Type</Label>
              <Select onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X-ray type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chest">Chest X-ray</SelectItem>
                  <SelectItem value="bone">Bone X-ray</SelectItem>
                  <SelectItem value="joint">Joint X-ray</SelectItem>
                  <SelectItem value="dental">Dental X-ray</SelectItem>
                  <SelectItem value="abdominal">Abdominal X-ray</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
            {previewUrl ? (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="X-ray Preview"
                  className="max-h-64 mx-auto"
                />
              </div>
            ) : (
              <div className="py-8 text-center">
                <CircleX className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-400 text-sm">
                  JPEG, PNG, JPG (max. 5MB)
                </p>
              </div>
            )}

            <div className="text-center mt-4">
              <input
                type="file"
                id="xray-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="xray-upload">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() =>
                    document.getElementById("xray-upload")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </label>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || !selectedType || analyzing}
                className="bg-primary hover:bg-primary/90"
              >
                {analyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              <strong>For best results:</strong> Ensure the X-ray is clearly
              visible and properly oriented. Upload the highest quality image
              available.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">X-ray Analysis Results</h2>

          {results ? (
            <div className="mb-6">
              <div
                className={`p-4 border rounded-lg ${
                  isCancer
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-green-50 border-green-200 text-green-800"
                }`}
              >
                <p className="font-semibold">{resultMessage}</p>
                <div className={`mt-2 p-2 rounded-md ${riskColor}`}>
                  <p className="font-medium">Risk Level: {riskLevel}</p>
                  <p className="text-sm">{riskExplanation}</p>
                </div>
                <p className="mt-2">{recommendation}</p>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                Get Professional Consultation
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <CircleX className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Upload and analyze an X-ray to see the assessment results
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MriAnalysisTab = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [results, setResults] = useState<ResultsData | null>(null);

  console.log(selectedType);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !selectedType) return;

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("type", selectedType);
      console.log(formData);
      const response = await fetch(`${MODEL_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze the image.");
      }

      const data = await response.json();
      if (!data.class_label || typeof data.confidence !== "number") {
        throw new Error("Invalid response format from server.");
      }

      setResults({
        class_label: data?.class_label,
        confidence: data?.confidence,
      });
      toast.success("Analysis completed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const isCancer = results?.class_label !== "Normal";
  const confidencePercentage = (results?.confidence * 100).toFixed(2);
  const { level: riskLevel, color: riskColor } = getRiskLevel(
    results?.class_label,
    results?.confidence
  );
  const resultMessage = isCancer
    ? `The analysis indicates a potential presence of ${results?.class_label} with a confidence of ${confidencePercentage}%.`
    : `No concerning indicators detected (Normal) with a confidence of ${confidencePercentage}%.`;
  const recommendation = isCancer
    ? "Please consult a healthcare provider immediately for a professional evaluation."
    : "Regular medical check-ups are recommended to monitor your health.";
  const riskExplanation =
    riskLevel === "High"
      ? "This indicates a strong likelihood of concern, requiring urgent medical attention."
      : riskLevel === "Moderate"
      ? "This suggests some uncertainty; further evaluation is advised."
      : "This suggests a low likelihood of concern, but regular monitoring is still recommended.";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Upload an MRI Scan</h2>

          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="mri-type">MRI Type</Label>
              <Select onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select MRI type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brain">Brain MRI</SelectItem>
                  <SelectItem value="spine">Spine MRI</SelectItem>
                  <SelectItem value="knee">Knee MRI</SelectItem>
                  <SelectItem value="shoulder">Shoulder MRI</SelectItem>
                  <SelectItem value="abdomen">Abdominal MRI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
            {previewUrl ? (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="MRI Preview"
                  className="max-h-64 mx-auto"
                />
              </div>
            ) : (
              <div className="py-8 text-center">
                <Brain className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-400 text-sm">
                  JPEG, PNG, JPG (max. 5MB)
                </p>
              </div>
            )}

            <div className="text-center mt-4">
              <input
                type="file"
                id="mri-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="mri-upload">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => document.getElementById("mri-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </label>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || !selectedType || analyzing}
                className="bg-primary hover:bg-primary/90"
              >
                {analyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              <strong>For best results:</strong> Upload a clear MRI image in
              DICOM format if possible, or a high-quality JPEG/PNG of the scan.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">MRI Analysis Results</h2>

          {results ? (
            <div className="mb-6">
              <div
                className={`p-4 border rounded-lg ${
                  isCancer
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-green-50 border-green-200 text-green-800"
                }`}
              >
                <p className="font-semibold">{resultMessage}</p>
                <div className={`mt-2 p-2 rounded-md ${riskColor}`}>
                  <p className="font-medium">Risk Level: {riskLevel}</p>
                  <p className="text-sm">{riskExplanation}</p>
                </div>
                <p className="mt-2">{recommendation}</p>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                Get Professional Consultation
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <Brain className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Upload and analyze an MRI to see the assessment results
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const getRiskLevel = (class_label: string, confidence: number) => {
  if (class_label === "Normal") {
    return {
      level: "Low",
      color: "bg-green-100 text-green-800 border-green-200",
    };
  } else {
    return confidence >= 0.8
      ? { level: "High", color: "bg-red-100 text-red-800 border-red-200" }
      : { level: "Low", color: "bg-green-100 text-green-800 border-green-200" };
  }
};

const CtAnalysisTab = () => {
  // Similar implementation as MRI tab with CT-specific content
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold">CT Scan Analysis Coming Soon</h2>
      <p className="text-gray-600 mt-2">
        We're currently enhancing our CT scan analysis capabilities. Please
        check back soon for this feature.
      </p>
    </div>
  );
};

export default XrayMriPage;
