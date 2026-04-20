// Mock data for Str8Global website - Português de Portugal
// Premium copywriting with SEO optimization for Lisboa & Cascais

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
    image?: string;
    tags?: string[];
}

export const projects: Project[] = [
    {
        id: '1',
        title: 'Rádio Popular - AirFryer',
        category: 'Publicidade TV',
        description: 'Campanha publicitária nacional produzida pela nossa agência de marketing em Lisboa. Apetite appeal cinematográfico e dinamismo que geram conversão imediata.',
        image: '/images/portfolio/thumb_airfryer_alt_2s.jpg',
        video: '/videos/portfolio/radio-popular-airfryer.mp4',
        year: '2024',
        client: 'Rádio Popular',
        size: 'large'
    },
    {
        id: '2',
        title: 'Worten Black Friday',
        category: 'Campanha Digital',
        description: 'Produção de vídeo e conteúdo visual para a maior campanha do ano. Energia bruta, movimento e impacto visual que dominaram o feed.',
        image: '/images/portfolio/thumb_worten.jpg',
        video: '/videos/portfolio/worten-black-friday.mp4',
        year: '2024',
        client: 'Worten',
        size: 'normal'
    },
    {
        id: '3',
        title: 'KuantoKusta',
        category: 'Institucional',
        description: 'Vídeo institucional com narrativa cinematográfica. Produção de vídeo profissional que posiciona o comparador líder em Portugal como referência incontestável.',
        image: '/images/portfolio/thumb_kuantokusta.jpg',
        video: '/videos/portfolio/kuantokusta.mp4',
        year: '2025',
        client: 'KuantoKusta',
        size: 'normal'
    },
    {
        id: '4',
        title: 'Cartão Universo',
        category: 'Comercial',
        description: 'Produção lifestyle e urbana para Wowme/Sonae. Fotografia e vídeo profissional que traduzem estatuto e modernidade numa campanha à altura da marca.',
        image: '/images/portfolio/thumb_wells.jpg',
        video: '/videos/portfolio/wowme-cartao-universo.mp4',
        year: '2024',
        client: 'Wowme / Sonae',
        size: 'large'
    },
    {
        id: '5',
        title: 'Weekend of Love',
        category: 'Evento',
        description: 'Aftermovie oficial com qualidade de cinema. Captação da emoção e atmosfera única do festival — o tipo de vídeo que transforma espectadores em bilhetes vendidos.',
        image: '/images/portfolio/thumb_love.jpg',
        video: '/videos/portfolio/weekend-of-love.mp4',
        year: '2024',
        client: 'Festival WoL',
        size: 'tall'
    }
];

export const selectedWorksProjectsData: Project[] = [
    {
        id: 'w1',
        title: 'Ponte 25 de Abril',
        category: 'Fotografia',
        description: '',
        image: '/images/portfolio/ponte.jpg',
        year: '2024',
        client: '',
        size: 'large'
    },
    {
        id: 'w2',
        title: 'Coliseu',
        category: 'Fotografia',
        description: '',
        image: '/images/portfolio/coliseu.jpg',
        year: '2024',
        client: '',
        size: 'normal'
    },
    {
        id: 'w3',
        title: 'Prédios',
        category: 'Fotografia',
        description: '',
        image: '/images/portfolio/predios.jpg',
        year: '2024',
        client: '',
        size: 'tall'
    }
];


export const clients: Client[] = [
    { id: '1', name: 'KuantoKusta', logo: '/logos/Kuantokusta.png' },
    { id: '2', name: 'Mr. Big Evolution', logo: '/logos/MrBig.png' },
    { id: '3', name: 'Cartão Universo', logo: '/logos/Universo.webp' },
    { id: '4', name: 'Worten', logo: '/logos/Worten.png' },
    { id: '5', name: 'Rádio Popular', logo: '/logos/radiopopular.jpg' },
];

export const services: Service[] = [
    {
        id: '1',
        title: 'Estratégia para Redes Sociais',
        description: 'Na STR8, criamos a estratégia para impulsionar o teu próximo lançamento e elevar a tua comunicação ao nível onde os clientes aparecem. Tu trazes a visão, nós damos o **impulso**.',
        icon: 'strategy',
    },
    {
        id: '2',
        title: 'Fotografia de Estúdio',
        description: 'No nosso estúdio, unimos a infinity wall a cenários que mudam contigo para criar imagens que fecham negócios. Quer sejas uma marca ou um indivíduo, elevamos o teu **padrão visual**.',
        icon: 'camera',
    },
    {
        id: '3',
        title: 'Produções Publicitárias',
        description: 'Unimos o nosso estúdio de produção à tua estratégia publicitária para criar conteúdos que ninguém ignora. Se queres resultados mensuráveis, o teu vídeo tem de ser **STR8**.',
        icon: 'video',
    },
    {
        id: '4',
        title: 'Operação Drone',
        description: 'Capturamos imagens aéreas que dão escala e impacto à tua marca, onde outros só veem o óbvio. Do imobiliário a produções publicitárias, elevamos o teu projeto com filmagens de drone de **alta performance**.',
        icon: 'drone',
    },
    {
        id: '5',
        title: 'Fotografia de Produto',
        description: 'O teu produto merece ser visto. Nós garantimos que ele não passe despercebido. Fotografia de produto feita no nosso estúdio para converter olhares em vendas. É direto, é eficaz, é **STR8 to the point**.',
        icon: 'product',
    },
    {
        id: '6',
        title: 'Cobertura de Eventos',
        description: 'Se o teu evento não foi gravado como deve ser, ele não aconteceu. Captamos a força do que criaste com o rigor de uma produção à tua medida. Transformamos o teu evento em conteúdo para que o **impacto continue** muito depois de as luzes se apagarem.',
        icon: 'event',
    },
    {
        id: '7',
        title: 'Podcasts',
        description: 'Cria o teu podcast sem dores de cabeça. Temos o estúdio equipado e decorações que podes adaptar para a tua marca não parecer igual a todas as **outras**.',
        icon: 'podcast',
    },
    {
        id: '8',
        title: 'Gestão de Redes Sociais',
        description: 'Tu focas-te no negócio, nós dominamos o teu feed. Unimos a nossa gestão de redes sociais à produção no nosso estúdio para que o teu conteúdo nunca pareça amador. **Estratégia real** para quem quer liderar o mercado, de Lisboa para o mundo.',
        icon: 'social',
    },
];

export const industries: Industry[] = [
    {
        id: '1',
        title: 'Comércio & Retalho',
        description: 'Usamos o nosso ecossistema de produção para colocar o teu produto num nível onde a concorrência não chega. Não fazemos apenas campanhas; construímos a **autoridade visual** que a tua marca merece.',
        image: '/images/industries/comercial.jpg',
        tags: ['Autoridade Visual', 'Posicionamento', 'Conversão'],
    },
    {
        id: '2',
        title: 'Imobiliário',
        description: 'Imóveis que se vendem sozinhos. Unimos fotografia de alta performance a vídeos que prendem a atenção para destacar as tuas propriedades no mercado. É simples: **melhores imagens, negócios mais rápidos**. É STR8.',
        image: '/images/industries/imobiliaria.jpg',
        tags: ['Alta Performance', 'Fecho Rápido', 'Premium'],
    },
    {
        id: '3',
        title: 'Restauração',
        description: 'Fotos que dão fome. Elevamos o padrão visual do teu restaurante com fotografia gastronómica de elite, feita para quem não quer ser apenas mais um no menu. Tu cozinhas, nós garantimos que o mundo **queira provar**. É STR8.',
        image: '/images/industries/comida2.jpg',
        tags: ['Apetite Visual', 'Desejo Imediato', 'Reservas'],
    },
    {
        id: '4',
        title: 'Marcas Pessoais',
        description: 'Criamos a presença digital que valida a tua autoridade, com conteúdos produzidos para gerar impacto imediato. Elevamos a tua marca pessoal ao nível onde os **convites surgem** e os negócios fecham. Se és o melhor no que fazes, o teu feed tem de o provar.',
        image: '/images/industries/autoridade.jpg',
        tags: ['Autoridade', 'Estatuto', 'Liderança'],
    },
    {
        id: '5',
        title: 'Desporto',
        description: 'Não deixes que o teu talento fique invisível. Cobertura de jogos, lutas e gestão de marca pessoal para quem quer estar no topo. Criamos o conteúdo que te diferencia e atrai os **parceiros certos**. Se queres patrocínios, precisas de ser STR8.',
        image: '/images/industries/esporte.jpg',
        tags: ['Alta Performance', 'Patrocínios', 'Legado Visual'],
    },
    {
        id: '6',
        title: 'Viagens & Experiências',
        description: 'Conteúdo que vende experiências. Elevamos o padrão visual do teu destino para que a decisão do teu cliente seja óbvia. Se queres que o mundo veja o teu projeto com **outros olhos**, o teu visual tem de ser STR8.',
        image: '/images/industries/viagem2.jpg',
        tags: ['Imersão Total', 'Conversão', 'Experiência'],
    },
];

export const stats = [
    { label: 'Projetos Entregues', value: 500, suffix: '+' },
    { label: 'Marcas', value: 200, suffix: '+' },
    { label: 'Anos de Mercado', value: 4, suffix: '+' },
    { label: 'Membros', value: 2, suffix: '' },
];

export const capabilities = [
    'Estratégia de Marca',
    'Identidade Visual Premium',
    'Fotografia Profissional',
    'Produção Cinematográfica',
    'Estúdio de Podcast',
    'Direcção Artística',
    'Marketing Digital',
    'Gestão de Redes Sociais',
];

// Site-wide copy constants — Premium Manifesto Tone + SEO Lisboa & Cascais
export const siteCopy = {
    brand: {
        name: 'Str8Global',
        tagline: 'Agência de Marketing & Creative Studio',
        location: 'Agualva-Cacém — a servir Lisboa e Cascais',
    },
    hero: {
        headline: 'A Tua Marca Merece',
        subheadline: 'Criaste algo incrível, agora o mundo precisa de o ver. Na STR8 Global, tratamos de tudo: do **marketing estratégico** à produção no nosso estúdio. Damos-te as ferramentas e a execução de que precisas para a **tua marca não ser apenas mais uma**.',
        cta: 'Explorar Trabalhos',
        ctaSecondary: 'Falar Connosco',
        rotatingWords: ['Dominar', 'Impressionar', 'Liderar', 'Brilhar'],
    },
    selectedWorks: {
        title: 'Trabalhos de **Assinatura**',
        subtitle: 'Não é estética, é **construção de percepção**. Cada projecto foi pensado para gerar desejo, posicionar marcas e entregar **assets e resultados**.',
    },
    portfolio: {
        title: '**Produções Publicitárias**',
        subtitle: 'Campanhas de vídeo e fotografia publicitária. Conteúdo que capta atenção e gera resultados concretos para marcas.',
    },
    services: {
        title: 'O Ecossistema **Completo**',
        subtitle: '',
    },
    industries: {
        title: 'O teu segmento, a nossa **Experiência**',
        subtitle: '',
    },
    clients: {
        title: 'Marcas que foram **STR8 to the point**',
        subtitle: 'Somos o ecossistema de quem percebeu que estar no digital não é vaidade, é **poder de mercado**.',
    },
    stats: {
        title: 'Resultados **STR8 to the point**',
    },
    capabilities: {
        title: 'O que **construímos**',
        subtitle: 'Do plano à execução, damos à tua marca o **peso que o mercado não pode ignorar**.',
    },
    cta: {
        title: 'Sê STR8 to the Point',
        subtitle: 'Marca uma conversa e percebe o que estás a perder por não estares connosco.',
        button: 'Quero ir STR8 to the point',
    },
    contact: {
        title: 'Fale Connosco',
        email: 'str8global.co@gmail.com',
        phone: '+351 966 128 922',
        location: 'Estrada das Ligeiras, Lote 2, 2735-337 Agualva-Cacém',
        footer: 'Agência de marketing e estúdio de produção a servir Lisboa, Cascais e toda a Grande Lisboa. Projectos internacionais? Também. Diga-nos onde quer dominar.',
        copyright: '© 2024 Str8Global. Todos os direitos reservados.',
    },
    nav: {
        scroll: 'Scroll',
    },
    social: ['Instagram', 'LinkedIn', 'Behance', 'Vimeo'],
};
