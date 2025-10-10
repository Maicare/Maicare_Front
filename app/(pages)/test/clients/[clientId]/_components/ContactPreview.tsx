import { ArrowRight, PlusCircle, Share2 } from 'lucide-react'
import React from 'react'
import { useEmergencyContact } from '@/hooks/client-network/use-emergency-contact'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ContactPreviewLoader } from './LoadersItems'
import ContactItem from './ContactItem'

type Props = {
    clientId: string;
    isParentLoading: boolean;
}

const ContactPreview = ({ clientId, isParentLoading }: Props) => {
    const { emergencyContacts, isLoading } = useEmergencyContact({ clientId: clientId })
    const router = useRouter();
    
    if (isLoading || isParentLoading) {
        return <ContactPreviewLoader />
    }
    
    if (emergencyContacts?.results.length === 0) {
        return (
            <Card className="w-full h-full border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <Share2 className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg mb-2">Contactpersonen</CardTitle>
                    <CardDescription className="mb-4">
                        Geen noodcontactpersonen gevonden
                    </CardDescription>
                    <Button 
                        onClick={() => router.push(`/clients/${clientId}/client-network/emergency`)}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Contact toevoegen
                    </Button>
                </CardContent>
            </Card>
        )
    }
    
    return (
        <Card className="w-full h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Share2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Contactpersonen</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                            {emergencyContacts?.results.length}
                        </Badge>
                        <Link href={`/clients/${clientId}/client-network/emergency`}>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <span className="text-xs">Alles bekijken</span>
                                <ArrowRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-3 px-6 pb-4">
                    {emergencyContacts?.results.slice(0, 3).map(({ email, first_name, last_name, relationship }, index) => (
                        <ContactItem
                            key={index}
                            email={email}
                            fullName={first_name + " " + last_name}
                            relation={relationship}
                            image='/images/avatar-1.jpg'
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ContactPreview