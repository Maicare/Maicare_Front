// lib/i18n/locales/en.ts
export default {
  // Common UI texts
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    search: 'Search...',
  },
  
  // Navigation
  nav: {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
  },
  
  // Pages
  home: {
    title: 'Welcome to Our App',
    subtitle: 'Built with Next.js, Tailwind, and shadcn/ui',
    cta: 'Get Started',
  },
  
  // Form labels (for shadcn form components)
  forms: {
    email: 'Email Address',
    password: 'Password',
    username: 'Username',
    submit: 'Submit',
  },
} as const;