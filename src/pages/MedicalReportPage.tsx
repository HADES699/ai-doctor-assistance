import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Pill, Microscope, FilePlus2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const MedicalReportPage = () => {
  const SERVER_URL = import.meta.env.VITE_OPENAI_SERVER_URL;
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        toast.error("You need to be logged in to analyze reports");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(`${SERVER_URL}/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error calling AI analysis: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysis(data.generatedText);
      toast.success("Report analyzed successfully");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file");
    } finally {
      setUploading(false);
    }
  };

  const reportTypes = [
    {
      title: "Blood Tests",
      description: "CBC, lipid panels, glucose levels, and more",
      icon: Microscope,
    },
    {
      title: "Medical Prescriptions",
      description: "Medication details, dosages, and usage instructions",
      icon: Pill,
    },
    {
      title: "Surgical Reports",
      description: "Pre-op, operative, and post-op reports",
      icon: FileText,
    },
    {
      title: "Other Lab Results",
      description: "Urine tests, thyroid panels, and more",
      icon: FilePlus2,
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Medical Report Analysis</h1>
          <p className="text-gray-600 mb-8">
            Upload your medical reports and get instant AI-powered insights and
            recommendations.
          </p>

          <div className="bg-white rounded-lg border shadow-sm p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">
                Drag and drop your medical report here
              </h2>
              <p className="text-gray-500 text-sm">
                Supports PDF, JPEG, and PNG files up to 5MB
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center mb-6 ${
                selectedFile ? "border-primary bg-blue-50" : "border-gray-300"
              }`}
            >
              {selectedFile ? (
                <>
                  <div className="bg-white p-3 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-primary font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    Click to upload or drag and drop
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="mr-4"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Browse Files
                </Button>
              </label>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || uploading}
                className="bg-primary hover:bg-primary/90"
              >
                {uploading ? "Analyzing..." : "Analyze Report"}
              </Button>
            </div>
          </div>

          {analysis && (
            <Card className="mb-12 border-primary">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  AI Analysis Results
                </h2>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-800">{analysis}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <h2 className="text-2xl font-bold mb-6 text-center">
            What We Can Analyze
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <type.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MedicalReportPage;
