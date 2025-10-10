import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Building2, User, FileDigit, Mail,  LocateIcon } from "lucide-react";
import { Contact } from "@/schemas/contact.schema";

interface ContactOverviewCardProps {
  contact: Contact;
}

export function ContactOverviewSection({ contact }: ContactOverviewCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8 bg-white">
      {/* Header with action button */}
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Maak een contract voor {contact.name}
          </CardTitle>
        </div>
      </CardHeader>

      {/* Main contact information */}
      <CardContent className="p-4 grid grid-cols-3 gap-4">
        <div className="space-y-3">
          {/* Company Info */}
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 border border-blue-200 mt-1">
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">{contact.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="bg-purple-50 text-purple-800">
                  {contact.types}
                </Badge>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-3 gap-4 col-span-2">
          {/* Address */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">Addresses: </span>
            <span className="font-medium">{contact.address}, {contact.postal_code} {contact.place}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <LocateIcon className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">Land: </span>
            <span className="font-medium">{contact.land}</span>
          </div>
          {/* Business Details */}
          <div className="flex items-center gap-2 text-sm">
            <FileDigit className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">Klantnummer: </span>
            <span className="font-medium">{contact.client_number}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">KVK: </span>
            <span className="font-medium">{contact.KVKnumber}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">BTW: </span>
            <span className="font-medium">{contact.BTWnumber}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">Telefoon: </span>
            <span className="font-medium">{contact.phone_number}</span>
          </div>
        </div>
      </CardContent>

      {/* Contacts section */}
      <CardFooter className="bg-gray-50 p-4 border-t">
        <div className="w-full">
          <h4 className="font-medium text-sm flex items-center gap-2 mb-3 text-gray-700">
            <User className="h-4 w-4" />
            Contactpersonen ({contact.contacts.length})
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {contact.contacts.map((person, index) => (
              <div key={index} className="flex items-start gap-3 p-2 bg-white rounded border border-gray-100">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarFallback className="bg-gray-100 text-gray-800 text-xs">
                    {getInitials(person.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{person.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{person.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Phone className="h-3 w-3" />
                    <span>{person.phone_number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}