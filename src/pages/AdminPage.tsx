/**
 * AdminPage — Product Management / Reduced CRUD for class demonstration.
 * 
 * This page implements full CRUD (Create, Read, Update, Delete) operations
 * against the products table in the database. It demonstrates:
 * - Dynamic data display (products fetched from Supabase)
 * - Insert (adding new products)
 * - Update (editing existing products)
 * - Delete (removing products)
 * - Client-side validation before save
 * - Server-side validation via database CHECK constraints
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

/** Shape of a product row from the database */
interface DBProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  image_url: string | null;
  description: string | null;
  full_description: string | null;
  category: string;
  gender: string;
  skin_concerns: string[];
  ingredients: string[];
  benefits: string[];
  external_url: string | null;
  stock_quantity: number;
  is_featured: boolean;
}

/** Default empty product template for the "Add" form */
const emptyProduct: Omit<DBProduct, "id"> = {
  name: "", brand: "", price: 0, rating: 0, image_url: "",
  description: "", full_description: "", category: "skincare",
  gender: "unisex", skin_concerns: [], ingredients: [], benefits: [],
  external_url: "", stock_quantity: 100, is_featured: false,
};

const AdminPage = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<DBProduct> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  /**
   * Fetch all products from the database, ordered by most recent first.
   * This is the READ operation of CRUD — dynamically loads data from Supabase.
   */
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as DBProduct[]) || []);
  };

  /* Load products on component mount */
  useEffect(() => { fetchProducts(); }, []);

  /* Redirect to auth if user is not logged in */
  if (!loading && !user) return <Navigate to="/auth" />;

  /* Filter products by search query (name or brand) */
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Client-side validation — runs before any save operation.
   * These checks complement the database CHECK constraints:
   * - products_price_positive: price > 0
   * - products_stock_non_negative: stock_quantity >= 0
   * - products_rating_range: rating between 0 and 5
   * - products_name_not_empty: name must not be blank
   * - products_brand_not_empty: brand must not be blank
   */
  const validate = () => {
    if (!editingProduct?.name?.trim()) {
      toast({ title: "Name is required", description: "Product name cannot be empty.", variant: "destructive" });
      return false;
    }
    if (!editingProduct?.brand?.trim()) {
      toast({ title: "Brand is required", description: "Brand name cannot be empty.", variant: "destructive" });
      return false;
    }
    if ((editingProduct?.price ?? 0) <= 0) {
      toast({ title: "Invalid price", description: "Price must be greater than $0.", variant: "destructive" });
      return false;
    }
    if ((editingProduct?.rating ?? 0) < 0 || (editingProduct?.rating ?? 0) > 5) {
      toast({ title: "Invalid rating", description: "Rating must be between 0 and 5.", variant: "destructive" });
      return false;
    }
    if ((editingProduct?.stock_quantity ?? 0) < 0) {
      toast({ title: "Invalid stock", description: "Stock quantity cannot be negative.", variant: "destructive" });
      return false;
    }
    return true;
  };

  /**
   * Save handler — performs INSERT (create) or UPDATE (edit) based on isNew flag.
   * After successful save, refreshes the product list to show changes.
   */
  const handleSave = async () => {
    if (!validate() || !editingProduct) return;
    setSaving(true);

    /* Build the payload with trimmed/cleaned values */
    const payload = {
      name: editingProduct.name!.trim(),
      brand: editingProduct.brand!.trim(),
      price: editingProduct.price!,
      rating: Math.min(5, Math.max(0, editingProduct.rating || 0)),
      image_url: editingProduct.image_url || null,
      description: editingProduct.description || null,
      full_description: editingProduct.full_description || null,
      category: editingProduct.category || "skincare",
      gender: editingProduct.gender || "unisex",
      skin_concerns: editingProduct.skin_concerns || [],
      ingredients: editingProduct.ingredients || [],
      benefits: editingProduct.benefits || [],
      external_url: editingProduct.external_url || null,
      stock_quantity: Math.max(0, editingProduct.stock_quantity || 0),
      is_featured: editingProduct.is_featured || false,
    };

    if (isNew) {
      /* CREATE operation — insert a new product row */
      const { error } = await supabase.from("products").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Product created" });
    } else {
      /* UPDATE operation — modify an existing product */
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id!);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Product updated" });
    }
    setSaving(false);
    setEditingProduct(null);
    fetchProducts(); // Refresh the list
  };

  /**
   * DELETE operation — removes a product from the database.
   * Refreshes the product list after successful deletion.
   */
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Product deleted" }); fetchProducts(); }
  };

  return (
    <main className="container py-8">
      {/* Page header with back link and add button */}
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground">Product Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, or delete products in the catalog</p>
        </div>
        <Button onClick={() => { setEditingProduct({ ...emptyProduct }); setIsNew(true); }} className="gap-1.5 rounded-full">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Search filter for the product table */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="mb-5 max-w-sm rounded-full"
        aria-label="Search products in admin"
      />

      {/* Product data table — displays dynamic data from the database */}
      <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-3.5 font-medium">Product</th>
              <th className="text-left p-3.5 font-medium hidden sm:table-cell">Category</th>
              <th className="text-left p-3.5 font-medium">Price</th>
              <th className="text-left p-3.5 font-medium hidden md:table-cell">Stock</th>
              <th className="text-left p-3.5 font-medium hidden md:table-cell">Rating</th>
              <th className="text-right p-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    {p.image_url && <img src={p.image_url} alt="" className="h-9 w-9 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 capitalize hidden sm:table-cell">{p.category}</td>
                <td className="p-3.5">${Number(p.price).toFixed(2)}</td>
                <td className="p-3.5 hidden md:table-cell">{p.stock_quantity}</td>
                <td className="p-3.5 hidden md:table-cell">{Number(p.rating).toFixed(1)}</td>
                <td className="p-3.5 text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(p); setIsNew(false); }} aria-label={`Edit ${p.name}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive" aria-label={`Delete ${p.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground">No products found</p>}
      </div>

      {/* Edit/Add Product Dialog — form with validated fields */}
      <Dialog open={!!editingProduct} onOpenChange={(o) => !o && setEditingProduct(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add Product" : "Edit Product"}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              {/* Required fields: name and brand */}
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Name *</Label><Input value={editingProduct.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="rounded-lg mt-1" /></div>
                <div><Label>Brand *</Label><Input value={editingProduct.brand || ""} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })} className="rounded-lg mt-1" /></div>
              </div>
              {/* Numeric fields with validation constraints */}
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Price * ({">"} 0)</Label><Input type="number" step="0.01" min="0.01" value={editingProduct.price || ""} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} className="rounded-lg mt-1" /></div>
                <div><Label>Rating (0-5)</Label><Input type="number" step="0.1" min="0" max="5" value={editingProduct.rating || ""} onChange={(e) => setEditingProduct({ ...editingProduct, rating: parseFloat(e.target.value) || 0 })} className="rounded-lg mt-1" /></div>
                <div><Label>Stock (0+)</Label><Input type="number" min="0" value={editingProduct.stock_quantity || ""} onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) || 0 })} className="rounded-lg mt-1" /></div>
              </div>
              {/* Category and gender dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select value={editingProduct.category || "skincare"} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v })}>
                    <SelectTrigger className="rounded-lg mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["skincare", "makeup", "haircare", "fragrance", "bodycare", "tools"].map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={editingProduct.gender || "unisex"} onValueChange={(v) => setEditingProduct({ ...editingProduct, gender: v })}>
                    <SelectTrigger className="rounded-lg mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["unisex", "female", "male"].map((g) => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Text fields */}
              <div><Label>Image URL</Label><Input value={editingProduct.image_url || ""} onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })} className="rounded-lg mt-1" /></div>
              <div><Label>Description</Label><Textarea value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={2} className="rounded-lg mt-1" /></div>
              <div><Label>Full Description</Label><Textarea value={editingProduct.full_description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, full_description: e.target.value })} rows={3} className="rounded-lg mt-1" /></div>
              <div><Label>External URL</Label><Input value={editingProduct.external_url || ""} onChange={(e) => setEditingProduct({ ...editingProduct, external_url: e.target.value })} className="rounded-lg mt-1" /></div>
              {/* Array fields — comma-separated */}
              <div><Label>Skin Concerns (comma-separated)</Label><Input value={(editingProduct.skin_concerns || []).join(", ")} onChange={(e) => setEditingProduct({ ...editingProduct, skin_concerns: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="rounded-lg mt-1" /></div>
              <div><Label>Ingredients (comma-separated)</Label><Input value={(editingProduct.ingredients || []).join(", ")} onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="rounded-lg mt-1" /></div>
              <div><Label>Benefits (comma-separated)</Label><Input value={(editingProduct.benefits || []).join(", ")} onChange={(e) => setEditingProduct({ ...editingProduct, benefits: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="rounded-lg mt-1" /></div>
              <Button onClick={handleSave} disabled={saving} className="w-full rounded-full h-11">
                {saving ? "Saving..." : isNew ? "Create Product" : "Update Product"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminPage;
