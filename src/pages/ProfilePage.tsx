/**
 * ProfilePage — view and edit user profile and beauty preferences.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link } from "react-router-dom";
import { User, ShoppingBag, CreditCard, Heart } from "lucide-react";

const skinTypes = ["Normal", "Oily", "Dry", "Combination", "Sensitive"];
const hairTypes = ["Straight", "Wavy", "Curly", "Coily", "Fine", "Thick"];
const concernOptions = ["Acne", "Aging", "Dark Spots", "Dryness", "Oiliness", "Sensitivity", "Redness", "Pores", "Dullness", "Hydration", "Dandruff", "Damaged Hair", "Frizz"];

const ProfilePage = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [skinType, setSkinType] = useState("");
  const [hairType, setHairType] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [genderPref, setGenderPref] = useState("unisex");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
      setSkinType(profile.skin_type || "");
      setHairType(profile.hair_type || "");
      setConcerns(profile.beauty_concerns || []);
      setGenderPref(profile.gender_preference || "unisex");
    }
  }, [profile]);

  if (!loading && !user) return <Navigate to="/auth" />;

  const toggleConcern = (c: string) => {
    setConcerns((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        skin_type: skinType,
        hair_type: hairType,
        beauty_concerns: concerns,
        gender_preference: genderPref,
      })
      .eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
      await refreshProfile();
    }
    setSaving(false);
  };

  return (
    <main className="container py-8 max-w-2xl">
      <h1 className="mb-6 text-foreground">Your Profile</h1>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { to: "/favorites", icon: Heart, label: "Favorites" },
          { to: "/orders", icon: ShoppingBag, label: "Orders" },
          { to: "/payment-methods", icon: CreditCard, label: "Payment" },
          { to: "/cart", icon: ShoppingBag, label: "Cart" },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-soft transition-all hover:shadow-elevated active:scale-[0.98]"
          >
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fn">First Name</Label>
              <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-lg mt-1" />
            </div>
            <div>
              <Label htmlFor="ln">Last Name</Label>
              <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-lg mt-1" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled className="opacity-60 rounded-lg mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className="rounded-lg mt-1" />
          </div>
          <div>
            <Label>Shopping Preference</Label>
            <Select value={genderPref} onValueChange={setGenderPref}>
              <SelectTrigger className="rounded-lg mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unisex">All Products</SelectItem>
                <SelectItem value="female">Women's Products</SelectItem>
                <SelectItem value="male">Men's Products</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-2xl shadow-soft">
        <CardHeader>
          <CardTitle>Beauty Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Skin Type</Label>
              <Select value={skinType} onValueChange={setSkinType}>
                <SelectTrigger className="rounded-lg mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {skinTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hair Type</Label>
              <Select value={hairType} onValueChange={setHairType}>
                <SelectTrigger className="rounded-lg mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {hairTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Beauty Concerns</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {concernOptions.map((c) => (
                <Badge
                  key={c}
                  variant={concerns.includes(c) ? "default" : "outline"}
                  className="cursor-pointer transition-colors rounded-full px-3"
                  onClick={() => toggleConcern(c)}
                >
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full rounded-full h-11">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;
