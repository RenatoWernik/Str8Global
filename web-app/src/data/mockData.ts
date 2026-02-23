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
        video: '/videos/portfolio/Rádio Popular - AirFryer Pizza Pro.mov',
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
        video: '/videos/portfolio/Worten - Black Friday(1).mp4',
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
        video: '/videos/portfolio/KuantoKusta.mov',
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
        video: '/videos/portfolio/Wowme - Cartão universo Wells.mp4',
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
        video: '/videos/portfolio/weekend of love.mov',
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
        title: 'Estratégia Visual',
        description: 'O seu projecto é brilhante. A culpa de não ter **resultados à altura** não é sua — é de uma estratégia visual que simplesmente __não existe__. Nós criamos a engenharia exacta para a sua marca ~~dominar a percepção~~ do mercado em Lisboa, Cascais e além.',
        icon: 'strategy',
    },
    {
        id: '2',
        title: 'Fotografia Premium',
        description: 'O seu negócio merece imagens que transmitam o **estatuto que já tem**. Estúdio de fotografia profissional em Lisboa que transforma percepção em __desejo imediato__ — o tipo de imagem que fecha negócios antes da primeira palavra.',
        icon: 'camera',
    },
    {
        id: '3',
        title: 'Cinematografia',
        description: 'A sua história merece **qualidade de cinema**, não de amador. Produção de vídeo profissional em Lisboa e Cascais — narrativas cinematográficas que __prendem, emocionam e convertem__ em resultados mensuráveis.',
        icon: 'video',
    },
    {
        id: '4',
        title: 'Operação Drone',
        description: 'Enquanto o mercado olha em frente, nós **capturamos de cima**. Filmagens aéreas com drone em Portugal que dão ao seu projecto uma __dimensão épica__ que a concorrência simplesmente não consegue replicar.',
        icon: 'drone',
    },
    {
        id: '5',
        title: 'Visuais de Produto',
        description: 'O seu produto é excepcional — mas o ecrã __não mostra isso__. Fotografia de produto premium em Lisboa que eleva cada artigo a **objecto de cobiça imediata**. O tipo de imagem que faz o scroll parar e o cartão sair.',
        icon: 'product',
    },
    {
        id: '6',
        title: 'Cobertura de Eventos',
        description: 'Eventos extraordinários merecem **cobertura à altura**. Captamos a energia, a emoção e os momentos que definem o seu evento em Lisboa ou Cascais — com __nível de cinema__, para que o impacto dure além do último aplauso.',
        icon: 'event',
    },
    {
        id: '7',
        title: 'Estúdio & Podcast',
        description: 'O seu conhecimento merece um __palco profissional__. Estúdio de podcast e gravação em Lisboa com **qualidade broadcast** — para que quando falar, o seu ~~nicho inteiro pare~~ para ouvir.',
        icon: 'podcast',
    },
    {
        id: '8',
        title: 'Gestão de Redes Sociais',
        description: 'A culpa de não ter engagement não é sua — é do **ruído de amadores** que infesta o feed. Gestão de redes sociais em Lisboa e Cascais com precisão cirúrgica para posicionar a sua marca como a __referência absoluta__ do sector.',
        icon: 'social',
    },
];

export const industries: Industry[] = [
    {
        id: '1',
        title: 'Desporto',
        description: 'O seu atleta ou clube já é extraordinário. O problema? O mundo ainda **não vê** isso. Captamos a intensidade bruta e a grandeza real da alta performance — para que o visual da sua marca desportiva finalmente __reflicta a excelência__ que existe dentro de campo.',
        image: '/images/industries/esporte.jpg',
        tags: ['Alta Performance', 'Emoção', 'Legado Visual'],
    },
    {
        id: '2',
        title: 'Restauração',
        description: 'A sua cozinha é brilhante — mas as fotos __não contam essa história__. Um prato excepcional com visuais medíocres é **receita perdida todos os dias**. Fotografia gastronómica premium em Lisboa e Cascais que transforma pratos em ~~objectos de desejo~~ irresistível.',
        image: '/images/industries/comida2.jpg',
        tags: ['Apetite Visual', 'Desejo Imediato', 'Reservas'],
    },
    {
        id: '3',
        title: 'Viagens & Turismo',
        description: 'O seu destino é incrível — o problema é que **as imagens não transmitem** essa magia. Criamos visuais tão imersivos que a única reacção do seu cliente será: "__Onde faço a reserva?__" Produção de conteúdo turístico em Portugal que transforma curiosidade em bilhetes vendidos.',
        image: '/images/industries/viagem2.jpg',
        tags: ['Imersão Total', 'Conversão', 'Experiência'],
    },
    {
        id: '4',
        title: 'Comercial & Retalho',
        description: 'O seu produto é superior — mas no meio do **ruído visual do retalho**, quem comunica mal é invisível. As nossas campanhas de marketing visual posicionam a sua marca como a __única escolha lógica__ no ponto de venda. O resto torna-se paisagem.',
        image: '/images/industries/comercial.jpg',
        tags: ['Destaque', 'Posicionamento', 'Conversão'],
    },
    {
        id: '5',
        title: 'Imobiliário',
        description: 'Antes do primeiro "Olá", os compradores **já decidiram pela fotografia**. O seu imóvel vale mais do que as imagens actuais mostram. Fotografia imobiliária profissional em Lisboa e Cascais que traduz o __verdadeiro valor__ de cada propriedade — e ~~acelera o fecho~~.',
        image: '/images/industries/imobiliaria.jpg',
        tags: ['Valor Percebido', 'Fecho Rápido', 'Premium'],
    },
    {
        id: '6',
        title: 'Marcas Pessoais',
        description: 'Você já é a referência — o problema é que o **seu visual digital ainda não sabe** disso. Autoridade não se proclama, __transmite-se__. Construímos a presença visual que reflecte quem já é: o ~~líder incontestável~~ do seu sector.',
        image: '/images/industries/autoridade.jpg',
        tags: ['Autoridade', 'Estatuto', 'Liderança'],
    },
];

export const stats = [
    { label: 'Projectos Entregues', value: 150, suffix: '+' },
    { label: 'Marcas Aceleradas', value: 45, suffix: '+' },
    { label: 'Reconhecimentos', value: 28, suffix: '' },
    { label: 'Anos de Mercado', value: 12, suffix: '' },
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
        tagline: 'Agência de Marketing & Produção Visual Premium — Lisboa e Cascais',
        location: 'Agualva-Cacém — a servir Lisboa e Cascais',
    },
    hero: {
        headline: 'A Sua Marca Merece',
        subheadline: 'A sua mente construiu algo brilhante. O problema nunca foi o seu projecto — foi o **ecossistema à volta** que não o acompanha. Agência de marketing, estúdio de fotografia e produção de vídeo em Lisboa e Cascais para marcas que merecem __dominar__ — não competir.',
        cta: 'Explorar Trabalhos',
        ctaSecondary: 'Falar Connosco',
        rotatingWords: ['Dominar', 'Impressionar', 'Liderar', 'Brilhar'],
    },
    selectedWorks: {
        title: 'Trabalhos Com **Assinatura**',
        subtitle: 'Não é estética — é **construção de percepção**. Cada projecto aqui foi arquitectado para gerar desejo, posicionar marcas e entregar __resultados que se medem em receita__.',
    },
    portfolio: {
        title: '**Produções**',
        subtitle: 'Campanhas de vídeo e fotografia publicitária produzidas em Lisboa e Cascais. Conteúdo que captura atenção e gera resultados concretos para marcas em Portugal.',
    },
    services: {
        title: 'O Ecossistema **Completo**',
        subtitle: 'O ruído do mercado não é culpa sua. Nós **removemos todo o atrito** técnico e operacional para que só tenha de fazer uma coisa: __focar-se no seu génio__.',
    },
    industries: {
        title: 'A Sua Arena. A Nossa **Engenharia**.',
        subtitle: 'Independentemente do sector, o objectivo é o mesmo: que o seu cliente **escolha você instintivamente**, antes de sequer considerar alternativas.',
    },
    clients: {
        title: 'Marcas Que **Aceleraram** Connosco',
        subtitle: 'Líderes de mercado e visionários que **recusaram o medíocre** e escolheram um ecossistema __à altura da sua ambição__.',
    },
    stats: {
        title: 'Resultados Que **Falam**',
    },
    capabilities: {
        title: 'O Que **Construímos**',
        subtitle: 'Da estratégia à **execução impecável**. Cada competência foi afinada em estúdio e em campo para uma única missão: colocar a sua marca na posição que __sempre mereceu__.',
    },
    cta: {
        title: 'Pare de Perder Terreno',
        subtitle: 'Cada dia sem o ecossistema certo é um dia que a concorrência **ganha vantagem**. Marque uma conversa — sem custos, sem compromisso — e descubra o que está a deixar na mesa.',
        button: 'Quero o Meu Palco',
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
