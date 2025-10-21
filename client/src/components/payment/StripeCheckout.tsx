import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';

interface StripeCheckoutProps {
  moduleId: string;
  moduleName: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripeCheckout({ moduleId, moduleName, amount, onSuccess, onCancel }: StripeCheckoutProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to make a payment',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          amount,
          currency: 'USD',
          status: 'completed',
          payment_method: 'card',
          transaction_id: transactionId,
          payment_data: {
            card_last4: cardDetails.cardNumber.slice(-4),
            card_brand: 'visa',
          },
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      const { error: accessError } = await supabase
        .from('user_module_access')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          payment_id: payment.id,
        });

      if (accessError) throw accessError;

      toast({
        title: 'Payment Successful',
        description: `You now have access to ${moduleName}`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred during payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Complete your purchase of {moduleName} for ${amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={cardDetails.cardNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, '');
                if (value.length <= 16 && /^\d*$/.test(value)) {
                  setCardDetails({ ...cardDetails, cardNumber: value });
                }
              }}
              required
            />
            <p className="text-xs text-muted-foreground">
              Test card: 4242 4242 4242 4242
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setCardDetails({ ...cardDetails, expiry: value });
                }}
                maxLength={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cardDetails.cvc}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setCardDetails({ ...cardDetails, cvc: value });
                  }
                }}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
