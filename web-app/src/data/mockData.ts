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
    image?: string;
    tags?: string[];
}

export const projects: Project[] = [
    {
        id: '1',
        title: 'Rádio Popular - AirFryer',
        category: 'Publicidade TV',
        description: 'Campanha publicitária nacional para a Rádio Popular promovendo a nova AirFryer Pizza Pro. Foco em apetite appeal e dinamismo.',
        image: '/images/portfolio/thumb_airfryer_alt_2s.jpg',
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
        image: '/images/portfolio/thumb_worten.jpg',
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
        image: '/images/portfolio/thumb_kuantokusta.jpg',
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
        image: '/images/portfolio/thumb_wells.jpg',
        video: '/videos/portfolio/Wowme - Cartão universo Wells.mp4',
        year: '2024',
        client: 'Wowme / Sonae',
        size: 'large'
    },
    {
        id: '5',
        title: 'Weekend of Love',
        category: 'Evento',
        description: 'Aftermovie oficial do festival Weekend of Love. Captando a emoção e a atmosfera única do evento.',
        image: '/images/portfolio/thumb_love.jpg',
        video: '/videos/portfolio/weekend of love.mov',
        year: '2024',
        client: 'Festival WoL',
        size: 'tall'
    }
];

export const selectedWorksProjectsData: Project[] = [
    {
        id: 'w1',
        title: 'Coliseu',
        category: 'Fotografia',
        description: '',
        image: '/images/portfolio/coliseu.jpg',
        year: '2024',
        client: '',
        size: 'large'
    },
    {
        id: 'w2',
        title: 'Ponte 25 de Abril',
        category: 'Fotografia',
        description: '',
        image: '/images/portfolio/ponte.jpg',
        year: '2024',
        client: '',
        size: 'normal'
    },
    {
        id: 'w3',
        title: 'Costa',
        category: 'Fotografia',
        description: '',
        image: '/images/portfolio/costa.jpg',
        year: '2024',
        client: '',
        size: 'normal'
    },
    {
        id: 'w4',
        title: 'Costa 2',
        category: 'Fotografia',
        description: '',
        image: '/images/portfolio/costa2.jpg',
        year: '2024',
        client: '',
        size: 'large'
    },
    {
        id: 'w5',
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
        title: 'Estratégia Visual',
        description: 'Publicar sem estratégia é como **atirar no escuro** e rezar. Nós construímos o plano exacto para a sua marca **dominar a percepção** do mercado — antes sequer da primeira câmara disparar.',
        icon: 'strategy',
    },
    {
        id: '2',
        title: 'Fotografia Premium',
        description: 'Fotos medíocres **custam-lhe vendas** todos os dias e nem percebe. Criamos imagens que transmitem **valor, autoridade** e provocam um desejo impossível de ignorar.',
        icon: 'camera',
    },
    {
        id: '3',
        title: 'Cinematografia',
        description: 'Pergunta honesta: o seu vídeo actual **vende ou apenas consome orçamento**? Produzimos narrativas cinematográficas feitas para **prender a atenção e converter** — não para encher portfólio.',
        icon: 'video',
    },
    {
        id: '4',
        title: 'Operação Drone',
        description: 'Enquanto a concorrência olha em frente, nós **filmamos de cima**. Perspectivas aéreas épicas que dão às suas campanhas uma **dimensão que ninguém** no seu sector consegue copiar.',
        icon: 'drone',
    },
    {
        id: '5',
        title: 'Visuais de Produto',
        description: 'Um e-commerce sem visual premium é uma **loja invisível**. Ponto. Elevamos os seus produtos a objectos de **cobiça imediata** — o tipo de imagem que faz o scroll parar.',
        icon: 'product',
    },
    {
        id: '6',
        title: 'Cobertura Exclusiva',
        description: 'Se o evento aconteceu mas a cobertura visual foi fraca, **ninguém o vai lembrar** amanhã. Nós imortalizamos os momentos que importam — com **nível de cinema**, não de telemóvel.',
        icon: 'event',
    },
    {
        id: '7',
        title: 'Estúdio & Podcasting',
        description: 'Não seja mais uma voz no meio do **ruído digital**. Estrutura profissional de topo para garantir que quando falar, o seu **nicho inteiro pára** para ouvir.',
        icon: 'podcast',
    },
    {
        id: '8',
        title: 'Domínio Social',
        description: 'O tempo de publicar por publicar **acabou ontem**. Conteúdo desenhado com precisão cirúrgica para posicionar a sua marca como a **única escolha lógica** no feed.',
        icon: 'social',
    },
];

export const industries: Industry[] = [
    {
        id: '1',
        title: 'Desporto',
        description: 'Ganhar não chega — é preciso que o **mundo veja o espectáculo**. Captamos a intensidade bruta e a emoção real da alta performance. A pergunta é: o visual da sua marca desportiva já **inspira grandeza**, ou só preenche espaço?',
        image: '/images/industries/esporte.jpg',
        tags: ['Performance', 'Emoção', 'Legado'],
    },
    {
        id: '2',
        title: 'Restauração',
        description: 'Comemos com os olhos primeiro — isto não é novidade. O que é novidade é o **seu concorrente já ter percebido** isso. Um prato incrível com fotos fracas é **dinheiro que foge** pela porta. A presença digital do seu espaço faz jus ao que sai da cozinha?',
        image: '/images/industries/comida2.jpg',
        tags: ['Apetite Visual', 'Desejo Imediato', 'Conversão'],
    },
    {
        id: '3',
        title: 'Viagens & Turismo',
        description: 'Não vendemos destinos — vendemos o **impulso irreprimível** de lá estar. Criamos visuais tão imersivos que a única reacção do seu cliente será: "Onde é que **faço a reserva**?" Se os seus conteúdos não provocam isso, temos um problema para resolver.',
        image: '/images/industries/viagem2.jpg',
        tags: ['Imersão Total', 'Reserva Imediata', 'Impulso'],
    },
    {
        id: '4',
        title: 'Comercial & Retalho',
        description: 'No meio do ruído ensurdecedor do consumo, o seu produto sussurra ou **dita as regras**? As nossas campanhas rompem o trivial para posicionar a sua marca como a **única escolha lógica** no ponto de venda. Tudo o resto torna-se ruído de fundo.',
        image: '/images/industries/comercial.jpg',
        tags: ['Destaque Total', 'Dominância', 'Conversão'],
    },
    {
        id: '5',
        title: 'Imobiliário',
        description: 'Antes do primeiro "Olá", os compradores **já decidiram pela fotografia**. Leia isso outra vez. A sua imagem actual transmite o verdadeiro valor do imóvel, ou está a **perder milhares** em cada negócio por falta de percepção visual?',
        image: '/images/industries/imobiliaria.jpg',
        tags: ['Valor Percebido', 'Fecho Rápido', 'Impacto'],
    },
    {
        id: '6',
        title: 'Marcas Pessoais',
        description: 'Autoridade não se proclama — **transmite-se**. Quem não constrói um legado digital forte, simplesmente **não será a referência** do seu sector. Pergunta incómoda: o seu visual online reflecte quem já é, ou quem costumava ser?',
        image: '/images/industries/autoridade.jpg',
        tags: ['Autoridade', 'Estatuto', 'Referência'],
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
        subheadline: 'A maioria das agências promete "conteúdo premium". Nós entregamos **resultados que se medem em vendas**, não em likes. Estratégia, vídeo e fotografia para marcas que querem **dominar** — não participar.',
        cta: 'Ver Trabalhos',
        ctaSecondary: 'Falar Connosco',
        rotatingWords: ['Impacto', 'Desejo', 'Domínio', 'Resultados'],
    },
    selectedWorks: {
        title: 'Trabalhos Com Assinatura',
        subtitle: 'Mais do que estética. Narrativas visuais magnéticas que prendem a atenção, despertam desejo e geram **impacto real**. Cada projecto aqui **vendeu** — não apenas decorou.',
    },
    portfolio: {
        title: 'Publicidades',
        subtitle: 'Campanhas visuais que agarram a atenção e geram resultados concretos.',
    },
    services: {
        title: 'O Seu Arsenal Digital',
        subtitle: 'Enquanto a concorrência publica por publicar, nós construímos **armas visuais de precisão cirúrgica**. Escolha as suas — ou fique a ver os outros usar as deles.',
    },
    industries: {
        title: 'O Seu Sector. As Nossas Regras.',
        subtitle: 'Não interessa a arena — o objectivo é o mesmo: que o seu cliente **escolha você antes** de sequer considerar o resto. Pronto para deixar de ser "mais um"?',
    },
    clients: {
        title: 'Eles Já Escolheram',
        subtitle: 'De startups a líderes de mercado — quem quer **resultados**, acaba sempre por bater à nossa porta.',
    },
    stats: {
        title: 'Números Que Não Mentem',
    },
    capabilities: {
        title: 'O Que Dominamos',
        subtitle: 'Da ideia à **execução brutal**. Cada competência que vê aqui foi afinada para fazer uma coisa: colocar a sua marca **acima de tudo o resto**.',
    },
    cta: {
        title: 'O Próximo Passo É Seu',
        subtitle: 'Ou continua a **perder terreno** para a concorrência, ou marca uma conversa connosco. Respondemos em menos de 24h. Sem compromisso. **Sem bullshit**.',
        button: 'Quero Dominar',
    },
    contact: {
        title: 'Entre em Contacto',
        email: 'renatowernik9@gmail.com',
        phone: '+351 123456789',
        location: 'Lisboa, Portugal',
        footer: 'Todo o território nacional. Projectos internacionais? Também. Diga-nos onde quer dominar.',
        copyright: '© 2024 Str8Global. Todos os direitos reservados.',
    },
    nav: {
        scroll: 'Scroll',
    },
    social: ['Instagram', 'LinkedIn', 'Behance', 'Vimeo'],
};
