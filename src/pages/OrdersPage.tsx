/**
 * OrdersPage — purchase history and order details.
 * Includes Back to Profile navigation and polished empty state.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { BackToProfile } from "@/components/ui/BackToProfile";

/** Order item shape returned from the DB join */
interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  products: { name: string; brand: string; image_url: string } | null;
}

/** Order shape with nested items */
interface Order {
  id: string;
  total_amount: number;
  status: string;
  order_date: string;
  shipping_address: string | null;
  order_items: OrderItem[];
}

/** Status badge color map for visual clarity */
const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const OrdersPage = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  /* Fetch orders with nested order_items and product info */
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select(`
          id, total_amount, status, order_date, shipping_address,
          order_items (id, quantity, price_at_time, products:product_id (name, brand, image_url))
        `)
        .eq("user_id", user.id)
        .order("order_date", { ascending: false });
      setOrders((data as unknown as Order[]) || []);
      setLoadingOrders(false);
    };
    fetchOrders();
  }, [user]);

  if (!loading && !user) return <Navigate to="/auth" />;

  const totalSpent = orders.reduce((s, o) => s + Number(o.total_amount), 0);

  return (
    <main className="container py-8 max-w-3xl">
      <BackToProfile />
      <h1 className="mb-2 text-foreground">Order History</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        {orders.length} order{orders.length !== 1 && "s"} &middot; Total spent: ${totalSpent.toFixed(2)}
      </p>

      {loadingOrders ? (
        <p className="text-muted-foreground text-center py-12">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No orders yet. Start shopping to see your order history here.</p>
          <Link to="/search" className="text-primary font-medium hover:underline">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="rounded-2xl shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Order {order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <Badge className={`${statusColors[order.status] || ""} rounded-full`} variant="outline">
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.order_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.products?.image_url && (
                        <img src={item.products.image_url} alt={item.products.name || ""} className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.products?.name}</p>
                        <p className="text-xs text-muted-foreground">{item.products?.brand} &middot; Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">${(Number(item.price_at_time) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${Number(order.total_amount).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
