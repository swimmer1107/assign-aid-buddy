
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, Clock, CheckCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Mathematics Expert",
      experience: "10+ years",
      specialization: "Calculus, Algebra, Statistics"
    },
    {
      name: "Prof. Michael Chen",
      role: "Science Coordinator",
      experience: "8+ years", 
      specialization: "Physics, Chemistry, Biology"
    },
    {
      name: "Ms. Emily Davis",
      role: "Language Arts Specialist",
      experience: "12+ years",
      specialization: "English, Literature, Essays"
    },
    {
      name: "Mr. David Kumar",
      role: "Computer Science Lead",
      experience: "6+ years",
      specialization: "Programming, Data Structures"
    }
  ];

  const achievements = [
    { number: "5000+", label: "Assignments Completed" },
    { number: "2000+", label: "Happy Students" },
    { number: "50+", label: "Expert Writers" },
    { number: "98%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About AssignEase
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We are passionate about helping students achieve academic excellence through personalized assignment assistance and expert guidance.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At AssignEase, we believe every student deserves the support they need to succeed academically. Our mission is to provide high-quality, affordable assignment help that not only gets you better grades but also helps you learn and grow.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-3" />
                  <span>Passionate about student success</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-yellow-500 mr-3" />
                  <span>Committed to academic excellence</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-500 mr-3" />
                  <span>Building a supportive learning community</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {achievement.number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {achievement.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600">Qualified professionals dedicated to your success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Experience:</strong> {member.experience}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Specialization:</strong> {member.specialization}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We deliver on time, every time. Your deadlines are our priority, and we ensure consistent quality in every assignment.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every assignment goes through rigorous quality checks to ensure accuracy, originality, and academic standards.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We're here for you 24/7. Our support team is always ready to help with any questions or concerns you may have.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful students who trust AssignEase
          </p>
          <Link to="/order">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Get Assignment Help
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
