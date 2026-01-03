
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import { Download, Package, CheckCircle2, Loader2, Music2, ArrowLeft } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load simulated data for this specific user
    const mockOrders: Order[] = [
      {
        id: 'ORD-003',
        userId: user?.id || 'u3',
        userEmail: user?.email || '',
        // Added missing currency property to OrderItem
        items: [{ serviceId: 'musescore-engraving', serviceName: 'MuseScore Engraving', price: 60, currency: '$' }],
        status: OrderStatus.DELIVERED,
        createdAt: '2023-10-20',
        fileName: 'Autumn_Leaves_Score.mscz'
      },
      {
        id: 'ORD-004',
        userId: user?.id || 'u3',
        userEmail: user?.email || '',
        // Added missing currency property to OrderItem
        items: [{ serviceId: 'midi-prog', serviceName: 'MIDI Programming', price: 120, currency: '$' }],
        status: OrderStatus.IN_PROGRESS,
        createdAt: '2023-10-28'
      }
    ];
    setOrders(mockOrders);
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <button 
          onClick={() => window.location.hash = '#/'}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold text-slate-900 font-serif">Hello, {user?.email?.split('@')[0]}</h1>
        <p className="text-slate-500 mt-2 text-lg">Track your professional musical services and download your final files.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
          <Package className="w-5 h-5 text-indigo-600" />
          <span>My Projects</span>
        </h2>

        {orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl ${order.status === OrderStatus.DELIVERED ? 'bg-emerald-50' : 'bg-indigo-50'}`}>
                    <Music2 className={`w-8 h-8 ${order.status === OrderStatus.DELIVERED ? 'text-emerald-600' : 'text-indigo-600'}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">{order.id}</span>
                      <span className="text-xs text-slate-400">{order.createdAt}</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{order.items.map(i => i.serviceName).join(', ')}</h3>
                    <div className="flex items-center space-x-2 mt-2">
                       {order.status === OrderStatus.DELIVERED ? (
                         <div className="flex items-center text-emerald-600 text-sm font-medium">
                           <CheckCircle2 className="w-4 h-4 mr-1" /> Delivered
                         </div>
                       ) : (
                         <div className="flex items-center text-amber-600 text-sm font-medium animate-pulse">
                           <Loader2 className="w-4 h-4 mr-1 animate-spin" /> In Progress
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  {order.status === OrderStatus.DELIVERED ? (
                    <button 
                      className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md"
                      onClick={() => alert('Downloading ' + order.fileName)}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download {order.fileName?.split('.').pop()?.toUpperCase()}</span>
                    </button>
                  ) : (
                    <div className="text-sm text-slate-400 font-medium px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 italic text-center">
                      Estimated Delivery: 2-3 Days
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <Music2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
            <button 
              onClick={() => window.location.hash = '#/'}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Browse Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
