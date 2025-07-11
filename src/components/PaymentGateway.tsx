
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, QrCode, Smartphone } from "lucide-react";

interface PaymentGatewayProps {
  totalAmount: number;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
  selectedPlan: any;
  formData: any;
  isSubmitting: boolean;
}

interface PaymentMethod {
  id: string;
  method_name: string;
  method_type: string;
}

const PaymentGateway = ({ 
  totalAmount, 
  onPaymentSuccess, 
  onCancel, 
  selectedPlan, 
  formData,
  isSubmitting 
}: PaymentGatewayProps) => {
  // Hardcoded payment methods until database types are updated
  const paymentMethods: PaymentMethod[] = [
    { id: '1', method_name: 'UPI QR Code', method_type: 'qr' },
    { id: '2', method_name: 'PhonePe', method_type: 'upi' },
    { id: '3', method_name: 'Google Pay', method_type: 'upi' },
    { id: '4', method_name: 'Paytm', method_type: 'upi' },
    { id: '5', method_name: 'Credit/Debit Card', method_type: 'card' },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("1"); // Default to UPI QR
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: ""
  });

  const handlePayment = async () => {
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    if (!selectedMethod) return;

    const paymentData = {
      amount: totalAmount,
      paymentMethodId: selectedPaymentMethod,
      paymentMethod: selectedMethod.method_name,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cardDetails: selectedMethod.method_type === 'card' ? cardDetails : null
    };

    await onPaymentSuccess(paymentData);
  };

  const getPaymentMethodIcon = (methodType: string) => {
    switch (methodType) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'qr':
        return <QrCode className="h-5 w-5" />;
      case 'upi':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedPaymentMethod);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Gateway
          </CardTitle>
          <CardDescription>Complete your payment to submit the order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">Plan:</span>
              <span>{selectedPlan?.name || 'Standard'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Pages:</span>
              <span>{formData.pages}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-blue-600">₹{totalAmount}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Payment Method</Label>
            <RadioGroup 
              value={selectedPaymentMethod} 
              onValueChange={setSelectedPaymentMethod}
              className="space-y-2"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                    <div className="text-blue-600">
                      {getPaymentMethodIcon(method.method_type)}
                    </div>
                    <span className="font-medium">{method.method_name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedMethodData?.method_type === 'card' && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Card Details</h4>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input 
                  id="cardName" 
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                />
              </div>
            </div>
          )}

          {selectedMethodData?.method_type === 'qr' && (
            <div className="space-y-3 text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Scan QR Code</h4>
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-green-300">
                <QrCode className="h-32 w-32 mx-auto text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Scan QR code with your UPI app</p>
                <p className="text-lg font-bold text-green-700 mt-2">Amount: ₹{totalAmount}</p>
              </div>
              <p className="text-sm text-gray-600">
                Scan the QR code above with any UPI app like Google Pay, PhonePe, or Paytm
              </p>
            </div>
          )}

          {selectedMethodData?.method_type === 'upi' && selectedMethodData?.method_name !== 'UPI QR Code' && (
            <div className="space-y-3 text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Pay with {selectedMethodData.method_name}</h4>
              <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
                <Smartphone className="h-16 w-16 mx-auto text-blue-600 mb-2" />
                <p className="font-medium text-lg">Pay with {selectedMethodData.method_name}</p>
                <p className="text-2xl font-bold text-blue-700 mt-2">₹{totalAmount}</p>
              </div>
              <p className="text-sm text-gray-600">
                You will be redirected to {selectedMethodData.method_name} to complete the payment
              </p>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handlePayment} 
              className="flex-1 bg-green-600 hover:bg-green-700" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay ₹${totalAmount}`
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGateway;
