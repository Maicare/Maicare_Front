// components/LanguageSwitcher.tsx
'use client';

import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Check, Languages } from 'lucide-react';
import { cn } from '@/utils/cn';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  ];

  const currentLanguage = languages.find(lang => lang.code === params.locale) || languages[0];

  const switchLanguage = (locale: string) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/');
    segments[1] = locale; // Replace the locale segment
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-10 w-10 p-0 sm:h-9 sm:w-auto sm:px-3",
            "border-2 border-transparent hover:border-blue-200 transition-all duration-200",
            "bg-white/80 backdrop-blur-sm hover:bg-white",
            "shadow-sm hover:shadow-md",
            "text-slate-700 hover:text-slate-900"
          )}
        >
          <Languages className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className={cn(
          "w-56 bg-white/95 backdrop-blur-md",
          "border-2 border-slate-100",
          "shadow-xl rounded-xl"
        )}
      >
        <DropdownMenuLabel className="flex items-center gap-2 text-slate-600 font-semibold">
          <Languages className="h-4 w-4" />
          Select Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100" />
        
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={cn(
              "flex items-center justify-between py-3 px-4",
              "cursor-pointer transition-all duration-200",
              "text-slate-700 hover:text-slate-900",
              "hover:bg-blue-50 rounded-lg mx-2",
              language.code === currentLanguage.code && "bg-blue-50 text-blue-600 font-semibold"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{language.name}</span>
                <span className="text-xs text-slate-500">{language.code.toUpperCase()}</span>
              </div>
            </div>
            
            {language.code === currentLanguage.code && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}