
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Users, Award, Shield, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PricingPlans from "@/components/PricingPlans";
import FloatingShapes from "@/components/FloatingShapes";

const Home = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Fast Delivery",
      description: "Get your assignments completed within 24-72 hours"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Expert Writers",
      description: "Qualified teachers and subject matter experts"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "100% Original",
      description: "Plagiarism-free content with reports included"
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: "Quality Assured",
      description: "High-quality work that meets your requirements"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      grade: "12th Grade",
      rating: 5,
      comment: "AssignEase helped me with my physics project. The work was excellent and delivered on time!"
    },
    {
      name: "Rahul Kumar",
      grade: "10th Grade", 
      rating: 5,
      comment: "Amazing service! Got my mathematics assignment done perfectly. Highly recommended!"
    },
    {
      name: "Sneha Patel",
      grade: "12th Grade",
      rating: 5,
      comment: "Professional work and great support. Will definitely use their services again."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <FloatingShapes />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Get Expert Help with Your 
              <span className="text-blue-600"> Assignments</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional assignment help for 10th and 12th grade students. Quality work, 
              affordable prices, and on-time delivery guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/order">
                <Button size="lg" className="text-lg px-8 py-4">
                  Order Now
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AssignEase?</h2>
            <p className="text-xl text-gray-600">We provide comprehensive support for your academic success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get your assignment done</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Submit Your Requirements",
                description: "Fill out our simple form with your assignment details, deadline, and any special instructions."
              },
              {
                step: "2", 
                title: "Choose Your Plan",
                description: "Select from our affordable pricing plans based on your urgency and requirements."
              },
              {
                step: "3",
                title: "Get Your Assignment",
                description: "Receive your completed assignment on time with unlimited revisions included."
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600">Real feedback from our satisfied students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.grade}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingPlans />

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who trust AssignEase for their academic success
          </p>
          <Link to="/order">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
