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
        title: 'Lisboa ao Pôr do Sol',
        category: 'Vídeos Aéreos',
        description: 'Captação aérea com drone da icónica Ponte 25 de Abril ao entardecer. Imagens cinematográficas que mostram Lisboa de uma perspectiva única.',
        image: '/gallery/1.jpg',
        video: '/gallery/v2.mp4',
        year: '2024',
        client: 'Turismo de Lisboa',
    },
    {
        id: '2',
        title: 'Tailândia Milenar',
        category: 'Viagens & Turismo',
        description: 'Documentação fotográfica dos templos históricos de Ayutthaya. Património UNESCO captado com sensibilidade artística.',
        image: '/gallery/2.jpg',
        year: '2024',
        client: 'Travel Magazine',
    },
    {
        id: '3',
        title: 'Wild Moments',
        category: 'Documentário',
        description: 'Série fotográfica de vida selvagem com técnicas de bokeh artístico. Elefantes captados no seu habitat natural.',
        image: '/gallery/6.jpg',
        year: '2024',
        client: 'National Geographic PT',
    },
    {
        id: '4',
        title: 'Studio Sessions',
        category: 'Sessão Fotográfica',
        description: 'Sessão de estúdio profissional com iluminação controlada. Retratos que capturam personalidade e autenticidade.',
        image: '/gallery/14.jpg',
        year: '2024',
        client: 'Clientes Particulares',
    },
    {
        id: '5',
        title: 'Nightlife Lisboa',
        category: 'Cobertura de Eventos',
        description: 'Cobertura fotográfica de eventos e festas com técnicas de motion blur artístico. Atmosfera e energia captadas em cada frame.',
        image: '/gallery/15.jpg',
        year: '2024',
        client: 'Fábrica Oitava',
    },
    {
        id: '6',
        title: 'Golden Hour',
        category: 'Editorial',
        description: 'Sessão editorial ao pôr do sol. Silhuetas e contra-luz que criam atmosferas cinematográficas.',
        image: '/gallery/8.jpg',
        year: '2023',
        client: 'Lifestyle Magazine',
    },
    {
        id: '7',
        title: 'Roma Clássica',
        category: 'Viagens & Turismo',
        description: 'O majestoso Coliseu captado com luz natural perfeita. Arquitectura milenar em todo o seu esplendor.',
        image: '/gallery/3.jpg',
        year: '2023',
        client: 'Wanderlust Magazine',
    },
    {
        id: '8',
        title: 'Costa Portuguesa',
        category: 'Vídeos Aéreos',
        description: 'Vista aérea da costa atlântica portuguesa. Praias, falésias e o encontro dramático entre terra e mar.',
        image: '/gallery/4.jpg',
        video: '/gallery/v3.mp4',
        year: '2023',
        client: 'Turismo de Portugal',
    },
    {
        id: '9',
        title: 'Doha Skyline',
        category: 'Editorial',
        description: 'Sessão editorial dinâmica com o skyline futurista de Doha como cenário. Energia e movimento.',
        image: '/gallery/11.jpg',
        year: '2023',
        client: 'Fashion Week Qatar',
    },
    {
        id: '10',
        title: 'Street Stories',
        category: 'Street Photography',
        description: 'Fotografia de rua em preto e branco. Momentos autênticos captados no metro de Bangkok.',
        image: '/gallery/10.jpg',
        year: '2023',
        client: 'Urban Magazine',
    },
    {
        id: '11',
        title: 'Selvagem',
        category: 'Documentário',
        description: 'Zebra majestosa sob luz dramática. A beleza da vida selvagem africana.',
        image: '/gallery/7.jpg',
        year: '2023',
        client: 'Wildlife Foundation',
    },
    {
        id: '12',
        title: 'Névoa Matinal',
        category: 'Editorial',
        description: 'Sessão artística em ambiente de névoa. Atmosfera misteriosa e cinematográfica.',
        image: '/gallery/19.jpg',
        year: '2023',
        client: 'Arte Magazine',
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
