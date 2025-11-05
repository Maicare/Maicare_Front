'use client';

// components/dynamic-breadcrumb-nl.tsx

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import routeConfigNL from '@/utils/route-config-nl.generated';

const DynamicBreadcrumbNL = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path !== '');
    const breadcrumbs = [];
    
    let currentPath = '';
    
    // Altijd home toevoegen
    breadcrumbs.push({ href: '/', label: '', isLast: paths.length === 0 });
    
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      // Check if this path segment is a UUID
      const isUuid = /^[a-f0-9-]{36}$/.test(path);
      
      if (isUuid) {
        // For UUID segments, use the parent route's label but clean it up
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        const parentRouteKey = generateRouteKey(parentPath);
        const parentLabel = routeConfigNL[parentRouteKey];
        
        if (parentLabel) {
          // Remove the dynamic part from parent label (e.g., "Cliënten / [clientId]" becomes "Cliënt Details")
          const cleanLabel = parentLabel
            .replace(/ \/ \[.*\]$/, '') // Remove "/ [something]" at the end
            .replace(/Cliënten$/, 'Cliënt Details') // Special case for clients
            .replace(/Medewerkers$/, 'Medewerker Details') // Special case for employees
            .replace(/Contacten$/, 'Contact Details') // Special case for contacts
            .replace(/Organisaties$/, 'Organisatie Details') // Special case for organisations
            .replace(/Locaties$/, 'Locatie Details') // Special case for locations
            .replace(/Intake$/, 'Intake Details') // Special case for intake
            .replace(/Registraties$/, 'Registratie Details'); // Special case for registrations
          
          breadcrumbs.push({ 
            href: currentPath, 
            label: cleanLabel, 
            isLast 
          });
        } else {
          // Fallback if parent label not found
          breadcrumbs.push({ 
            href: currentPath, 
            label: 'Details', 
            isLast 
          });
        }
      } else {
        // For non-UUID segments, use the normal route lookup
        const routeKey = generateRouteKey(currentPath);
        const label = routeConfigNL[routeKey] || formatBreadcrumbLabel(path);
        
        breadcrumbs.push({ 
          href: currentPath, 
          label, 
          isLast 
        });
      }
    });

    return breadcrumbs;
  };

  const generateRouteKey = (path: string) => {
    return path.replace(/\/[a-f0-9-]{36}/g, '/[id]'); // Replace UUIDs with [id]
  };

  const formatBreadcrumbLabel = (path: string) => {
    const labelMap: { [key: string]: string } = {
      'create': 'Aanmaken',
      'edit': 'Bewerken',
      'update': 'Bijwerken',
      'new': 'Nieuw',
      'overview': 'Overzicht',
      'appointment-card': 'Afsprakenkaart',
      'care-plan': 'Zorgplan',
      'client-network': 'Client Netwerk',
      'involved-employees': 'Betrokken Medewerkers',
      'medical-record': 'Medisch Dossier',
      'automatic-reports': 'Automatische Rapporten',
      'user-reports': 'Gebruikersrapporten',
      'working-hours': 'Werkuren',
      'certification': 'Certificering',
    };
    
    return labelMap[path] || path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem key={breadcrumb.href} className="hidden md:flex items-center justify-center">
            {breadcrumb.isLast ? (
              <BreadcrumbPage className="text-white">
                {breadcrumb.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={breadcrumb.href} className="text-white hover:underline hover:text-cyan-500">
                {breadcrumb.label}
              </BreadcrumbLink>
            )}
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbNL;