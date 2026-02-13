// Navigation data for Str8Global website

export interface NavItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  handle?: string;
}

export interface ContactInfo {
  email: string;
  whatsapp: { name: string; number: string; display: string }[];
  location: string;
  instagram: { label: string; handle: string; href: string }[];
}

// Main navigation links
export const mainNav: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
  { id: 'cursos', label: 'Cursos', href: '/cursos' },
  { id: 'espaco', label: 'Espaço', href: '/espaco' },
  { id: 'aluguel', label: 'Aluguel', href: '/aluguel' },
  { id: 'servicos', label: 'Serviços', href: '/servicos' },
];

// Footer navigation (main + contact anchor)
export const footerNav: NavItem[] = [
  ...mainNav,
  { id: 'contacto', label: 'Contacto', href: '/#contacto' },
];

// Social links
export const socialLinks: SocialLink[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/str8global.co', handle: '@str8global.co' },
  { id: 'instagram-lab', label: 'Str8 Lab', href: 'https://instagram.com/str8.lab', handle: '@str8.lab' },
  { id: 'instagram-sports', label: 'Str8 Sports', href: 'https://instagram.com/str8sports.co', handle: '@str8sports.co' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/str8global' },
  { id: 'behance', label: 'Behance', href: 'https://behance.net/str8global' },
  { id: 'vimeo', label: 'Vimeo', href: 'https://vimeo.com/str8global' },
];

// Contact info
export const contactInfo: ContactInfo = {
  email: 'str8global.co@gmail.com',
  whatsapp: [
    { name: 'Igor', number: '351966128922', display: '+351 966 128 922' },
    { name: 'Marta', number: '351933029438', display: '+351 933 029 438' },
  ],
  location: 'Lisboa, Portugal',
  instagram: [
    { label: 'Igor', handle: '@igoracfilipe', href: 'https://instagram.com/igoracfilipe' },
    { label: 'Marta', handle: '@martadoliveiraa', href: 'https://instagram.com/martadoliveiraa' },
  ],
};
