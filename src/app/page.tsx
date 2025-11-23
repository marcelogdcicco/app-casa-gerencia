"use client";

import { useState, useEffect } from "react";
import { 
  Home, 
  Wrench, 
  Calendar, 
  Users, 
  CheckSquare, 
  Clock, 
  Plus,
  Bell,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Settings,
  Crown,
  Check,
  X,
  Star,
  MapPin,
  Award,
  ThumbsUp,
  Briefcase,
  Building,
  Shield,
  Moon,
  Sun,
  Play,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Package,
  Zap,
  Database,
  Brain,
  Target,
  BarChart3,
  HardDrive,
  Users2,
  Sparkles,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Priority = "baixa" | "media" | "alta" | "urgente";
type Status = "pendente" | "em_andamento" | "concluida" | "atrasada";

interface Maintenance {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  cost?: number;
  professional?: string;
  recurring?: boolean;
  recurringInterval?: string;
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  rating: number;
  jobs: number;
  region?: string;
  isPremium?: boolean;
  commissionRate?: number;
  plan?: "bronze" | "prata" | "ouro";
}

interface ChecklistItem {
  id: string;
  title: string;
  interval: string;
  lastDone?: string;
  nextDue: string;
  category: string;
}

interface House {
  id: string;
  name: string;
  address: string;
  maintenanceCount: number;
}

interface SuggestedProfessional {
  professional: Professional;
  matchScore: number;
  reason: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  priceRange: string;
  commission: number;
  icon: any;
}

export default function HomeCare() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [isAddProfessionalOpen, setIsAddProfessionalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isSuggestProfessionalOpen, setIsSuggestProfessionalOpen] = useState(false);
  const [isProfessionalSignupOpen, setIsProfessionalSignupOpen] = useState(false);
  const [selectedMaintenanceForSuggestion, setSelectedMaintenanceForSuggestion] = useState<Maintenance | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [houses, setHouses] = useState<House[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<"basico" | "premium">("basico");
  const [selectedBilling, setSelectedBilling] = useState<"mensal" | "anual">("mensal");

  // Dados de exemplo - inicializados apenas no cliente
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Dados de testemunhos
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Maria Silva",
      role: "Proprietária de 2 casas",
      content: "O HomeCare transformou a forma como gerencio minhas propriedades. Nunca mais esqueci de uma manutenção importante!",
      rating: 5,
      image: "MS"
    },
    {
      id: "2",
      name: "João Santos",
      role: "Investidor Imobiliário",
      content: "Gerencio 5 imóveis e o app me economiza horas toda semana. O marketplace de profissionais é excelente!",
      rating: 5,
      image: "JS"
    },
    {
      id: "3",
      name: "Ana Costa",
      role: "Dona de Casa",
      content: "Finalmente consigo acompanhar todas as manutenções da casa. Os lembretes automáticos são perfeitos!",
      rating: 5,
      image: "AC"
    },
    {
      id: "4",
      name: "Carlos Oliveira",
      role: "Engenheiro Civil",
      content: "Como profissional da área, posso dizer que o HomeCare é a ferramenta mais completa do mercado.",
      rating: 5,
      image: "CO"
    }
  ];

  // Dados de vídeos
  const videos: Video[] = [
    {
      id: "1",
      title: "Como usar o HomeCare - Tutorial Completo",
      description: "Aprenda a gerenciar todas as manutenções da sua casa em minutos",
      thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop",
      duration: "8:45",
      views: "12.5k"
    },
    {
      id: "2",
      title: "Marketplace de Profissionais - Como Funciona",
      description: "Encontre os melhores profissionais da sua região",
      thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=225&fit=crop",
      duration: "5:30",
      views: "8.2k"
    },
    {
      id: "3",
      title: "Plano Premium - Vale a Pena?",
      description: "Descubra todos os benefícios do plano premium",
      thumbnail: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400&h=225&fit=crop",
      duration: "6:15",
      views: "15.3k"
    },
    {
      id: "4",
      title: "Dicas de Manutenção Preventiva",
      description: "Evite problemas antes que eles aconteçam",
      thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=225&fit=crop",
      duration: "10:20",
      views: "20.1k"
    }
  ];

  // Serviços do marketplace
  const services: Service[] = [
    {
      id: "1",
      name: "Limpeza Residencial",
      category: "Limpeza",
      description: "Limpeza completa da residência",
      priceRange: "R$ 150 - R$ 400",
      commission: 15,
      icon: Sparkles
    },
    {
      id: "2",
      name: "Manutenção Elétrica",
      category: "Elétrica",
      description: "Instalação e reparos elétricos",
      priceRange: "R$ 100 - R$ 500",
      commission: 12,
      icon: Zap
    },
    {
      id: "3",
      name: "Encanamento",
      category: "Hidráulica",
      description: "Reparos e instalações hidráulicas",
      priceRange: "R$ 120 - R$ 600",
      commission: 12,
      icon: Wrench
    },
    {
      id: "4",
      name: "Pintura",
      category: "Pintura",
      description: "Pintura interna e externa",
      priceRange: "R$ 800 - R$ 5000",
      commission: 10,
      icon: Building
    },
    {
      id: "5",
      name: "Dedetização",
      category: "Limpeza",
      description: "Controle de pragas e dedetização",
      priceRange: "R$ 200 - R$ 800",
      commission: 15,
      icon: Shield
    },
    {
      id: "6",
      name: "Instalação de Pisos",
      category: "Reforma",
      description: "Instalação de pisos e revestimentos",
      priceRange: "R$ 1500 - R$ 8000",
      commission: 10,
      icon: Package
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Carregar preferência de dark mode do localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Inicializar dados apenas no cliente para evitar hydration mismatch
    setMaintenances([
      {
        id: "1",
        title: "Trocar filtro do ar condicionado",
        description: "Manutenção preventiva do sistema de climatização",
        category: "Climatização",
        priority: "media",
        status: "pendente",
        dueDate: "2024-01-15",
        cost: 150,
        recurring: true,
        recurringInterval: "3 meses"
      },
      {
        id: "2",
        title: "Inspecionar telhado",
        description: "Verificar telhas e calhas antes da temporada de chuvas",
        category: "Estrutura",
        priority: "alta",
        status: "pendente",
        dueDate: "2024-01-10",
        professional: "João Silva",
        cost: 300
      },
      {
        id: "3",
        title: "Pintura da fachada",
        description: "Repintura completa da parte externa",
        category: "Pintura",
        priority: "baixa",
        status: "em_andamento",
        dueDate: "2024-02-01",
        professional: "Maria Santos",
        cost: 5000
      },
      {
        id: "4",
        title: "Desentupir ralo da cozinha",
        description: "Ralo entupido, água não escoa",
        category: "Hidráulica",
        priority: "urgente",
        status: "atrasada",
        dueDate: "2024-01-05",
        cost: 200
      }
    ]);

    setProfessionals([
      {
        id: "1",
        name: "João Silva",
        specialty: "Eletricista",
        phone: "(11) 98765-4321",
        email: "joao.silva@email.com",
        rating: 4.8,
        jobs: 12,
        region: "Zona Sul - SP",
        isPremium: true,
        commissionRate: 15,
        plan: "ouro"
      },
      {
        id: "2",
        name: "Maria Santos",
        specialty: "Pintora",
        phone: "(11) 97654-3210",
        email: "maria.santos@email.com",
        rating: 4.9,
        jobs: 8,
        region: "Zona Oeste - SP",
        isPremium: true,
        commissionRate: 12,
        plan: "prata"
      },
      {
        id: "3",
        name: "Carlos Oliveira",
        specialty: "Encanador",
        phone: "(11) 96543-2109",
        rating: 4.5,
        jobs: 15,
        region: "Zona Sul - SP",
        isPremium: false
      },
      {
        id: "4",
        name: "Ana Costa",
        specialty: "Pedreiro",
        phone: "(11) 95432-1098",
        email: "ana.costa@email.com",
        rating: 5.0,
        jobs: 20,
        region: "Centro - SP",
        isPremium: true,
        commissionRate: 10,
        plan: "bronze"
      },
      {
        id: "5",
        name: "Roberto Almeida",
        specialty: "Técnico de Ar Condicionado",
        phone: "(11) 94321-0987",
        email: "roberto.almeida@email.com",
        rating: 4.7,
        jobs: 25,
        region: "Zona Sul - SP",
        isPremium: true,
        commissionRate: 15,
        plan: "ouro"
      }
    ]);

    setChecklistItems([
      {
        id: "1",
        title: "Trocar filtro de ar condicionado",
        interval: "3 meses",
        lastDone: "2023-10-15",
        nextDue: "2024-01-15",
        category: "Climatização"
      },
      {
        id: "2",
        title: "Limpar calhas",
        interval: "6 meses",
        lastDone: "2023-08-01",
        nextDue: "2024-02-01",
        category: "Estrutura"
      },
      {
        id: "3",
        title: "Verificar extintores",
        interval: "1 ano",
        lastDone: "2023-01-10",
        nextDue: "2024-01-10",
        category: "Segurança"
      },
      {
        id: "4",
        title: "Revisar instalação elétrica",
        interval: "2 anos",
        nextDue: "2024-06-01",
        category: "Elétrica"
      }
    ]);

    setHouses([
      {
        id: "1",
        name: "Casa Principal",
        address: "Rua das Flores, 123 - Zona Sul - SP",
        maintenanceCount: 4
      }
    ]);

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Função para alternar dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  // Função para sugerir profissionais baseado na manutenção
  const suggestProfessionals = (maintenance: Maintenance): SuggestedProfessional[] => {
    // Mapear categorias para especialidades
    const categoryToSpecialty: { [key: string]: string[] } = {
      "Climatização": ["Técnico de Ar Condicionado"],
      "Elétrica": ["Eletricista"],
      "Hidráulica": ["Encanador"],
      "Pintura": ["Pintora", "Pintor"],
      "Estrutura": ["Pedreiro"],
    };

    const relevantSpecialties = categoryToSpecialty[maintenance.category] || [];
    
    // Filtrar profissionais relevantes e premium
    const relevantProfessionals = professionals.filter(pro => 
      relevantSpecialties.some(spec => pro.specialty.toLowerCase().includes(spec.toLowerCase())) &&
      pro.isPremium
    );

    // Calcular score de match e ordenar
    const suggestions = relevantProfessionals.map(pro => {
      let score = 0;
      let reasons: string[] = [];

      // Rating alto
      if (pro.rating >= 4.8) {
        score += 30;
        reasons.push(`Avaliação excelente (${pro.rating}★)`);
      }

      // Muitos trabalhos
      if (pro.jobs >= 20) {
        score += 25;
        reasons.push(`Muito experiente (${pro.jobs} trabalhos)`);
      } else if (pro.jobs >= 10) {
        score += 15;
        reasons.push(`Experiente (${pro.jobs} trabalhos)`);
      }

      // Mesma região (extrair da casa)
      if (pro.region && houses[0]?.address.includes(pro.region.split(" - ")[0])) {
        score += 25;
        reasons.push(`Atua na sua região (${pro.region})`);
      }

      return {
        professional: pro,
        matchScore: score,
        reason: reasons.join(" • ")
      };
    });

    // Ordenar por score e retornar top 3
    return suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  };

  const handleSuggestProfessional = (maintenance: Maintenance) => {
    setSelectedMaintenanceForSuggestion(maintenance);
    setIsSuggestProfessionalOpen(true);
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      baixa: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      media: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      alta: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      urgente: "bg-red-500/10 text-red-700 dark:text-red-400"
    };
    return colors[priority];
  };

  const getStatusColor = (status: Status) => {
    const colors = {
      pendente: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
      em_andamento: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      concluida: "bg-green-500/10 text-green-700 dark:text-green-400",
      atrasada: "bg-red-500/10 text-red-700 dark:text-red-400"
    };
    return colors[status];
  };

  const getStatusLabel = (status: Status) => {
    const labels = {
      pendente: "Pendente",
      em_andamento: "Em Andamento",
      concluida: "Concluída",
      atrasada: "Atrasada"
    };
    return labels[status];
  };

  const getPlanBadgeColor = (plan?: "bronze" | "prata" | "ouro") => {
    if (!plan) return "";
    const colors = {
      bronze: "bg-orange-700 text-white",
      prata: "bg-gray-400 text-gray-900",
      ouro: "bg-amber-500 text-white"
    };
    return colors[plan];
  };

  const urgentCount = maintenances.filter(m => m.priority === "urgente" || m.status === "atrasada").length;
  const pendingCount = maintenances.filter(m => m.status === "pendente").length;
  const inProgressCount = maintenances.filter(m => m.status === "em_andamento").length;
  const totalCost = maintenances.reduce((sum, m) => sum + (m.cost || 0), 0);

  // Calcular preço do plano premium baseado no número de casas
  const calculatePremiumPrice = (houseCount: number) => {
    const basePrice = 29.90;
    const pricePerHouse = 15.00;
    return basePrice + (pricePerHouse * (houseCount - 1));
  };

  const premiumPrice = calculatePremiumPrice(houses.length);

  // Calcular preços dos planos
  const basicMonthly = 14.90;
  const premiumMonthly = 29.90;
  const basicYearly = basicMonthly * 10; // 2 meses grátis
  const premiumYearly = premiumMonthly * 10; // 2 meses grátis

  // Mostrar loading state enquanto não montou no cliente
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Redesenhado - Moderno e Profissional */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="relative w-full h-full">
                    <Shield className="w-full h-full text-white" strokeWidth={2.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  </div>
                </div>
                {/* Badge Premium no Logo */}
                {isPremium && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-1 shadow-md">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 bg-clip-text text-transparent">
                  HomeCare
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Gestão Inteligente de Manutenção</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Botão Dark Mode Toggle */}
              <Button 
                onClick={toggleDarkMode}
                variant="ghost" 
                size="icon"
                className="relative"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button 
                onClick={() => setIsProfessionalSignupOpen(true)}
                variant="outline"
                className="gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Sou Profissional</span>
              </Button>
              {!isPremium && (
                <Button 
                  onClick={() => setIsPremiumModalOpen(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Seja Premium</span>
                </Button>
              )}
              {isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white gap-1 px-3 py-1 shadow-md">
                  <Crown className="w-3 h-3" />
                  Premium
                </Badge>
              )}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {urgentCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {urgentCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 lg:w-auto gap-1">
            <TabsTrigger value="home" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="planos" className="gap-2">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Planos</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="profissionais-pro" className="gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Profissionais</span>
            </TabsTrigger>
            <TabsTrigger value="ia" className="gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Leads</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab - Landing Page */}
          <TabsContent value="home" className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-12 px-4">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  Mais de 10.000 casas gerenciadas
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 bg-clip-text text-transparent">
                  Gerencie sua casa com inteligência
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  O HomeCare é a plataforma completa para gerenciar manutenções, encontrar profissionais qualificados e manter sua casa sempre em dia.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8"
                    onClick={() => setActiveTab("dashboard")}
                  >
                    Começar Agora - Grátis
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8"
                    onClick={() => setActiveTab("planos")}
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Ver Planos Premium
                  </Button>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl text-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">10k+</div>
                  <div className="text-blue-100">Casas Gerenciadas</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">5k+</div>
                  <div className="text-blue-100">Profissionais</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">50k+</div>
                  <div className="text-blue-100">Manutenções</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
                  <div className="text-blue-100">Avaliação</div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos usuários dizem</h2>
                <p className="text-xl text-muted-foreground">Milhares de pessoas já confiam no HomeCare</p>
              </div>

              <div className="relative max-w-4xl mx-auto">
                <Card className="border-2 shadow-xl">
                  <CardContent className="pt-12 pb-8 px-8">
                    <div className="flex flex-col items-center text-center">
                      <Quote className="w-12 h-12 text-blue-600 mb-6" />
                      <div className="mb-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 inline text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-xl md:text-2xl mb-8 text-foreground leading-relaxed">
                        "{testimonials[currentTestimonial].content}"
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                          {testimonials[currentTestimonial].image}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                          <div className="text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentTestimonial 
                            ? 'bg-blue-600 w-8' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Videos Section */}
            <section className="py-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Veja como funciona</h2>
                <p className="text-xl text-muted-foreground">Tutoriais e dicas para aproveitar ao máximo</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-blue-600 ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-4 right-4 bg-black/70 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{video.description}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{video.views} visualizações</span>
                        <Button variant="ghost" size="sm" className="gap-2">
                          Assistir <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Reviews Summary Section */}
            <section className="py-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Avaliações dos Usuários</h2>
                <p className="text-xl text-muted-foreground">Veja o que dizem sobre o HomeCare</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="text-center p-8 border-2 hover:shadow-xl transition-shadow">
                  <div className="text-5xl font-bold text-blue-600 mb-2">4.9</div>
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">Baseado em 2.847 avaliações</p>
                </Card>

                <Card className="p-8 border-2 hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-lg mb-4">Distribuição de Estrelas</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-green-600"
                            style={{ width: stars === 5 ? '85%' : stars === 4 ? '12%' : '3%' }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {stars === 5 ? '85%' : stars === 4 ? '12%' : '3%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8 border-2 hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-lg mb-4">Destaques</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Facilidade de uso</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Mencionado em 92% das avaliações</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Profissionais qualificados</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Mencionado em 88% das avaliações</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">Suporte excelente</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Mencionado em 85% das avaliações</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 text-center">
              <Card className="border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
                <CardContent className="py-12 px-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Pronto para começar?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Junte-se a milhares de pessoas que já gerenciam suas casas de forma inteligente
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8"
                      onClick={() => setActiveTab("dashboard")}
                    >
                      Começar Gratuitamente
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="text-lg px-8"
                      onClick={() => setIsProfessionalSignupOpen(true)}
                    >
                      Sou Profissional
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* Planos Premium Tab */}
          <TabsContent value="planos" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Escolha seu Plano</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Desbloqueie recursos premium e gerencie sua casa com ainda mais eficiência
              </p>
              
              {/* Toggle Mensal/Anual */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={selectedBilling === "mensal" ? "font-bold" : "text-muted-foreground"}>Mensal</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBilling(selectedBilling === "mensal" ? "anual" : "mensal")}
                  className="relative w-16 h-8"
                >
                  <div className={`absolute w-6 h-6 bg-blue-600 rounded-full transition-all ${
                    selectedBilling === "anual" ? "right-1" : "left-1"
                  }`} />
                </Button>
                <span className={selectedBilling === "anual" ? "font-bold" : "text-muted-foreground"}>
                  Anual <Badge className="ml-2 bg-green-500">2 meses grátis</Badge>
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Plano Básico */}
              <Card className="border-2 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Básico</CardTitle>
                    <Badge variant="outline">Popular</Badge>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      R$ {selectedBilling === "mensal" ? basicMonthly.toFixed(2) : (basicYearly / 12).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                    {selectedBilling === "anual" && (
                      <p className="text-sm text-green-600 mt-2">
                        R$ {basicYearly.toFixed(2)}/ano (economize R$ {(basicMonthly * 2).toFixed(2)})
                      </p>
                    )}
                  </div>
                  <CardDescription>Perfeito para quem está começando</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Lembretes automáticos de manutenção</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Histórico de 6 meses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Upload de até 50 fotos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Checklist básico</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>1 casa</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Comparação de orçamentos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Alertas de risco</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Assinar Básico
                  </Button>
                </CardContent>
              </Card>

              {/* Plano Premium */}
              <Card className="border-4 border-amber-500 hover:shadow-2xl transition-all relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1">
                    Recomendado
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Crown className="w-6 h-6 text-amber-500" />
                      Premium
                    </CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      R$ {selectedBilling === "mensal" ? premiumMonthly.toFixed(2) : (premiumYearly / 12).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                    {selectedBilling === "anual" && (
                      <p className="text-sm text-green-600 mt-2">
                        R$ {premiumYearly.toFixed(2)}/ano (economize R$ {(premiumMonthly * 2).toFixed(2)})
                      </p>
                    )}
                  </div>
                  <CardDescription>Para quem quer o máximo de controle</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Tudo do Básico +</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Histórico completo ilimitado</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Upload ilimitado de fotos e documentos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Checklist avançado personalizado</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Comparação de orçamentos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Alertas de risco (mofo, infiltração, energia)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Múltiplas casas (até 5)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Suporte prioritário</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" size="lg">
                    Assinar Premium
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Comparação de Recursos */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">Comparação Completa</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4">Recurso</th>
                          <th className="text-center p-4">Básico</th>
                          <th className="text-center p-4">Premium</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="p-4">Lembretes automáticos</td>
                          <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                          <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                        </tr>
                        <tr>
                          <td className="p-4">Histórico</td>
                          <td className="text-center p-4">6 meses</td>
                          <td className="text-center p-4">Ilimitado</td>
                        </tr>
                        <tr>
                          <td className="p-4">Upload de fotos</td>
                          <td className="text-center p-4">50 fotos</td>
                          <td className="text-center p-4">Ilimitado</td>
                        </tr>
                        <tr>
                          <td className="p-4">Número de casas</td>
                          <td className="text-center p-4">1</td>
                          <td className="text-center p-4">Até 5</td>
                        </tr>
                        <tr>
                          <td className="p-4">Comparação de orçamentos</td>
                          <td className="text-center p-4"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                          <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                        </tr>
                        <tr>
                          <td className="p-4">Alertas de risco</td>
                          <td className="text-center p-4"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                          <td className="text-center p-4"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                        </tr>
                        <tr>
                          <td className="p-4">Suporte</td>
                          <td className="text-center p-4">Email</td>
                          <td className="text-center p-4">Prioritário</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Marketplace de Serviços</h2>
              <p className="text-xl text-muted-foreground">
                Encontre profissionais qualificados para qualquer serviço
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.id} className="hover:shadow-xl transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">{service.category}</Badge>
                      </div>
                      <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Faixa de preço</span>
                        <span className="font-bold text-sm">{service.priceRange}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Comissão da plataforma</span>
                        <Badge className="bg-green-500">{service.commission}%</Badge>
                      </div>
                      <Button className="w-full" variant="outline" size="sm">
                        Ver Profissionais <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Como Funciona */}
            <Card className="mt-12 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
              <CardHeader>
                <CardTitle className="text-2xl">Como Funciona o Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      1
                    </div>
                    <h3 className="font-bold mb-2">Escolha o Serviço</h3>
                    <p className="text-sm text-muted-foreground">
                      Selecione o tipo de serviço que você precisa
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      2
                    </div>
                    <h3 className="font-bold mb-2">Compare Profissionais</h3>
                    <p className="text-sm text-muted-foreground">
                      Veja avaliações, preços e disponibilidade
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      3
                    </div>
                    <h3 className="font-bold mb-2">Agende e Pague</h3>
                    <p className="text-sm text-muted-foreground">
                      Agende o serviço e pague com segurança
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Para Profissionais Tab */}
          <TabsContent value="profissionais-pro" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Planos para Profissionais</h2>
              <p className="text-xl text-muted-foreground">
                Destaque seu perfil e receba mais clientes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Bronze */}
              <Card className="border-2 border-orange-700 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Bronze</CardTitle>
                    <Badge className="bg-orange-700 text-white">Básico</Badge>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">R$ 39,90</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Perfil destacado</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Até 10 reviews</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Link para WhatsApp</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Aparece em buscas</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Assinar Bronze
                  </Button>
                </CardContent>
              </Card>

              {/* Prata */}
              <Card className="border-4 border-gray-400 hover:shadow-2xl transition-all relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gray-400 text-gray-900 px-4 py-1">
                    Popular
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Prata</CardTitle>
                    <Badge className="bg-gray-400 text-gray-900">Intermediário</Badge>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">R$ 79,90</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Tudo do Bronze +</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Reviews ilimitados</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Agenda de serviços integrada</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Selo de verificado</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Prioridade em buscas</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    Assinar Prata
                  </Button>
                </CardContent>
              </Card>

              {/* Ouro */}
              <Card className="border-4 border-amber-500 hover:shadow-2xl transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Crown className="w-6 h-6 text-amber-500" />
                      Ouro
                    </CardTitle>
                    <Badge className="bg-amber-500 text-white">Premium</Badge>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">R$ 149,90</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Tudo do Prata +</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Destaque no topo das buscas</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Badge "Profissional Premium"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Sugestão automática para clientes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Comissão reduzida (10%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Suporte prioritário 24/7</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                    Assinar Ouro
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Benefícios */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="text-2xl">Por que se tornar um Profissional Premium?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Mais Visibilidade</h3>
                      <p className="text-sm text-muted-foreground">
                        Apareça no topo das buscas e receba mais solicitações de clientes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Credibilidade</h3>
                      <p className="text-sm text-muted-foreground">
                        Selos e badges que aumentam a confiança dos clientes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Comissões Menores</h3>
                      <p className="text-sm text-muted-foreground">
                        Planos premium pagam menos comissão por serviço realizado
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Gestão Facilitada</h3>
                      <p className="text-sm text-muted-foreground">
                        Ferramentas de agenda e gestão de clientes integradas
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IA Premium Tab */}
          <TabsContent value="ia" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Automação com IA</h2>
              <p className="text-xl text-muted-foreground">
                Inteligência artificial para gerenciar sua casa
              </p>
            </div>

            {/* Recursos de IA */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Diagnóstico por Foto</CardTitle>
                  <CardDescription>
                    Tire uma foto do problema e a IA identifica e sugere soluções
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Experimentar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Estimativa de Custos</CardTitle>
                  <CardDescription>
                    IA calcula estimativa precisa de custos de reparos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Experimentar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4">
                    <CheckSquare className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Checklist Automático</CardTitle>
                  <CardDescription>
                    IA gera checklist personalizado baseado na sua casa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Experimentar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center mb-4">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Sugestão de Reformas</CardTitle>
                  <CardDescription>
                    IA analisa sua casa e sugere melhorias com ROI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Experimentar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Planos de Créditos */}
            <div className="max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-8">Pacotes de Créditos</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-xl transition-all">
                  <CardHeader>
                    <CardTitle>50 Créditos</CardTitle>
                    <CardDescription>Para uso ocasional</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">R$ 12,00</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        50 análises de IA
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Válido por 3 meses
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">Comprar</Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-600 hover:shadow-xl transition-all">
                  <CardHeader>
                    <Badge className="w-fit mb-2">Melhor Custo-Benefício</Badge>
                    <CardTitle>200 Créditos</CardTitle>
                    <CardDescription>Para uso regular</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">R$ 29,00</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        200 análises de IA
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Válido por 6 meses
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Economia de 40%
                      </li>
                    </ul>
                    <Button className="w-full">Comprar</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all">
                  <CardHeader>
                    <CardTitle>Ilimitado</CardTitle>
                    <CardDescription>Uso sem limites</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">R$ 49,00<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Análises ilimitadas
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Prioridade no processamento
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Recursos exclusivos
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">Assinar</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Sistema de Leads</h2>
              <p className="text-xl text-muted-foreground">
                Conecte clientes com profissionais qualificados
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Para Profissionais */}
              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Para Profissionais</CardTitle>
                  <CardDescription>Receba leads qualificados de clientes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Leads Qualificados</div>
                        <div className="text-sm text-muted-foreground">Clientes prontos para contratar</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Preço por Lead</div>
                        <div className="text-sm text-muted-foreground">R$ 5 a R$ 20 por lead</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Filtros Personalizados</div>
                        <div className="text-sm text-muted-foreground">Escolha região e tipo de serviço</div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    Começar a Receber Leads
                  </Button>
                </CardContent>
              </Card>

              {/* Para Plataforma */}
              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Monetização de Leads</CardTitle>
                  <CardDescription>Como a plataforma ganha</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Venda de Leads</div>
                        <div className="text-sm text-muted-foreground">Cada lead é vendido para 3-5 profissionais</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Leads Exclusivos</div>
                        <div className="text-sm text-muted-foreground">Profissionais premium podem comprar exclusividade</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Qualificação Automática</div>
                        <div className="text-sm text-muted-foreground">IA qualifica leads antes de vender</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Potencial de receita</div>
                    <div className="text-2xl font-bold text-green-600">R$ 15k - R$ 50k/mês</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exemplos de Leads */}
            <Card className="max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle>Exemplos de Leads Recentes</CardTitle>
                <CardDescription>Veja o tipo de solicitação que você pode receber</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold">Troca de Piso - Sala e Cozinha</h4>
                        <p className="text-sm text-muted-foreground">Zona Sul - SP • Orçamento: R$ 3.000 - R$ 5.000</p>
                      </div>
                      <Badge className="bg-green-500">Qualificado</Badge>
                    </div>
                    <p className="text-sm mb-2">Cliente quer trocar piso de 40m² por porcelanato. Urgência média.</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Valor do lead: R$ 15</span>
                      <span>•</span>
                      <span>3 profissionais interessados</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold">Pintura Externa Completa</h4>
                        <p className="text-sm text-muted-foreground">Zona Oeste - SP • Orçamento: R$ 4.000 - R$ 7.000</p>
                      </div>
                      <Badge className="bg-amber-500">Alta Urgência</Badge>
                    </div>
                    <p className="text-sm mb-2">Casa de 200m² precisa de pintura externa completa. Cliente quer começar em 2 semanas.</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Valor do lead: R$ 20</span>
                      <span>•</span>
                      <span>5 profissionais interessados</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold">Instalação de Ar Condicionado</h4>
                        <p className="text-sm text-muted-foreground">Centro - SP • Orçamento: R$ 1.500 - R$ 2.500</p>
                      </div>
                      <Badge className="bg-green-500">Qualificado</Badge>
                    </div>
                    <p className="text-sm mb-2">Cliente já comprou 2 aparelhos split, precisa apenas de instalação.</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Valor do lead: R$ 10</span>
                      <span>•</span>
                      <span>4 profissionais interessados</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Tab (mantido do original) */}
          <TabsContent value="dashboard" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Urgentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-red-600">{urgentCount}</div>
                    <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
                    <Clock className="w-8 h-8 text-yellow-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-blue-600">{inProgressCount}</div>
                    <Wrench className="w-8 h-8 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Custo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-green-600">
                      R$ {totalCost.toLocaleString('pt-BR')}
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Próximas Manutenções */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Próximas Manutenções
                  </CardTitle>
                  <CardDescription>Tarefas agendadas para os próximos dias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {maintenances
                    .filter(m => m.status !== "concluida")
                    .slice(0, 4)
                    .map((maintenance) => (
                      <div
                        key={maintenance.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{maintenance.title}</h4>
                            <Badge className={getPriorityColor(maintenance.priority)}>
                              {maintenance.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{maintenance.category}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(maintenance.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                            {maintenance.cost && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                R$ {maintenance.cost}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(maintenance.status)}>
                          {getStatusLabel(maintenance.status)}
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Profissionais em Destaque */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Profissionais em Destaque
                  </CardTitle>
                  <CardDescription>Seus contatos mais confiáveis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {professionals.slice(0, 4).map((pro) => (
                      <div
                        key={pro.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
                          {pro.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">{pro.name}</h4>
                            {pro.plan && (
                              <Badge className={getPlanBadgeColor(pro.plan)}>
                                {pro.plan}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{pro.specialty}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {pro.rating}
                          </div>
                          <p className="text-xs text-muted-foreground">{pro.jobs} trabalhos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 HomeCare - Gestão Inteligente de Manutenção Residencial</p>
            <div className="flex items-center gap-4">
              <Button variant="link" className="h-auto p-0">Sobre</Button>
              <Button variant="link" className="h-auto p-0">Suporte</Button>
              <Button 
                variant="link" 
                className="h-auto p-0"
                onClick={() => setActiveTab("planos")}
              >
                Premium
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modais */}
      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Crown className="w-6 h-6 text-amber-500" />
              Seja Premium
            </DialogTitle>
            <DialogDescription>
              Desbloqueie recursos avançados e gerencie sua casa com ainda mais eficiência
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                setIsPremiumModalOpen(false);
                setActiveTab("planos");
              }}
            >
              Ver Planos Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isProfessionalSignupOpen} onOpenChange={setIsProfessionalSignupOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Briefcase className="w-6 h-6 text-green-600" />
              Cadastro de Profissional
            </DialogTitle>
            <DialogDescription>
              Junte-se à nossa rede de profissionais qualificados
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                setIsProfessionalSignupOpen(false);
                setActiveTab("profissionais-pro");
              }}
            >
              Ver Planos para Profissionais
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
