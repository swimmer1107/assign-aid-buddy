
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Crown } from "lucide-react";
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
      icon: <CheckCircle className="h-6 w-6" />,
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
      icon: <Zap className="h-6 w-6" />,
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
      icon: <Crown className="h-6 w-6" />,
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
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h3>
          <p className="text-xl text-gray-600">Select the perfect plan for your assignment needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-lg transition-shadow ${
                plan.popular ? 'border-2 border-blue-500 scale-105' : 'border-2'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className={`flex justify-center mb-4 ${
                  plan.popular ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold">₹{plan.pricePerPage}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-gray-600">/page</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {plan.deliveryTime} delivery
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? 'Processing...' : `Select ${plan.name} Plan`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            All plans include free revisions and plagiarism checks. Need a custom quote? 
            <Button variant="link" className="p-0 ml-1" onClick={() => navigate('/contact')}>
              Contact us
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
