/**
 * PaymentMethodsPage — CRUD for saved payment methods.
 * Includes Back to Profile navigation and client-side validation.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Trash2, Plus } from "lucide-react";
import { BackToProfile } from "@/components/ui/BackToProfile";

interface PaymentMethod {
  id: string;
  card_brand: string;
  cardholder_name: string;
  last4: string;
  expiration_date: string;
  billing_zip: string | null;
  is_default: boolean;
}

const PaymentMethodsPage = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [brand, setBrand] = useState("Visa");
  const [name, setName] = useState("");
  const [last4, setLast4] = useState("");
  const [expiry, setExpiry] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  /* Fetch saved payment methods for the logged-in user */
  const fetchMethods = async () => {
    if (!user) return;
    const { data } = await supabase.from("payment_methods").select("*").eq("user_id", user.id);
    setMethods((data as PaymentMethod[]) || []);
  };

  useEffect(() => { fetchMethods(); }, [user]);

  if (!loading && !user) return <Navigate to="/auth" />;

  /**
   * Client-side validation for payment method form.
   * Checks cardholder name, card digits format, and expiry format.
   */
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Cardholder name required";
    if (!/^\d{4}$/.test(last4)) errs.last4 = "Must be exactly 4 digits";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = "Format: MM/YY";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /** Insert a new payment method into the database */
  const handleAdd = async () => {
    if (!validate() || !user) return;
    setSaving(true);
    const { error } = await supabase.from("payment_methods").insert({
      user_id: user.id,
      card_brand: brand,
      cardholder_name: name.trim(),
      last4,
      expiration_date: expiry,
      billing_zip: zip.trim() || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Payment method added" });
      setShowForm(false);
      setBrand("Visa"); setName(""); setLast4(""); setExpiry(""); setZip("");
      fetchMethods();
    }
    setSaving(false);
  };

  /** Delete a payment method by ID */
  const handleDelete = async (id: string) => {
    await supabase.from("payment_methods").delete().eq("id", id);
    toast({ title: "Payment method removed" });
    fetchMethods();
  };

  return (
    <main className="container py-8 max-w-2xl">
      <BackToProfile />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-foreground">Payment Methods</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm" className="gap-1.5 rounded-full">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {/* Add payment method form */}
      {showForm && (
        <Card className="mb-6 rounded-2xl shadow-soft">
          <CardHeader><CardTitle className="text-base">Add Payment Method</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Card Brand</Label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="rounded-lg mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Visa", "Mastercard", "Amex", "Discover"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pm-name">Cardholder Name</Label>
              <Input id="pm-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="rounded-lg mt-1" />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="pm-last4">Last 4 Digits</Label>
                <Input id="pm-last4" value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="1234" maxLength={4} className="rounded-lg mt-1" />
                {errors.last4 && <p className="text-sm text-destructive mt-1">{errors.last4}</p>}
              </div>
              <div>
                <Label htmlFor="pm-expiry">Expiry</Label>
                <Input id="pm-expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} className="rounded-lg mt-1" />
                {errors.expiry && <p className="text-sm text-destructive mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <Label htmlFor="pm-zip">Billing ZIP</Label>
                <Input id="pm-zip" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="12345" className="rounded-lg mt-1" />
              </div>
            </div>
            <Button onClick={handleAdd} disabled={saving} className="rounded-full">{saving ? "Saving..." : "Save Card"}</Button>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {methods.length === 0 && !showForm ? (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">No payment methods saved yet.</p>
          <p className="text-sm text-muted-foreground">Add a card to make checkout faster.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
              <CreditCard className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{m.card_brand} **** {m.last4}</p>
                <p className="text-sm text-muted-foreground">{m.cardholder_name} &middot; Exp: {m.expiration_date}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-destructive" aria-label={`Delete card ending in ${m.last4}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default PaymentMethodsPage;
