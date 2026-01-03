
export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  DELIVERED = 'Delivered'
}

export type Language = 'en-US' | 'pt-BR' | 'pt-PT' | 'es-ES';

export interface User {
  id: string;
  email: string;
  role: 'client' | 'admin';
  name?: string;
}

export interface Service {
  id: string;
  name: Record<Language, string>;
  price: Record<Language, number>;
  currency: Record<Language, string>;
  description: Record<Language, string>;
  category: 'Transcription' | 'Orchestration' | 'Programming';
}

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  price: number;
  currency: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  fileUrl?: string; 
  fileName?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
