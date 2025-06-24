
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, Users, Award, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PricingPlans from "@/components/PricingPlans";

const Services = () => {
  const subjects = [
    { name: "Mathematics", description: "Algebra, Geometry, Calculus, Statistics" },
    { name: "Physics", description: "Mechanics, Thermodynamics, Optics, Electronics" },
    { name: "Chemistry", description: "Organic, Inorganic, Physical Chemistry" },
    { name: "Biology", description: "Botany, Zoology, Human Physiology" },
    { name: "English", description: "Literature, Grammar, Essay Writing" },
    { name: "Social Science", description: "History, Geography, Political Science" },
    { name: "Computer Science", description: "Programming, Data Structures, Algorithms" },
    { name: "Hindi", description: "Literature, Grammar, Composition" }
  ];

  const features = [
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Fast Turnaround",
      description: "Get your assignments completed within 24-72 hours depending on complexity"
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Expert Writers",
      description: "Our team consists of qualified teachers and subject matter experts"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Plagiarism Free",
      description: "100% original content with plagiarism reports provided"
    },
    {
      icon: <Award className="h-6 w-6 text-orange-600" />,
      title: "Quality Guaranteed",
      description: "High-quality work that meets your specific requirements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We provide comprehensive assignment help for 10th and 12th grade students across all subjects
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Services?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Subjects We Cover</h3>
            <p className="text-xl text-gray-600">Expert help available for all major subjects</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{subject.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assignment Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Types of Assignments</h3>
            <p className="text-xl text-gray-600">We handle all types of academic work</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Homework Assignments",
                description: "Daily homework problems and exercises",
                features: ["Step-by-step solutions", "Clear explanations", "Handwritten format available"]
              },
              {
                title: "Projects & Reports",
                description: "Comprehensive projects and detailed reports",
                features: ["Research-based content", "Professional formatting", "Charts and diagrams"]
              },
              {
                title: "Essays & Presentations",
                description: "Well-structured essays and engaging presentations",
                features: ["Creative design", "Proper citations", "Engaging content"]
              },
              {
                title: "Lab Reports",
                description: "Scientific lab reports with proper methodology",
                features: ["Data analysis", "Scientific format", "Accurate calculations"]
              },
              {
                title: "Case Studies",
                description: "In-depth analysis and case study reports",
                features: ["Critical analysis", "Real-world examples", "Professional insights"]
              },
              {
                title: "Custom Requests",
                description: "Special assignments tailored to your needs",
                features: ["Flexible approach", "Custom formatting", "Unique requirements"]
              }
            ].map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingPlans />

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Submit your assignment details and get a custom quote
          </p>
          <Link to="/order">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Order Assignment Help
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
