
import { Service, Language } from './types';

export const APP_NAME = "MaestroFlow";

export const SERVICES: Service[] = [
  {
    id: 'lead-sheet',
    name: {
      'en-US': 'Lead Sheet',
      'pt-BR': 'Lead Sheet (Melodia e Cifras)',
      'pt-PT': 'Lead Sheet (Melodia e Acordes)',
      'es-ES': 'Lead Sheet (Melodía y Cifras)'
    },
    price: { 'en-US': 45, 'pt-BR': 220, 'pt-PT': 40, 'es-ES': 40 },
    currency: { 'en-US': '$', 'pt-BR': 'R$', 'pt-PT': '€', 'es-ES': '€' },
    description: {
      'en-US': 'Melody, lyrics, and chords transcribed from any audio or rough sketch.',
      'pt-BR': 'Melodia, letras e cifras transcritas de qualquer áudio ou rascunho.',
      'pt-PT': 'Melodia, letras e acordes transcritos de qualquer áudio ou esboço.',
      'es-ES': 'Melodía, letra y acordes transcritos de cualquier audio o boceto.'
    },
    category: 'Transcription'
  },
  {
    id: 'full-orch',
    name: {
      'en-US': 'Full Orchestration',
      'pt-BR': 'Orquestração Completa',
      'pt-PT': 'Orquestração Completa (Sinfónica)',
      'es-ES': 'Orquestración Completa'
    },
    price: { 'en-US': 350, 'pt-BR': 1800, 'pt-PT': 320, 'es-ES': 320 },
    currency: { 'en-US': '$', 'pt-BR': 'R$', 'pt-PT': '€', 'es-ES': '€' },
    description: {
      'en-US': 'Professional arrangement for chamber or full symphony orchestra.',
      'pt-BR': 'Arranjo profissional para orquestra de câmara ou sinfônica completa.',
      'pt-PT': 'Arranjo profissional para orquestra de câmara ou sinfónica.',
      'es-ES': 'Arreglo profesional para orquesta de cámara o sinfónica completa.'
    },
    category: 'Orchestration'
  },
  {
    id: 'midi-prog',
    name: {
      'en-US': 'MIDI Programming',
      'pt-BR': 'Programação MIDI',
      'pt-PT': 'Programação MIDI Realista',
      'es-ES': 'Programación MIDI'
    },
    price: { 'en-US': 120, 'pt-BR': 600, 'pt-PT': 110, 'es-ES': 110 },
    currency: { 'en-US': '$', 'pt-BR': 'R$', 'pt-PT': '€', 'es-ES': '€' },
    description: {
      'en-US': 'High-quality realistic MIDI mockups using premium virtual instruments.',
      'pt-BR': 'Mockups MIDI realistas de alta qualidade usando instrumentos virtuais premium.',
      'pt-PT': 'Mockups MIDI realistas de alta qualidade com instrumentos virtuais premium.',
      'es-ES': 'Mockups MIDI realistas de alta calidad utilizando instrumentos virtuales premium.'
    },
    category: 'Programming'
  },
  {
    id: 'musescore-engraving',
    name: {
      'en-US': 'MuseScore Engraving',
      'pt-BR': 'Edição MuseScore',
      'pt-PT': 'Edição MuseScore (Gravura)',
      'es-ES': 'Edición MuseScore'
    },
    price: { 'en-US': 60, 'pt-BR': 300, 'pt-PT': 55, 'es-ES': 55 },
    currency: { 'en-US': '$', 'pt-BR': 'R$', 'pt-PT': '€', 'es-ES': '€' },
    description: {
      'en-US': 'Convert handwritten scores into professional MuseScore (.mscz) digital format.',
      'pt-BR': 'Converta partituras manuscritas para o formato digital profissional do MuseScore (.mscz).',
      'pt-PT': 'Converta partituras manuscritas para o formato digital profissional do MuseScore (.mscz).',
      'es-ES': 'Convierta partituras manuscritas al formato digital profesional de MuseScore (.mscz).'
    },
    category: 'Transcription'
  }
];

export const PAYMENT_METHODS: Record<Language, { id: string; name: string; icon?: string }[]> = {
  'en-US': [
    { id: 'stripe', name: 'Credit Card (Stripe)' },
    { id: 'paypal', name: 'PayPal' }
  ],
  'pt-BR': [
    { id: 'pix', name: 'PIX (Instante)' },
    { id: 'cc', name: 'Cartão de Crédito' },
    { id: 'boleto', name: 'Boleto Bancário' }
  ],
  'pt-PT': [
    { id: 'multibanco', name: 'Multibanco' },
    { id: 'mbway', name: 'MB Way' },
    { id: 'cc', name: 'Cartão de Crédito' }
  ],
  'es-ES': [
    { id: 'cc', name: 'Tarjeta de Crédito' },
    { id: 'transfer', name: 'Transferencia Bancaria' }
  ]
};

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  'en-US': {
    heroTitle: 'Transcription. Mastered.',
    heroSubtitle: 'Professional engraving, orchestration, and MIDI programming for composers who demand excellence.',
    startProject: 'Start Your Project',
    viewServices: 'View Services',
    servicesTitle: 'Bespoke Technical Services',
    servicesSubtitle: 'Precision engraving for the modern maestro.',
    trustTitle: 'The Professional Gold Standard',
    backHome: 'Back to Home',
    signIn: 'Sign In',
    checkout: 'Secure Checkout',
    orderSummary: 'Order Summary',
    finalizePayment: 'Finalize Payment',
    total: 'Total',
    projectDetails: 'Project Details',
    musicalScope: 'Musical Scope',
    selectService: 'Select Service',
    welcome: 'Welcome Back',
    createAccount: 'Create Account',
    continueGoogle: 'Continue with Google',
    adminTitle: 'Command Center',
    clientTitle: 'Hello',
    myProjects: 'My Projects',
    paymentMethod: 'Payment Method',
    selectPayment: 'Select your local payment standard',
    securedBy: 'Secured by Global Technology'
  },
  'pt-BR': {
    heroTitle: 'Transcrição. Com Maestria.',
    heroSubtitle: 'Edição profissional, orquestração e programação MIDI para compositores que buscam excelência.',
    startProject: 'Iniciar Projeto',
    viewServices: 'Ver Serviços',
    servicesTitle: 'Serviços Técnicos Sob Medida',
    servicesSubtitle: 'Edição de precisão para o maestro moderno.',
    trustTitle: 'O Padrão Ouro Profissional',
    backHome: 'Voltar ao Início',
    signIn: 'Entrar',
    checkout: 'Checkout Seguro',
    orderSummary: 'Resumo do Pedido',
    finalizePayment: 'Finalizar Pagamento',
    total: 'Total',
    projectDetails: 'Detalhes do Projeto',
    musicalScope: 'Escopo Musical',
    selectService: 'Selecionar Serviço',
    welcome: 'Bem-vindo de volta',
    createAccount: 'Criar Conta',
    continueGoogle: 'Continuar com Google',
    adminTitle: 'Centro de Comando',
    clientTitle: 'Olá',
    myProjects: 'Meus Projetos',
    paymentMethod: 'Forma de Pagamento',
    selectPayment: 'Selecione o padrão de pagamento local',
    securedBy: 'Protegido por Tecnologia de Ponta'
  },
  'pt-PT': {
    heroTitle: 'Transcrição Profissional.',
    heroSubtitle: 'Gravura, orquestração e programação MIDI para compositores que exigem o melhor padrão europeu.',
    startProject: 'Começar Projeto',
    viewServices: 'Ver Serviços',
    servicesTitle: 'Serviços Técnicos Especializados',
    servicesSubtitle: 'Precisão absoluta para maestros e orquestras.',
    trustTitle: 'O Padrão de Excelência Profissional',
    backHome: 'Voltar',
    signIn: 'Entrar',
    checkout: 'Pagamento Seguro',
    orderSummary: 'Resumo da Encomenda',
    finalizePayment: 'Finalizar Pagamento',
    total: 'Total',
    projectDetails: 'Detalhes do Projeto',
    musicalScope: 'Âmbito Musical',
    selectService: 'Selecionar Serviço',
    welcome: 'Bem-vindo',
    createAccount: 'Criar Conta',
    continueGoogle: 'Entrar com Google',
    adminTitle: 'Painel de Gestão',
    clientTitle: 'Olá',
    myProjects: 'Os Meus Projetos',
    paymentMethod: 'Método de Pagamento',
    selectPayment: 'Selecione o padrão de pagamento europeu',
    securedBy: 'Transação Segura Certificada'
  },
  'es-ES': {
    heroTitle: 'Transcripción. Maestra.',
    heroSubtitle: 'Edición profesional, orquestación y programación MIDI para compositores que exigen excelencia.',
    startProject: 'Iniciar Proyecto',
    viewServices: 'Ver Servicios',
    servicesTitle: 'Servicios Técnicos a Medida',
    servicesSubtitle: 'Edición de precisión para el maestro moderno.',
    trustTitle: 'El Estándar de Oro Profesional',
    backHome: 'Volver al Inicio',
    signIn: 'Iniciar Sesión',
    checkout: 'Pago Seguro',
    orderSummary: 'Resumen del Pedido',
    finalizePayment: 'Finalizar Pago',
    total: 'Total',
    projectDetails: 'Detalles del Proyecto',
    musicalScope: 'Alcance Musical',
    selectService: 'Seleccionar Servicio',
    welcome: 'Bienvenido de nuevo',
    createAccount: 'Crear Cuenta',
    continueGoogle: 'Continuar con Google',
    adminTitle: 'Centro de Mando',
    clientTitle: 'Hola',
    myProjects: 'Mis Proyectos',
    paymentMethod: 'Método de Pago',
    selectPayment: 'Seleccione el estándar de pago local',
    securedBy: 'Protegido por Tecnología Internacional'
  }
};
