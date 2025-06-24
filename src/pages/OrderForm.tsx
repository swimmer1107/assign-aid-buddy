import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Upload, Calculator, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "@/components/ProtectedRoute";
import PaymentGateway from "@/components/PaymentGateway";

interface SelectedPlan {
  id: string;
  name: string;
  pricePerPage: number;
  urgencyMultiplier: number;
  deliveryTime: string;
}

const OrderFormContent = () => {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan as SelectedPlan;
  
  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    assignmentType: "",
    title: "",
    description: "",
    pages: "",
    deadline: "",
    designPreference: "",
    specialInstructions: ""
  });
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (selectedPlan && formData.pages) {
      calculateEstimate();
    }
  }, [selectedPlan, formData.pages, formData.deadline]);

  const calculateEstimate = () => {
    const pages = parseInt(formData.pages) || 1;
    const basePrice = selectedPlan?.pricePerPage || 50;
    
    // Calculate urgency multiplier based on deadline
    let urgencyMultiplier = 1;
    if (formData.deadline) {
      const daysUntilDeadline = getDaysUntilDeadline();
      if (daysUntilDeadline <= 1) {
        urgencyMultiplier = 2;
      } else if (daysUntilDeadline <= 3) {
        urgencyMultiplier = 1.5;
      } else {
        urgencyMultiplier = selectedPlan?.urgencyMultiplier || 1;
      }
    } else {
      urgencyMultiplier = selectedPlan?.urgencyMultiplier || 1;
    }
    
    // Fix: Simple calculation without double multiplication
    const price = pages * basePrice * urgencyMultiplier;
    const timeInDays = selectedPlan?.deliveryTime || `${Math.max(1, Math.ceil(pages * 0.5))} day${Math.ceil(pages * 0.5) > 1 ? 's' : ''}`;
    
    setEstimatedPrice(Math.round(price));
    setEstimatedTime(timeInDays);
  };

  const getDaysUntilDeadline = () => {
    if (!formData.deadline) return 7;
    const deadline = new Date(formData.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    calculateEstimate(); // Ensure latest calculation
    setShowPaymentGateway(true);
  };

  const handlePayment = async (paymentData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit an order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Insert order into database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          subject: formData.subject,
          grade: formData.grade,
          assignment_type: formData.assignmentType,
          title: formData.title,
          description: formData.description,
          pages: parseInt(formData.pages),
          deadline: formData.deadline,
          design_preference: formData.designPreference,
          special_instructions: formData.specialInstructions,
          estimated_price: estimatedPrice,
          estimated_time: estimatedTime,
          payment_method_id: paymentData.paymentMethodId,
          payment_status: 'completed',
          transaction_id: paymentData.transactionId,
          payment_amount: paymentData.amount,
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Handle file uploads if any
      if (files && files.length > 0 && order) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `${user.id}/${order.id}/${file.name}`;
          
          // Upload file to storage
          const { error: uploadError } = await supabase.storage
            .from('order-files')
            .upload(fileName, file);

          if (uploadError) {
            console.error('File upload error:', uploadError);
          } else {
            // Save file reference in database
            await supabase
              .from('order_files')
              .insert({
                order_id: order.id,
                file_name: file.name,
                file_path: fileName,
                file_size: file.size,
                file_type: file.type,
              });
          }
        }
      }

      toast({
        title: "Payment Successful!",
        description: "Your order has been submitted and payment processed. We'll start working on your assignment!",
      });

      // Reset form
      setFormData({
        subject: "",
        grade: "",
        assignmentType: "",
        title: "",
        description: "",
        pages: "",
        deadline: "",
        designPreference: "",
        specialInstructions: ""
      });
      setFiles(null);
      setEstimatedPrice(0);
      setEstimatedTime("");
      setShowPaymentGateway(false);

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">AssignEase</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.first_name || user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Assignment Help</h2>
          <p className="text-xl text-gray-600">Tell us about your assignment and we'll provide you with a custom quote</p>
          {selectedPlan && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold text-blue-800">
                Selected Plan: {selectedPlan.name} (₹{selectedPlan.pricePerPage}/page)
              </p>
            </div>
          )}
        </div>

        {/* Payment Gateway Modal */}
        {showPaymentGateway && (
          <PaymentGateway
            totalAmount={estimatedPrice}
            onPaymentSuccess={handlePayment}
            onCancel={() => setShowPaymentGateway(false)}
            selectedPlan={selectedPlan}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
                <CardDescription>Please provide as much detail as possible for accurate pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select Subject</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="physics">Physics</option>
                        <option value="chemistry">Chemistry</option>
                        <option value="biology">Biology</option>
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="social-science">Social Science</option>
                        <option value="computer-science">Computer Science</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select Grade</option>
                        <option value="10">10th Grade</option>
                        <option value="12">12th Grade</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignmentType">Assignment Type</Label>
                      <select
                        id="assignmentType"
                        name="assignmentType"
                        value={formData.assignmentType}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="homework">Homework</option>
                        <option value="project">Project</option>
                        <option value="report">Report</option>
                        <option value="essay">Essay</option>
                        <option value="presentation">Presentation</option>
                        <option value="lab-report">Lab Report</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Number of Pages</Label>
                      <Input
                        id="pages"
                        name="pages"
                        type="number"
                        min="1"
                        placeholder="e.g., 5"
                        value={formData.pages}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter the assignment title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Assignment Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your assignment requirements in detail..."
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designPreference">Design Preference</Label>
                    <select
                      id="designPreference"
                      name="designPreference"
                      value={formData.designPreference}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select Design Style</option>
                      <option value="simple">Simple & Clean</option>
                      <option value="colorful">Colorful & Creative</option>
                      <option value="professional">Professional</option>
                      <option value="handwritten">Handwritten Style</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="files">Upload Reference Files (Optional)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="files" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG (MAX. 10MB)</p>
                        </div>
                        <input
                          id="files"
                          type="file"
                          multiple
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {files && files.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {files.length} file(s) selected
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      placeholder="Any special requirements or instructions..."
                      rows={3}
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Proceed to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Price Calculator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Price Calculator
                </CardTitle>
                <CardDescription>Get an instant estimate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={calculateEstimate} className="w-full" variant="outline">
                  Calculate Estimate
                </Button>
                
                {estimatedPrice > 0 && (
                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Selected Plan:</span>
                      <span className="font-bold text-blue-600">{selectedPlan?.name || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Price per Page:</span>
                      <span className="font-bold">₹{selectedPlan?.pricePerPage || 50}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Pages:</span>
                      <span className="font-bold">{formData.pages || 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estimated Price:</span>
                      <span className="font-bold text-blue-600">₹{estimatedPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Delivery Time:</span>
                      <span className="font-bold text-green-600">{estimatedTime}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      * Final price may vary based on complexity and requirements
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  <h4 className="font-semibold text-gray-900">What's Included:</h4>
                  <ul className="space-y-1">
                    <li>• Custom written content</li>
                    <li>• Professional formatting</li>
                    <li>• Plagiarism-free work</li>
                    <li>• Unlimited revisions</li>
                    <li>• On-time delivery</li>
                  </ul>
                </div>

                <div className="p-3 bg-green-50 rounded-lg text-sm">
                  <p className="font-semibold text-green-800">Need it urgent?</p>
                  <p className="text-green-700">We offer 24-hour delivery for urgent assignments (additional charges apply)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderForm = () => {
  return (
    <ProtectedRoute>
      <OrderFormContent />
    </ProtectedRoute>
  );
};

export default OrderForm;
