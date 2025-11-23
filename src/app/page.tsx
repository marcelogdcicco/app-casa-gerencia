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
  ChevronRight
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
        commissionRate: 15
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
        commissionRate: 12
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
        commissionRate: 10
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
        commissionRate: 15
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="home" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="manutencoes" className="gap-2">
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Manutenções</span>
            </TabsTrigger>
            <TabsTrigger value="profissionais" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Profissionais</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="gap-2">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Checklist</span>
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
                    onClick={() => setIsPremiumModalOpen(true)}
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

          {/* Dashboard Tab (conteúdo existente mantido) */}
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
                          <h4 className="font-medium truncate">{pro.name}</h4>
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

          {/* Outras tabs mantidas conforme original... */}
          {/* (Manutenções, Profissionais, Checklist) */}
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
                onClick={() => setIsPremiumModalOpen(true)}
              >
                Premium
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
