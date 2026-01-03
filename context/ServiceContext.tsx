
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Language } from '../types.ts';
import { SERVICES as INITIAL_SERVICES } from '../constants.tsx';

interface ServiceContextType {
  services: Service[];
  updateService: (updatedService: Service) => void;
  addService: (newService: Service) => void;
  deleteService: (id: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);

  useEffect(() => {
    const saved = localStorage.getItem('maestro_services');
    if (saved) {
      try {
        setServices(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse services", e);
      }
    }
  }, []);

  const saveServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem('maestro_services', JSON.stringify(newServices));
  };

  const updateService = (updatedService: Service) => {
    const newServices = services.map(s => s.id === updatedService.id ? updatedService : s);
    saveServices(newServices);
  };

  const addService = (newService: Service) => {
    saveServices([...services, newService]);
  };

  const deleteService = (id: string) => {
    saveServices(services.filter(s => s.id !== id));
  };

  return (
    <ServiceContext.Provider value={{ services, updateService, addService, deleteService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error('useServices must be used within ServiceProvider');
  return context;
};
