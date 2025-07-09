"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Building, Clipboard, FileText, Calendar, Edit, Globe, Hash, User } from "lucide-react"
import { Contact } from "@/schemas/contact.schema"
import { useRouter } from "next/navigation";

export function ContactOverview({ contact }: { contact: Contact }) {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const typeStyles = {
    main_provider: { 
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      text: "text-blue-100",
      border: "border-blue-400"
    },
    local_authority: { 
      bg: "bg-gradient-to-r from-purple-500 to-purple-600",
      text: "text-purple-100",
      border: "border-purple-400"
    },
    particular_party: { 
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      text: "text-green-100",
      border: "border-green-400"
    },
    healthcare_institution: { 
      bg: "bg-gradient-to-r from-pink-500 to-pink-600",
      text: "text-pink-100",
      border: "border-pink-400"
    },
  }

  const currentTypeStyle = typeStyles[contact.types]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Add toast notification here if needed
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Background */}
      <div className={`rounded-xl p-6 ${currentTypeStyle.bg} text-white shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarFallback className={`text-3xl ${currentTypeStyle.text} bg-white/20`}>
                {contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">{contact.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className={`${currentTypeStyle.border} bg-white/10 backdrop-blur-sm`}>
                  <Building className="h-4 w-4 mr-1" />
                  {contact.client_number}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-white/30">
                  <Hash className="h-4 w-4 mr-1" />
                  ID: {contact.id}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm" onClick={()=>router.push(`/contacts/${contact.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Organization Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Organization Card */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
              <CardTitle className="flex items-center text-gray-800">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Hash className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">KVK Number</p>
                    <div className="flex items-center">
                      <p className="font-mono font-medium">{contact.KVKnumber}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-2 text-blue-500 hover:text-blue-600"
                        onClick={() => copyToClipboard(contact.KVKnumber)}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Hash className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">BTW Number</p>
                    <div className="flex items-center">
                      <p className="font-mono font-medium">{contact.BTWnumber}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-2 text-green-500 hover:text-green-600"
                        onClick={() => copyToClipboard(contact.BTWnumber)}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Main Phone</p>
                    <p className="font-medium">{contact.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="font-medium">{formatDate(contact.created_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Persons Section */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
              <CardTitle className="flex items-center text-gray-800">
                <User className="h-5 w-5 mr-2 text-pink-600" />
                Contact Persons
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {contact.contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 rounded-lg bg-gray-50">
                  No contact persons added
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contact.contacts.map((person, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${index % 2 === 0 ? 'bg-blue-50 border-blue-100' : 'bg-pink-50 border-pink-100'}`}>
                      <div className="flex items-center space-x-3">
                        <Avatar className={`${index % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{person.name}</p>
                          <p className="text-sm text-gray-500">Contact #{index + 1}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mt-3">
                        <div className="flex items-center space-x-2">
                          <Mail className={`h-4 w-4 ${index % 2 === 0 ? 'text-blue-500' : 'text-pink-500'}`} />
                          <p className="text-sm">{person.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className={`h-4 w-4 ${index % 2 === 0 ? 'text-blue-500' : 'text-pink-500'}`} />
                          <p className="text-sm">{person.phone_number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Address and Metadata */}
        <div className="space-y-6">
          {/* Address Card */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
              <CardTitle className="flex items-center text-gray-800">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-100 rounded-full mt-1">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.address}</p>
                    <p className="text-gray-600">{contact.postal_code} {contact.place}</p>
                    <div className="flex items-center mt-2">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-sm text-gray-600">{contact.land}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden">
                  {/* Replace with your actual map component or iframe */}
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 h-48 flex items-center justify-center text-gray-500">
                    <MapPin className="h-8 w-8 text-red-400" />
                    <span className="ml-2">Map View</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
              <CardTitle className="flex items-center text-gray-800">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(contact.updated_at)}</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-blue-600">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="text-green-600">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}