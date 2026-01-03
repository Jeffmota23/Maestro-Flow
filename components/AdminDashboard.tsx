
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircle, Clock, FileUp, Filter, Users, LayoutDashboard, DollarSign, FileText, ArrowLeft } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');

  useEffect(() => {
    // Load simulated data
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        userId: 'u1',
        userEmail: 'maestro.john@orchestra.com',
        // Added missing currency property to OrderItem
        items: [{ serviceId: 'full-orch', serviceName: 'Full Orchestration', price: 350, currency: '$' }],
        status: OrderStatus.IN_PROGRESS,
        createdAt: '2023-10-25'
      },
      {
        id: 'ORD-002',
        userId: 'u2',
        userEmail: 'sarah.piano@gmail.com',
        // Added missing currency property to OrderItem
        items: [{ serviceId: 'lead-sheet', serviceName: 'Lead Sheet', price: 45, currency: '$' }],
        status: OrderStatus.PENDING,
        createdAt: '2023-10-26'
      },
      {
        id: 'ORD-003',
        userId: 'u3',
        userEmail: 'bob.jazz@me.com',
        // Added missing currency property to OrderItem
        items: [{ serviceId: 'musescore-engraving', serviceName: 'MuseScore Engraving', price: 60, currency: '$' }],
        status: OrderStatus.DELIVERED,
        createdAt: '2023-10-20',
        fileName: 'Autumn_Leaves_Score.mscz'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleFileUpload = (orderId: string) => {
    // Simulation of file upload with restricted types
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mscz,.pdf'; // Strict filter for music professional formats
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setOrders(prev => prev.map(o => o.id === orderId ? { 
          ...o, 
          status: OrderStatus.DELIVERED, 
          fileName: file.name 
        } : o));
      }
    };
    input.click();
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  // Dynamic Revenue Calculation
  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.DELIVERED)
    .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <button 
          onClick={() => window.location.hash = '#/'}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-serif">Command Center</h1>
          <p className="text-slate-500 mt-1">High-fidelity tracking for your technical queue.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          {(['All', ...Object.values(OrderStatus)] as any).map((f: any) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 text-slate-400 mb-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Pending</span>
          </div>
          <span className="text-4xl font-bold text-slate-900">{orders.filter(o => o.status === OrderStatus.PENDING).length}</span>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 text-slate-400 mb-3">
            <Users className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Clients</span>
          </div>
          <span className="text-4xl font-bold text-slate-900">{new Set(orders.map(o => o.userEmail)).size}</span>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 text-slate-400 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Delivered</span>
          </div>
          <span className="text-4xl font-bold text-slate-900">{orders.filter(o => o.status === OrderStatus.DELIVERED).length}</span>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50/50">
          <div className="flex items-center space-x-3 text-slate-400 mb-3">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Total Revenue</span>
          </div>
          <span className="text-4xl font-bold text-indigo-600">${totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Order Management Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap font-mono text-xs font-bold text-indigo-500">{order.id}</td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-700">{order.userEmail}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Registered Client</div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                    {order.items.map(i => i.serviceName).join(', ')}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-[10px] font-black px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider ${
                        order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' :
                        order.status === OrderStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    {order.status !== OrderStatus.DELIVERED ? (
                      <button 
                        onClick={() => handleFileUpload(order.id)}
                        className="flex items-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-all active:scale-95"
                      >
                        <FileUp className="w-4 h-4" />
                        <span>Upload File</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium italic truncate max-w-[120px]">{order.fileName}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Filter className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">No projects match the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
