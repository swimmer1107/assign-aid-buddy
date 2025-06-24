
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Crown, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PricingPlan {
  id: string;
  name: string;
  pricePerPage: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  deliveryTime: string;
  urgencyMultiplier: number;
}

const PricingPlans = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      pricePerPage: 50,
      description: 'Perfect for simple assignments and homework',
      deliveryTime: '3-7 days',
      urgencyMultiplier: 1,
      icon: <CheckCircle className="h-8 w-8" />,
      features: [
        'Simple assignments',
        '3-7 days delivery',
        'Basic formatting',
        'Email support',
        'One revision included'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      pricePerPage: 75,
      originalPrice: 100,
      description: 'Most popular choice for complex assignments',
      deliveryTime: '1-3 days',
      urgencyMultiplier: 1.5,
      popular: true,
      icon: <Zap className="h-8 w-8" />,
      features: [
        'Complex assignments',
        '1-3 days delivery',
        'Professional formatting',
        'Priority support',
        'Unlimited revisions',
        'Plagiarism report',
        'Research sources included'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      pricePerPage: 100,
      description: 'For urgent and high-priority assignments',
      deliveryTime: '24 hours',
      urgencyMultiplier: 2,
      icon: <Crown className="h-8 w-8" />,
      features: [
        'Urgent assignments',
        '24 hours delivery',
        'Custom design & formatting',
        '24/7 priority support',
        'Unlimited revisions',
        'Detailed plagiarism report',
        'Expert consultation',
        'Progress updates'
      ]
    }
  ];

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to select a pricing plan.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setLoadingPlan(plan.id);

    try {
      // Navigate to order form with selected plan data
      navigate('/order', { 
        state: { 
          selectedPlan: {
            id: plan.id,
            name: plan.name,
            pricePerPage: plan.pricePerPage,
            urgencyMultiplier: plan.urgencyMultiplier,
            deliveryTime: plan.deliveryTime
          }
        } 
      });
      
      toast({
        title: "Plan Selected!",
        description: `You've selected the ${plan.name} plan. Please fill out the order details.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Star className="h-12 w-12 text-yellow-500" />
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">Choose Your Perfect Plan</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the ideal plan for your assignment needs with transparent pricing and guaranteed quality
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-3 border-blue-500 shadow-lg scale-105 bg-gradient-to-b from-blue-50 to-white' 
                  : 'border-2 border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                    ⭐ MOST POPULAR
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 pt-8">
                <div className={`flex justify-center mb-6 ${
                  plan.popular ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold text-gray-900">₹{plan.pricePerPage}</span>
                    {plan.originalPrice && (
                      <div className="flex flex-col">
                        <span className="text-xl text-gray-500 line-through">₹{plan.originalPrice}</span>
                        <span className="text-sm text-green-600 font-semibold">
                          {Math.round(((plan.originalPrice - plan.pricePerPage) / plan.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-600 text-lg">/page</span>
                </div>
                
                <CardDescription className="text-base text-gray-600 mb-4">
                  {plan.description}
                </CardDescription>
                
                <div className="flex justify-center">
                  <Badge 
                    variant="outline" 
                    className={`text-sm px-3 py-1 ${
                      plan.popular ? 'border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    🕒 {plan.deliveryTime} delivery
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full text-lg py-6 font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'bg-gray-800 hover:bg-gray-900 hover:shadow-lg'
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Get Started with ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Why Choose AssignEase?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h5 className="font-semibold text-gray-900">Quality Guaranteed</h5>
                <p className="text-sm text-gray-600">100% original content with unlimited revisions</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h5 className="font-semibold text-gray-900">Fast Delivery</h5>
                <p className="text-sm text-gray-600">On-time delivery with 24/7 support</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
                <h5 className="font-semibold text-gray-900">Expert Writers</h5>
                <p className="text-sm text-gray-600">Qualified professionals for every subject</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              All plans include free plagiarism checks and professional formatting. 
            </p>
            <p className="text-sm text-gray-500">
              Need a custom quote or have special requirements? 
              <Button variant="link" className="p-0 ml-1 text-blue-600 hover:text-blue-800" onClick={() => navigate('/contact')}>
                Contact our experts →
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
