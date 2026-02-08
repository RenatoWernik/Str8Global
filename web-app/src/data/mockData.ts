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

export const projects: Project[] = [
    {
        id: '1',
        title: 'Luminance',
        category: 'Brand Campaign',
        description: 'A bold visual identity campaign for a luxury skincare brand, blending light and shadow.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80',
        video: undefined,
        year: '2024',
        client: 'Luminance Beauty',
    },
    {
        id: '2',
        title: 'Urban Flow',
        category: 'Photography',
        description: 'Street photography series capturing the raw energy of metropolitan nightlife.',
        image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80',
        year: '2024',
        client: 'Urban Magazine',
    },
    {
        id: '3',
        title: 'Velocity',
        category: 'Video Production',
        description: 'High-octane commercial for an electric supercar launch event.',
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80',
        video: 'https://player.vimeo.com/external/370331493.hd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=175',
        year: '2024',
        client: 'ElectroDrive Motors',
    },
    {
        id: '4',
        title: 'Noir Sessions',
        category: 'Editorial',
        description: 'Moody editorial shoot for a high-fashion winter collection.',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80',
        year: '2023',
        client: 'Vogue Italia',
    },
    {
        id: '5',
        title: 'Chromatic',
        category: 'Brand Identity',
        description: 'Complete visual identity overhaul for a tech startup.',
        image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80',
        year: '2023',
        client: 'ChromaTech',
    },
    {
        id: '6',
        title: 'Silent Waves',
        category: 'Documentary',
        description: 'Award-winning short documentary on ocean conservation.',
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

export const capabilities = [
    'Brand Strategy',
    'Visual Identity',
    'Photography',
    'Video Production',
    'Motion Design',
    'Art Direction',
    'Digital Campaigns',
    'Social Media',
];

export const stats = [
    { label: 'Projects Completed', value: 150, suffix: '+' },
    { label: 'Global Clients', value: 45, suffix: '+' },
    { label: 'Awards Won', value: 28, suffix: '' },
    { label: 'Years Experience', value: 12, suffix: '' },
];
