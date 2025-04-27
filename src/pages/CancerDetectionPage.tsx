import MainLayout from "@/layouts/MainLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CancerTypeTabs from "@/components/cancer-detection/CancerTypeTabs";

const CancerDetectionPage = () => {
  const MODEL_URL = import.meta.env.VITE_MODEL_URL;

  const cancerTypes = [
    {
      type: "oral",
      title: "Oral Cancer Detection",
      description:
        "Upload a clear image of your oral cavity for AI-powered assessment.",
      uploadInstructions:
        "Ensure good lighting, open your mouth wide, and center the camera on the area of concern.",
      riskFactors: [
        "Tobacco use of any kind",
        "Heavy alcohol consumption",
        "Excessive sun exposure to lips",
        "HPV infection",
        "Family history of cancer",
      ],
      preventions: [
        "Regular dental check-ups",
        "Avoid tobacco products",
        "Limit alcohol consumption",
        "Use lip balm with SPF protection",
        "Practice good oral hygiene",
      ],
    },
    {
      type: "skin",
      title: "Skin Cancer Detection",
      description:
        "Upload a clear image of the skin lesion or mole for AI-powered assessment.",
      uploadInstructions:
        "Take a well-lit, close-up photo of the skin lesion or mole without applying filters.",
      riskFactors: [
        "Excessive UV exposure",
        "History of sunburns",
        "Fair skin, light hair",
        "Family history of skin cancer",
        "Multiple or unusual moles",
      ],
      preventions: [
        "Apply sunscreen regularly",
        "Wear protective clothing",
        "Avoid tanning beds",
        "Regular skin self-exams",
        "Annual dermatology check-ups",
      ],
    },
    {
      type: "breast",
      title: "Breast Cancer Detection",
      description:
        "Upload a mammogram image for AI-powered preliminary assessment.",
      uploadInstructions:
        "Only upload mammogram images (DICOM, PNG, or JPEG). This tool cannot analyze regular photos.",
      riskFactors: [
        "Family history of breast cancer",
        "Age (risk increases with age)",
        "Genetics (BRCA1 and BRCA2 mutations)",
        "Dense breast tissue",
        "Early menstruation or late menopause",
      ],
      preventions: [
        "Regular mammograms",
        "Monthly self-exams",
        "Maintain healthy weight",
        "Limit alcohol consumption",
        "Regular physical activity",
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            Cancer Detection
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Upload images for AI-powered screening and early detection of cancer
          </p>

          <Alert className="mb-8 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Important</AlertTitle>
            <AlertDescription className="text-yellow-700">
              This tool provides preliminary screening only and is not a
              substitute for professional medical diagnosis. Consult a
              healthcare provider for accurate evaluation.
            </AlertDescription>
          </Alert>

          <CancerTypeTabs cancerTypes={cancerTypes} modelUrl={MODEL_URL} />
        </div>
      </div>
    </MainLayout>
  );
};

export default CancerDetectionPage;
