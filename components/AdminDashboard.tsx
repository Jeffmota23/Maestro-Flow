
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Service, Language } from '../types.ts';
import { useServices } from '../context/ServiceContext.tsx';
import { 
  CheckCircle, Clock, FileUp, Filter, Users, 
  FileText, ArrowLeft, TrendingUp, Settings, 
  Package, Edit3, Save, Trash2, Plus, X 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { services, updateService, addService, deleteService } = useServices();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'services'>('orders');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'All'>('All');

  useEffect(() => {
    // Mock orders
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        userId: 'u1',
        userEmail: 'maestro.john@orchestra.com',
        items: [{ serviceId: 'full-orch', serviceName: 'Full Orchestration', price: 350, currency: '$' }],
        status: OrderStatus.IN_PROGRESS,
        createdAt: '2023-10-25'
      },
      {
        id: 'ORD-003',
        userId: 'u3',
        userEmail: 'bob.jazz@me.com',
        items: [{ serviceId: 'musescore-engraving', serviceName: 'MuseScore Engraving', price: 60, currency: '$' }],
        status: OrderStatus.DELIVERED,
        createdAt: '2023-10-20',
        fileName: 'Autumn_Leaves_Score.mscz'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService);
      setEditingService(null);
    }
  };

  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.DELIVERED)
    .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <button 
            onClick={() => window.location.hash = '#/'}
            className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-[10px] uppercase tracking-widest mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Hub</span>
          </button>
          <h1 className="text-4xl font-black text-slate-900 font-serif">Maestro Control</h1>
          <p className="text-slate-500 mt-1 font-medium">Enterprise management for technical music assets.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Package className="w-4 h-4" />
            <span>Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'services' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Settings className="w-4 h-4" />
            <span>Services & Prices</span>
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-12 animate-in fade-in duration-500">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Pending Orders</span>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-slate-900">{orders.filter(o => o.status === OrderStatus.PENDING).length}</span>
                <Clock className="w-8 h-8 text-amber-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Total Revenue</span>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-indigo-600">${totalRevenue}</span>
                <TrendingUp className="w-8 h-8 text-indigo-600 opacity-20" />
              </div>
            </div>
            {/* Add more stats as needed */}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden ring-1 ring-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Email</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-mono text-xs font-bold text-indigo-500">{order.id}</td>
                      <td className="px-8 py-6 font-semibold text-slate-700 text-sm">{order.userEmail}</td>
                      <td className="px-8 py-6 text-sm text-slate-600 font-medium">{order.items.map(i => i.serviceName).join(', ')}</td>
                      <td className="px-8 py-6">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-8 py-6">
                        <button className="text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest">View Files</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Service Inventory</h2>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map(service => (
              <div key={service.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all group ring-1 ring-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingService(service)}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{service.name['en-US']}</h3>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
                  {Object.entries(service.price).map(([lang, price]) => (
                    <div key={lang} className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{lang}</span>
                      <span className="font-bold text-slate-700">{service.currency[lang as Language]}{price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 md:p-16 shadow-2xl ring-1 ring-white/10 relative">
            <button 
              onClick={() => setEditingService(null)}
              className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-black text-slate-900 font-serif mb-10">Edit Service Parameters</h2>
            
            <form onSubmit={handleServiceSubmit} className="space-y-12">
              {/* Names per language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(['en-US', 'pt-BR', 'pt-PT', 'es-ES'] as Language[]).map(lang => (
                  <div key={lang} className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Name ({lang})</label>
                    <input 
                      type="text"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 outline-none font-bold"
                      value={editingService.name[lang]}
                      onChange={(e) => setEditingService({
                        ...editingService, 
                        name: { ...editingService.name, [lang]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </div>

              {/* Prices per language */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-slate-50 p-8 rounded-3xl">
                {(['en-US', 'pt-BR', 'pt-PT', 'es-ES'] as Language[]).map(lang => (
                  <div key={lang} className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price ({lang})</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">{editingService.currency[lang]}</span>
                      <input 
                        type="number"
                        className="w-full pl-10 pr-4 py-4 bg-white border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-600/5 outline-none font-bold"
                        value={editingService.price[lang]}
                        onChange={(e) => setEditingService({
                          ...editingService, 
                          price: { ...editingService.price, [lang]: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex justify-end">
                <button 
                  type="submit"
                  className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center space-x-3"
                >
                  <Save className="w-5 h-5" />
                  <span>Deploy Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
