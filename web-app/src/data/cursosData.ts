import type { LucideIcon } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  price: number;
  currency: '$' | '€';
  originalPrice?: number;
  priceLabel?: string;
  tag: string;
  description: string;
  features: string[];
  icon: string;
  href: string;
  popular?: boolean;
  cta: string;
  beta?: boolean;
  free?: boolean;
}

export interface CursosCopy {
  hero: {
    label: string;
    title: string;
    subtitle: string;
  };
  featured: {
    label: string;
    title: string;
    subtitle: string;
  };
  grid: {
    label: string;
    title: string;
    subtitle: string;
  };
  whyLearn: {
    label: string;
    title: string;
    subtitle: string;
    stats: { value: number; suffix: string; label: string }[];
    points: string[];
  };
}

export const courses: Course[] = [
  {
    id: 'creator-lab',
    title: 'Creator Lab',
    price: 450,
    currency: '$',
    priceLabel: ' (3 meses)',
    tag: 'Programa Flagship',
    description:
      'O programa intensivo para quem quer **trabalhar com marcas** de forma estratégica, profissional e consistente. Metodologia prática com aplicação __real no mercado__.',
    features: [
      'Módulo 0: Introdução ao Programa',
      'Módulo 1: Posicionamento Profissional & Fundamentos',
      'Módulo 2: Conteúdo Estratégico & Criação UGC',
      'Módulo 3: Prospeção, Aquisição de Clientes & Estrutura de Negócio',
      'Parcerias reais com marcas (incl. briefings práticos)',
      'Grupo de suporte via WhatsApp',
    ],
    icon: 'Rocket',
    href: 'https://stan.store/bymartadoliveira/p/creator-lab',
    popular: true,
    cta: 'Garantir o Meu Lugar',
  },
  {
    id: 'ugc-coaching',
    title: 'UGC Coaching',
    price: 125,
    currency: '$',
    tag: 'Mentoria Contínua',
    description:
      'Acompanhamento **contínuo e personalizado** para te ajudar a crescer como criadora UGC. Como ter uma __personal trainer do digital__.',
    features: [
      'Calls mensais de alinhamento estratégico',
      'Feedback contínuo em pitches, funis de venda e conteúdo',
      'Acompanhamento próximo e correções em tempo real',
      'Suporte direto por mensagem',
      'Vagas limitadas para manter proximidade',
    ],
    icon: 'Users',
    href: 'https://stan.store/bymartadoliveira/p/ugc-coaching-',
    cta: 'Começar Coaching',
  },
  {
    id: 'consultoria-portfolio',
    title: 'Consultoria de Portfólio',
    price: 50,
    currency: '€',
    tag: 'Sessão 1:1 · BETA',
    beta: true,
    description:
      'Cria ou renova o teu portfólio com **orientação personalizada**. Trabalha diretamente com uma creator ou brand manager para construir um portfólio que __atrai as marcas certas__.',
    features: [
      'Sessão 1:1 via Google Meet (45-60 min)',
      'Revisão ou criação de portfólio do zero',
      'Análise de estrutura, copywriting e direção estratégica',
      'Sugestões práticas de melhoria de conteúdo',
      'PDF com plano de ação personalizado',
      'Bónus: reavaliação opcional após implementação',
    ],
    icon: 'FileSearch',
    href: 'https://stan.store/bymartadoliveira/p/consultoria-de-portflio--beta',
    cta: 'Agendar Sessão',
  },
  {
    id: 'template-prospecao',
    title: 'Template · Prospeção Ativa',
    price: 25,
    currency: '$',
    tag: 'Template Digital',
    description:
      'Prospeção sem stress: o template que te ajuda a ouvir mais __"sim"__. Organização e estratégia para **poupar tempo e fechar deals**.',
    features: [
      'Sistema CRM para organizar contactos e oportunidades',
      'Tracking de KPIs para medir resultados',
      'SOP com instruções passo-a-passo',
      'FAQ com respostas às dúvidas mais comuns',
      'Calendário estratégico para manter consistência',
      'Materiais de apoio e ferramentas úteis',
    ],
    icon: 'LayoutTemplate',
    href: 'https://stan.store/bymartadoliveira/p/template--prospeo-ativa',
    cta: 'Descarregar Agora',
  },
  {
    id: 'auditoria-portfolio',
    title: 'Auditoria de Portfólio',
    price: 20,
    currency: '€',
    tag: 'Relatório Detalhado · BETA',
    beta: true,
    description:
      'Análise detalhada do teu portfólio com a perspetiva de uma **creator UGC experiente** e brand manager. Descobre o que te impede de __atrair parcerias com marcas__.',
    features: [
      'Relatório completo com recomendações personalizadas',
      'Análise de estrutura, copywriting e direção estratégica',
      'Avaliação de apresentação visual e organização',
      'Feedback em vídeo: qualidade, duração, intenção e storytelling',
      'Dicas de otimização para marcas portuguesas e internacionais',
      'Apenas 10 vagas beta disponíveis',
    ],
    icon: 'ClipboardCheck',
    href: 'https://stan.store/bymartadoliveira/p/auditoria-de-portflio--beta',
    cta: 'Pedir Auditoria',
  },
  {
    id: 'discovery-call',
    title: '15 min Discovery Call',
    price: 0,
    currency: '€',
    free: true,
    tag: 'Call Gratuita',
    description:
      'Uma sessão de coaching privada de **15 minutos**. Recebe conselhos específicos para a tua marca, um plano claro para a tua __estratégia de conteúdo UGC__ e respostas a todas as tuas dúvidas.',
    features: [
      'Conselhos específicos para a tua marca e objetivos',
      'Plano claro para a tua estratégia de conteúdo',
      'Respostas a todas as tuas dúvidas',
      'Orientação sobre os próximos passos',
    ],
    icon: 'Phone',
    href: 'https://stan.store/bymartadoliveira/p/15-min-discovery-call-qa81z7n2',
    cta: 'Marcar Call Grátis',
  },
  {
    id: 'newsletter',
    title: 'Newsletter UGC/CGC',
    price: 0,
    currency: '€',
    free: true,
    tag: 'Newsletter Gratuita',
    description:
      'A **primeira newsletter** para Criadores UGC/CGC, Estrategistas e Gestores de Redes. Conteúdo exclusivo sobre __marketing, media e social media__ diretamente no teu email.',
    features: [
      'Conteúdo exclusivo sobre UGC e CGC',
      'Estratégias de marketing e social media',
      'Tendências e insights do mercado',
      'Totalmente gratuita',
    ],
    icon: 'Mail',
    href: 'https://martaoliveiraugc.beehiiv.com/subscribe',
    cta: 'Subscrever Grátis',
  },
];

export const cursosCopy: CursosCopy = {
  hero: {
    label: 'By Marta d\'Oliveira',
    title: 'Aprende a Criar\nConteúdo Que Paga',
    subtitle:
      'Cansada de criar conteúdo que ninguém vê? Aprende a estratégia que atrai marcas, fecha deals e transforma a tua criatividade em receita real.',
  },
  featured: {
    label: 'Programa Flagship',
    title: 'Creator Lab',
    subtitle:
      'O programa **intensivo** para quem quer trabalhar com marcas de forma __estratégica, profissional e consistente__. Não é teoria — é metodologia prática com aplicação real no mercado.',
  },
  grid: {
    label: 'Mais Formações',
    title: 'Encontra o Formato\nCerto Para Ti',
    subtitle:
      'Desde mentoria **contínua** a sessões rápidas — há sempre uma forma de __acelerar__ o teu crescimento.',
  },
  whyLearn: {
    label: 'Porque Aprender Connosco',
    title: 'Resultados Reais,\nNão Promessas Vazias',
    subtitle:
      'A Marta d\'Oliveira já formou dezenas de creators que hoje trabalham com **marcas de referência**. Não é teoria — é __experiência real__ do mercado português e internacional.',
    stats: [
      { value: 50, suffix: '+', label: 'Creators Formados' },
      { value: 200, suffix: '+', label: 'Marcas Parceiras' },
      { value: 98, suffix: '%', label: 'Taxa de Satisfação' },
      { value: 3, suffix: 'x', label: 'ROI Médio dos Alunos' },
    ],
    points: [
      'Formadora com experiência real no mercado',
      'Método testado com resultados comprovados',
      'Comunidade activa de suporte contínuo',
      'Actualizações constantes com as tendências',
    ],
  },
};
