import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  FileText,
  Hospital,
  Stethoscope,
  X,
} from "lucide-react";

const HomePage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-teal-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Health, <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Advanced AI-powered medical assistant for accurate diagnostics
                and health analysis. Get instant insights and recommendations
                from our cutting-edge healthcare technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button variant="outline" className="px-6 py-2">
                    Talk to AI Doctor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img
                src="/lovable-uploads/chatbot.jpg"
                alt="AI Doctor Assistant"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our AI-Powered Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access advanced medical insights with our AI-powered tools
              designed to help you understand your health better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-medical-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Brain className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
                <p className="text-gray-600 mb-4">
                  Chat with our AI doctor for instant health guidance and
                  recommendations.
                </p>
                <Link
                  to="/chatbot"
                  className="text-primary font-medium flex items-center"
                >
                  Try Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-medical-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Stethoscope className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cancer Detection</h3>
                <p className="text-gray-600 mb-4">
                  Early detection tools for skin, oral, and breast cancer using
                  AI analysis.
                </p>
                <Link
                  to="/cancer-detection"
                  className="text-primary font-medium flex items-center"
                >
                  Try Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-medical-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Report Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Upload medical reports to get AI-powered analysis and
                  personalized insights.
                </p>
                <Link
                  to="/medical-reports"
                  className="text-primary font-medium flex items-center"
                >
                  Try Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-medical-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <X className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  X-Ray & MRI Analysis
                </h3>
                <p className="text-gray-600 mb-4">
                  AI-powered interpretation of X-rays and MRI scans with
                  detailed explanations.
                </p>
                <Link
                  to="/xray-mri"
                  className="text-primary font-medium flex items-center"
                >
                  Try Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hospital Finder Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-3xl font-bold mb-4">
                Find Hospitals Near You
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Locate healthcare facilities near you for immediate or planned
                medical care. Find specialists, check wait times, and book
                appointments.
              </p>
              <Link to="/hospitals">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2">
                  Find Hospitals
                  <Hospital className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img
                src="/lovable-uploads/chatbot2.jpg"
                alt="Hospital Finder"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to take control of your health?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of users who trust our AI Doctor Assistant for their
            health insights and medical guidance.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button
                variant="secondary"
                className="px-8 py-2 text-primary font-medium"
              >
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="px-8 py-2 border-white text-white"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
