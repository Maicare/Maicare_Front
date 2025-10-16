'use client';

export const routeConfigNL: { [key: string]: string } = {
  '/': '',
  '/dashboard': 'Dashboard',
  '/calendar': 'Kalender',
  '/clients': 'Cliënten',
  '/clients/[clientId]': 'Cliënt Details',
  '/clients/[clientId]/edit': 'Cliënt Bewerken',
  '/clients/[clientId]/calendar': 'Cliënt Kalender',
  '/clients/[clientId]/care-plan': 'Zorgplan',
  '/clients/[clientId]/care-plan/create': 'Zorgplan Aanmaken',
  '/clients/[clientId]/care-plan/[carePlanId]': 'Zorgplan Details',
  '/clients/[clientId]/client-network': 'Client Netwerk',
  '/clients/[clientId]/emergency': 'Noodgeval',
  '/clients/[clientId]/involved-employees': 'Betrokken Medewerkers',
  '/clients/[clientId]/contract': 'Contracten',
  '/clients/[clientId]/contract/create': 'Contract Aanmaken',
  '/clients/[clientId]/contract/[contractId]': 'Contract Details',
  '/clients/[clientId]/documents': 'Documenten',
  '/clients/[clientId]/goals': 'Doelen',
  '/clients/[clientId]/goals/[assessmentId]': 'Doel Assessment',
  '/clients/[clientId]/goals/[assessmentId]/objectives/[goalId]': 'Doelstellingen',
  '/clients/[clientId]/incidents': 'Incidenten',
  '/clients/[clientId]/incidents/create': 'Incident Aanmaken',
  '/clients/[clientId]/incidents/[incidentId]': 'Incident Details',
  '/clients/[clientId]/medical-record': 'Medisch Dossier',
  '/clients/[clientId]/medical-record/overview': 'Overzicht',
  '/clients/[clientId]/medical-record/create': 'Medische Aantekening Aanmaken',
  '/clients/[clientId]/medical-record/[diagnosisId]': 'Diagnose Details',
  '/clients/[clientId]/reports': 'Rapporten',
  '/clients/[clientId]/reports/automatic-reports': 'Automatische Rapporten',
  '/clients/[clientId]/reports/user-reports': 'Gebruikersrapporten',
  '/clients/[clientId]/reports/new': 'Nieuw Rapport',
  '/contacts': 'Contacten',
  '/contacts/new': 'Nieuw Contact',
  '/contacts/[contactId]': 'Contact Details',
  '/contracts': 'Contracten',
};

// components/dynamic-breadcrumb-nl.tsx

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

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
      
      // Vervang dynamische segments met plaatshouders
      const routeKey = currentPath
        .replace(/\/\d+/g, '/[id]')
        .replace(/\/[a-f0-9-]+/g, '/[id]'); // UUIDs vervangen
      
      const label = routeConfigNL[routeKey] || routeConfigNL[currentPath] || formatBreadcrumbLabel(path);
      
      breadcrumbs.push({ 
        href: currentPath, 
        label, 
        isLast 
      });
    });

    return breadcrumbs;
  };

  const formatBreadcrumbLabel = (path: string) => {
    const labelMap: { [key: string]: string } = {
      'create': 'Aanmaken',
      'edit': 'Bewerken',
      'update': 'Bijwerken',
      'new': 'Nieuw',
      'overview': 'Overzicht',
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