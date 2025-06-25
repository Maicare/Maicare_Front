"use client"
import PrimaryButton from "@/common/components/PrimaryButton"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"
import { useState } from "react"

type Props = {
    isStatusLoading: boolean
    handleAcceptRegistration: (date:string) => void
}
export function AcceptRegistrationDialog({handleAcceptRegistration,isStatusLoading=false}:Props) {
    const [appointmentDate, setAppointmentDate] = useState<string>("");
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAppointmentDate(e.target.value);
    }

    const handleSubmit = (_e: React.MouseEvent<HTMLButtonElement>) => {
        // Handle the form submission logic here
        // You can call the handleAcceptRegistration function here if needed
        handleAcceptRegistration(appointmentDate+"T00:00:00Z"); // Assuming the date is in YYYY-MM-DD format
        // Reset the form or perform any other actions as needed
        setAppointmentDate("");
    }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <PrimaryButton
                        text="Accept"
                        animation="animate-bounce"
                        icon={CheckCircle}
                        className="bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
                        disabled={isStatusLoading}
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Accept Registration</DialogTitle>
                        <DialogDescription>
                            Enter the registration appointement date. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Appointment date</Label>
                            <Input id="username-1" type="date" value={appointmentDate} onChange={handleDateChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isStatusLoading}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
