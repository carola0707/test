/**
 * CheckoutPage — review cart, select payment, place order.
 */
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  card_brand: string;
  last4: string;
  cardholder_name: string;
}

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      supabase.from("payment_methods").select("id, card_brand, last4, cardholder_name")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (data) setPaymentMethods(data);
        });
    }
  }, [user]);

  if (!user) return <Navigate to="/auth" />;
  if (items.length === 0) return <Navigate to="/cart" />;

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!shippingAddress.trim()) errs.address = "Shipping address is required";
    if (!selectedPayment) errs.payment = "Please select a payment method";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          payment_method_id: selectedPayment,
          total_amount: total,
          shipping_address: shippingAddress.trim(),
          status: "pending",
        })
        .select("id")
        .single();

      if (orderErr || !order) throw new Error(orderErr?.message || "Failed to create order");

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        quantity: i.quantity,
        price_at_time: i.product.price,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw new Error(itemsErr.message);

      clearCart();
      toast({ title: "Order placed!", description: `Order total: $${total.toFixed(2)}` });
      navigate("/orders");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container py-8 max-w-2xl">
      <h1 className="mb-6 text-foreground">Checkout</h1>

      <Card className="mb-6 rounded-2xl shadow-soft">
        <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
        <CardContent>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between py-2.5 border-b last:border-0">
              <span className="text-sm">{product.name} x {quantity}</span>
              <span className="text-sm font-medium">${(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 rounded-2xl shadow-soft">
        <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
        <CardContent>
          <Label htmlFor="address">Full Address</Label>
          <Input id="address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="123 Main St, City, State 12345" className="rounded-lg mt-1" />
          {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
        </CardContent>
      </Card>

      <Card className="mb-6 rounded-2xl shadow-soft">
        <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment methods saved. <a href="/payment-methods" className="text-primary hover:underline">Add one first</a></p>
          ) : (
            <Select value={selectedPayment} onValueChange={setSelectedPayment}>
              <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select payment method" /></SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.id} value={pm.id}>
                    {pm.card_brand} **** {pm.last4} — {pm.cardholder_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.payment && <p className="text-sm text-destructive mt-1">{errors.payment}</p>}
        </CardContent>
      </Card>

      <Button onClick={handlePlaceOrder} disabled={submitting} className="w-full rounded-full h-12 text-base" size="lg">
        {submitting ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}
      </Button>
    </main>
  );
};

export default CheckoutPage;
