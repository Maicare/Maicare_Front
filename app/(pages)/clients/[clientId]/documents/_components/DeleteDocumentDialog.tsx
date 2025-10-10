import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash } from 'lucide-react'
import React from 'react'

type Props = {
    handleConfirm: (id: string) => void;
    id: string;
}

const DeleteDocumentDialog = ({ handleConfirm, id }: Props) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-red-200 text-red-600 hover:bg-red-500 hover:text-white transition-colors">
                    <Trash className="h-4 w-4" />
                    Verwijderen
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex flex-col gap-2 items-center">
                        <span className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
                            <AlertTriangle className="text-red-600 h-8 w-8" />
                        </span>
                        <span className="text-lg font-semibold">Document verwijderen</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Weet u zeker dat u dit document wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="w-full grid grid-cols-2 gap-2 space-x-0">
                    <AlertDialogCancel className="w-full border-none ring-0 bg-indigo-200 px-2 py-1 text-indigo-500 hover:bg-indigo-400 hover:text-white transition-colors ml-0 space-x-0">Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleConfirm(id)} className="w-full border-none ring-0 bg-red-200 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-0 space-x-0">Verwijderen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDocumentDialog