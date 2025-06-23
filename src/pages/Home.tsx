
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { BookOpen, Clock, Users, Star, CheckCircle, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Expert Writers",
      description: "Our team of qualified writers specializes in various subjects and academic levels."
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "On-Time Delivery",
      description: "We guarantee timely delivery of all assignments, even with tight deadlines."
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Quality Assurance",
      description: "Every assignment undergoes thorough quality checks before delivery."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "24/7 Support",
      description: "Our customer support team is available round the clock to assist you."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      grade: "Grade 12",
      text: "AssignAid helped me improve my grades significantly. The quality of work is outstanding!",
      rating: 5
    },
    {
      name: "Mike Chen",
      grade: "Grade 10",
      text: "Fast delivery and excellent quality. I've been using their services for months now.",
      rating: 5
    },
    {
      name: "Emily Davis",
      grade: "Grade 12",
      text: "Professional writers who understand exactly what teachers are looking for.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Excel in Your Academic Journey with{' '}
            <span className="text-blue-600">AssignAid</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get professional help with your assignments from expert writers. 
            High-quality work, on-time delivery, and affordable prices for Grade 10 and 12 students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/order">
                  <Button size="lg" className="text-lg px-8 py-3">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Place Your Order
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                    View Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                    Explore Services
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose AssignAid?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Submit Your Order</h3>
              <p className="text-gray-600">
                Fill out our simple order form with your assignment details, deadline, and requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Assignment</h3>
              <p className="text-gray-600">
                We assign your work to a qualified writer who specializes in your subject area.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Your Work</h3>
              <p className="text-gray-600">
                Get your completed assignment on time, reviewed and ready for submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.grade}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Improve Your Grades?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have already improved their academic performance with AssignAid.
          </p>
          {user ? (
            <Link to="/order">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Your Order Now
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Sign Up Today
                <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-lg font-bold">AssignAid</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for academic excellence.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Essay Writing</li>
                <li>Research Papers</li>
                <li>Lab Reports</li>
                <li>Presentations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>24/7 Customer Service</li>
                <li>Live Chat</li>
                <li>Email Support</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@assignaid.com</li>
                <li>1-800-ASSIGN</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AssignAid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
