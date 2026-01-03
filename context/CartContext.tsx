
import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem, Service, Language } from '../types';
import { useTranslation } from './LanguageContext';

interface CartContextType {
  items: OrderItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const { language } = useTranslation();

  const addToCart = (service: Service) => {
    setItems(prev => [...prev, { 
      serviceId: service.id, 
      serviceName: service.name[language], 
      price: service.price[language],
      currency: service.currency[language]
    }]);
  };

  const removeFromCart = (serviceId: string) => {
    setItems(prev => prev.filter(item => item.serviceId !== serviceId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
