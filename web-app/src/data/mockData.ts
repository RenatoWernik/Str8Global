// Mock data for Str8Global website - Português de Portugal

export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    video?: string;
    year: string;
    client: string;
    size?: string;
}

export interface Client {
    id: string;
    name: string;
    logo: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface Industry {
    id: string;
    title: string;
    description: string;
}

export const projects: Project[] = [
    {
        id: '1',
        title: 'Rádio Popular - AirFryer',
        category: 'Publicidade TV',
        description: 'Campanha publicitária nacional para a Rádio Popular promovendo a nova AirFryer Pizza Pro. Foco em apetite appeal e dinamismo.',
        image: '/images/portfolio/DSC00067.jpg',
        video: '/videos/portfolio/Rádio Popular - AirFryer Pizza Pro.mov',
        year: '2024',
        client: 'Rádio Popular',
        size: 'large'
    },
    {
        id: '2',
        title: 'Worten Black Friday',
        category: 'Campanha Digital',
        description: 'Cobertura e produção de conteúdo para a campanha Black Friday da Worten. Energia, movimento e impacto visual.',
        image: '/images/portfolio/DSC01422.jpg',
        video: '/videos/portfolio/Worten - Black Friday(1).mp4',
        year: '2024',
        client: 'Worten',
        size: 'normal'
    },
    {
        id: '3',
        title: 'KuantoKusta',
        category: 'Institucional',
        description: 'Vídeo institucional destacando a facilidade e economia de usar o comparador de preços líder em Portugal.',
        image: '/images/portfolio/DSC02512.jpg',
        video: '/videos/portfolio/KuantoKusta.mov',
        year: '2025',
        client: 'KuantoKusta',
        size: 'normal'
    },
    {
        id: '4',
        title: 'Cartão Universo',
        category: 'Comercial',
        description: 'Produção para Wowme promovendo o Cartão Universo Wells. Estilo lifestyle e urbano.',
        image: '/images/portfolio/DSC01228.jpg',
        video: '/videos/portfolio/Wowme - Cartão universo Wells.mp4',
        year: '2024',
        client: 'Wowme / Sonae',
        size: 'wide'
    },
    {
        id: '5',
        title: 'Weekend of Love',
        category: 'Evento',
        description: 'Aftermovie oficial do festival Weekend of Love. Captando a emoção e a atmosfera única do evento.',
        image: '/images/portfolio/DSC01640.jpg',
        video: '/videos/portfolio/weekend of love.mov',
        year: '2024',
        client: 'Festival WoL',
        size: 'tall'
    },
    {
        id: '6',
        title: 'Editorial de Moda',
        category: 'Fotografia',
        description: 'Sessão fotográfica editorial em estúdio com foco em texturas e iluminação dramática.',
        image: '/images/portfolio/DSC07833.jpg',
        year: '2023',
        client: 'Privado',
        size: 'normal'
    },
    {
        id: '7',
        title: 'Retrato Corporativo',
        category: 'Fotografia',
        description: 'Sessão de retratos corporativos para executivos de alto nível.',
        image: '/images/portfolio/DSC07649.jpg',
        year: '2024',
        client: 'Corporate',
        size: 'normal'
    }
];


export const clients: Client[] = [
    { id: '1', name: 'Nike', logo: '/logos/nike.svg' },
    { id: '2', name: 'Apple', logo: '/logos/apple.svg' },
    { id: '3', name: 'Google', logo: '/logos/google.svg' },
    { id: '4', name: 'Adidas', logo: '/logos/adidas.svg' },
    { id: '5', name: 'Samsung', logo: '/logos/samsung.svg' },
    { id: '6', name: 'Sony', logo: '/logos/sony.svg' },
    { id: '7', name: 'Mercedes', logo: '/logos/mercedes.svg' },
    { id: '8', name: 'BMW', logo: '/logos/bmw.svg' },
];

export const services: Service[] = [
    {
        id: '1',
        title: 'Estratégia de Conteúdo',
        description: 'Definimos o caminho. Analisamos o seu mercado, identificamos oportunidades e criamos um plano de conteúdo que alinha a sua marca com os objectivos de negócio.',
        icon: 'strategy',
    },
    {
        id: '2',
        title: 'Sessões Fotográficas',
        description: 'Fotografia profissional para marcas, produtos e pessoas. Sessões em estúdio ou em localização, com direcção artística incluída.',
        icon: 'camera',
    },
    {
        id: '3',
        title: 'Produção de Vídeo',
        description: 'Vídeos institucionais, promocionais e para redes sociais. Da pré-produção à entrega final, tratamos de tudo.',
        icon: 'video',
    },
    {
        id: '4',
        title: 'Vídeos Aéreos',
        description: 'Imagens aéreas com drone para imobiliário, turismo, eventos e campanhas publicitárias. Perspectivas únicas.',
        icon: 'drone',
    },
    {
        id: '5',
        title: 'Fotografia de Produto',
        description: 'Fotografias de produto para e-commerce, catálogos e campanhas. Iluminação profissional, fundo limpo ou lifestyle.',
        icon: 'product',
    },
    {
        id: '6',
        title: 'Cobertura de Eventos',
        description: 'Fotografia e vídeo de eventos corporativos, conferências, lançamentos e activações de marca.',
        icon: 'event',
    },
    {
        id: '7',
        title: 'Podcasts',
        description: 'Produção completa de podcasts: gravação, edição áudio, vídeo e distribuição. Conteúdo de autoridade com consistência.',
        icon: 'podcast',
    },
    {
        id: '8',
        title: 'Gestão de Redes Sociais',
        description: 'Planeamento, criação de conteúdo e gestão de comunidades. Estratégia integrada para Instagram, LinkedIn e TikTok.',
        icon: 'social',
    },
];

export const industries: Industry[] = [
    {
        id: '1',
        title: 'Desporto',
        description: 'Captamos a intensidade, a emoção e a performance. Conteúdo para clubes, atletas e marcas desportivas.',
    },
    {
        id: '2',
        title: 'Restauração',
        description: 'Fotografia gastronómica, vídeos de ambiente e gestão de redes sociais para restaurantes e hotelaria.',
    },
    {
        id: '3',
        title: 'Viagens & Turismo',
        description: 'Conteúdo visual que inspira. Trabalhamos com hotéis, operadores turísticos e destinos.',
    },
    {
        id: '4',
        title: 'Comercial & Retalho',
        description: 'Campanhas para marcas de consumo, lançamentos de produto e activações de ponto de venda.',
    },
    {
        id: '5',
        title: 'Imobiliário',
        description: 'Fotografia, vídeo e drone para promoção de imóveis. Conteúdo que acelera vendas.',
    },
    {
        id: '6',
        title: 'Marcas Pessoais',
        description: 'Conteúdo para empreendedores, speakers e profissionais que querem construir autoridade online.',
    },
];

export const stats = [
    { label: 'Projectos Concluídos', value: 150, suffix: '+' },
    { label: 'Clientes em Portugal', value: 45, suffix: '+' },
    { label: 'Prémios e Reconhecimentos', value: 28, suffix: '' },
    { label: 'Anos de Experiência', value: 12, suffix: '' },
];

export const capabilities = [
    'Estratégia de Conteúdo',
    'Identidade Visual',
    'Fotografia',
    'Produção de Vídeo',
    'Motion Design',
    'Direcção Artística',
    'Campanhas Digitais',
    'Redes Sociais',
];

// Site-wide copy constants
export const siteCopy = {
    brand: {
        name: 'Str8Global',
        tagline: 'Agência de Marketing & Fotografia',
        location: 'Lisboa, Portugal',
    },
    hero: {
        headline: 'Criamos Conteúdo Que Converte.',
        subheadline: 'Somos uma agência de marketing e fotografia em Portugal. Desenvolvemos estratégia de conteúdo, produzimos vídeo e fotografia premium, e ajudamos marcas a destacar-se.',
        cta: 'Ver Trabalhos',
        ctaSecondary: 'Falar Connosco',
        rotatingWords: ['Visuais', 'Histórias', 'Marcas', 'Resultados'],
    },
    selectedWorks: {
        title: 'Trabalhos Seleccionados',
        subtitle: 'Uma selecção dos nossos projectos mais representativos.',
    },
    portfolio: {
        title: 'Todos os Projectos',
        subtitle: 'Explore o nosso portfólio completo.',
    },
    services: {
        title: 'O Que Fazemos',
        subtitle: 'Serviços de marketing, fotografia e vídeo adaptados às necessidades do seu negócio.',
    },
    industries: {
        title: 'Indústrias Que Servimos',
        subtitle: 'Trabalhamos com sectores diversos. Cada indústria tem as suas particularidades — adaptamos estratégia e execução.',
    },
    clients: {
        title: 'Marcas Que Confiam em Nós',
        subtitle: 'Trabalhamos com empresas de todas as dimensões — de startups a marcas estabelecidas.',
    },
    stats: {
        title: 'Resultados Que Falam',
    },
    capabilities: {
        title: 'O Que Fazemos',
        subtitle: 'De estratégia a execução, criamos experiências visuais completas que elevam marcas e cativam audiências.',
    },
    cta: {
        title: 'Vamos Criar Juntos',
        subtitle: 'Tem um projecto em mente? Fale connosco. Respondemos em menos de 24 horas.',
        button: 'Pedir Proposta',
    },
    contact: {
        title: 'Entre em Contacto',
        email: 'renatowernik9@gmail.com',
        phone: '+351 123456789',
        location: 'Lisboa, Portugal',
        footer: 'Trabalhamos com marcas em todo o território nacional. Projectos internacionais? Também.',
        copyright: '© 2024 Str8Global. Todos os direitos reservados.',
    },
    nav: {
        scroll: 'Scroll',
    },
    social: ['Instagram', 'LinkedIn', 'Behance', 'Vimeo'],
};
