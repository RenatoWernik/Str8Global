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
        title: 'Luminance',
        category: 'Campanha de Marca',
        description: 'Campanha visual ousada para uma marca de cosmética de luxo, jogando com luz e sombra.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80',
        video: undefined,
        year: '2024',
        client: 'Luminance Beauty',
    },
    {
        id: '2',
        title: 'Urban Flow',
        category: 'Fotografia',
        description: 'Série fotográfica que capta a energia crua da vida nocturna metropolitana.',
        image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80',
        year: '2024',
        client: 'Urban Magazine',
    },
    {
        id: '3',
        title: 'Velocity',
        category: 'Produção de Vídeo',
        description: 'Comercial de alta intensidade para o lançamento de um superdesportivo eléctrico.',
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80',
        video: 'https://player.vimeo.com/external/370331493.hd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=175',
        year: '2024',
        client: 'ElectroDrive Motors',
    },
    {
        id: '4',
        title: 'Noir Sessions',
        category: 'Editorial',
        description: 'Sessão editorial com atmosfera cinematográfica para colecção de inverno.',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80',
        year: '2023',
        client: 'Vogue Portugal',
    },
    {
        id: '5',
        title: 'Chromatic',
        category: 'Identidade Visual',
        description: 'Rebranding completo para uma startup de tecnologia.',
        image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80',
        year: '2023',
        client: 'ChromaTech',
    },
    {
        id: '6',
        title: 'Silent Waves',
        category: 'Documentário',
        description: 'Documentário premiado sobre conservação oceânica.',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80',
        video: 'https://player.vimeo.com/external/449623188.hd.mp4?s=4bae6e49dba35f8bb3ea1d6a2e4f9d1a7b8c5e3d&profile_id=175',
        year: '2023',
        client: 'National Geographic',
    },
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
        location: 'Porto, Portugal',
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
        email: 'hello@str8global.com',
        phone: '+351 912 345 678',
        location: 'Porto, Portugal',
        footer: 'Trabalhamos com marcas em todo o território nacional. Projectos internacionais? Também.',
        copyright: '© 2024 Str8Global. Todos os direitos reservados.',
    },
    nav: {
        scroll: 'Scroll',
    },
    social: ['Instagram', 'LinkedIn', 'Behance', 'Vimeo'],
};
