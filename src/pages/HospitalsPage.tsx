
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Star, ExternalLink, Navigation, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  waitTime: string;
  distance: string;
  rating: number;
  reviews: number;
  specialties: string[];
  description: string;
}

const HospitalsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("all");

  const hospitals: Hospital[] = [
    {
      id: 1,
      name: "Bayside Medical Center",
      address: "456 Healthcare Ave, San Francisco, CA 94117",
      phone: "(415) 555-1234",
      hours: "Open 24 hours",
      waitTime: "~20 minutes",
      distance: "1.7 miles",
      rating: 4,
      reviews: 743,
      specialties: ["General Practice", "Emergency", "Pediatric", "Cardiology"],
      description: "A modern medical facility with state-of-the-art equipment and a focus on patient-centered care. Known for excellent pediatric services."
    },
    {
      id: 2,
      name: "Golden Gate Medical Group",
      address: "321 Healing Way, San Francisco, CA 94109",
      phone: "(415) 555-6765",
      hours: "Mon-Fri: 7am-7pm, Sat-Sun: 8am-2pm",
      waitTime: "~10 minutes",
      distance: "0.9 miles",
      rating: 4,
      reviews: 529,
      specialties: ["General Practice", "Orthopedic", "Neurology"],
      description: "A modern medical facility with state-of-the-art equipment and a focus on patient-centered care. Known for excellent pediatric services."
    },
    {
      id: 3,
      name: "Pacific Heights Specialty Center",
      address: "555 Specialist Square, San Francisco, CA 94115",
      phone: "(415) 555-9876",
      hours: "Mon-Fri: 8am-6pm, Sat-Sun: Closed",
      waitTime: "By appointment",
      distance: "1.5 miles",
      rating: 5,
      reviews: 412,
      specialties: ["Cardiology", "Neurology", "Dermatology"],
      description: "A modern medical facility with state-of-the-art equipment and a focus on patient-centered care. Known for excellent pediatric services."
    },
    {
      id: 4,
      name: "Marina Urgent Care",
      address: "888 Urgent Plaza, San Francisco, CA 94123",
      phone: "(415) 555-2345",
      hours: "Daily: 8am-10pm",
      waitTime: "~25 minutes",
      distance: "2.1 miles",
      rating: 4,
      reviews: 298,
      specialties: ["General Practice", "Emergency"],
      description: "A modern medical facility with state-of-the-art equipment and a focus on patient-centered care. Known for excellent pediatric services."
    }
  ];

  const specialties = [
    "All Specialties",
    "General Practice",
    "Emergency",
    "Pediatric",
    "Cardiology", 
    "Neurology",
    "Orthopedic",
    "Dermatology"
  ];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialty = 
      activeSpecialty === "all" || 
      hospital.specialties.some(s => s.toLowerCase() === activeSpecialty.toLowerCase());
      
    return matchesSearch && matchesSpecialty;
  });

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Nearby Hospitals & Clinics</h1>
          <p className="text-gray-600 mb-8">
            Find healthcare facilities near you for immediate or planned medical care
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Find Healthcare Facilities</h2>
              <p className="text-gray-600 mb-4">
                Locate hospitals, clinics, and specialists near you
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by name or location" 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  Search
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {specialties.map((specialty, index) => (
                  <Badge 
                    key={index}
                    variant={activeSpecialty === (index === 0 ? "all" : specialty.toLowerCase()) ? "default" : "outline"}
                    onClick={() => setActiveSpecialty(index === 0 ? "all" : specialty.toLowerCase())}
                    className="cursor-pointer"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {filteredHospitals.map((hospital) => (
              <Card key={hospital.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{hospital.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {hospital.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right mt-2 md:mt-0">
                        <span className="text-sm text-gray-500">Distance: {hospital.distance}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Phone className="h-4 w-4 text-gray-500 mt-1" />
                        <span>{hospital.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 text-gray-500 mt-1" />
                        <span>{hospital.hours}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 text-gray-500 mt-1" />
                        <span>Wait time: {hospital.waitTime}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{hospital.description}</p>
                    
                    <div className="flex items-center mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < hospital.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-gray-600 ml-2">({hospital.reviews})</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </Button>
                      <Button size="sm" className="flex items-center bg-primary hover:bg-primary/90">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredHospitals.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold">No results found</h3>
                <p className="text-gray-600 mt-2">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HospitalsPage;
