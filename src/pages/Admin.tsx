
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  title: string;
  subject: string;
  assignment_type: string;
  status: string;
  estimated_price: number;
  estimated_time: string;
  deadline: string;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Admin = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ status: string; price: string; time: string }>({
    status: '',
    price: '',
    time: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!inner(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: editData.status,
          estimated_price: editData.price ? parseFloat(editData.price) : null,
          estimated_time: editData.time || null
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully"
      });

      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      });
    }
  };

  const startEditing = (order: Order) => {
    setEditingOrder(order.id);
    setEditData({
      status: order.status,
      price: order.estimated_price?.toString() || '',
      time: order.estimated_time || ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage orders and customer requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'in_progress').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              Review and manage customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.profiles.first_name} {order.profiles.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{order.profiles.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.title}</div>
                        <div className="text-sm text-gray-500">
                          {order.subject} - {order.assignment_type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingOrder === order.id ? (
                        <Select value={editData.status} onValueChange={(value) => setEditData({...editData, status: value})}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrder === order.id ? (
                        <Input
                          value={editData.price}
                          onChange={(e) => setEditData({...editData, price: e.target.value})}
                          placeholder="Price"
                          className="w-20"
                        />
                      ) : (
                        order.estimated_price ? `$${order.estimated_price}` : 'TBD'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrder === order.id ? (
                        <Input
                          value={editData.time}
                          onChange={(e) => setEditData({...editData, time: e.target.value})}
                          placeholder="Time"
                          className="w-24"
                        />
                      ) : (
                        order.estimated_time || 'TBD'
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.deadline), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingOrder === order.id ? (
                          <>
                            <Button size="sm" onClick={() => updateOrder(order.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingOrder(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => startEditing(order)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
