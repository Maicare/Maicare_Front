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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { useState } from "react"

type Props = {
    isStatusLoading: boolean
    handleAcceptRegistration: (date:string,location:string,type:string) => void
}
export function AcceptRegistrationDialog({handleAcceptRegistration,isStatusLoading=false}:Props) {
    const [appointmentDate, setAppointmentDate] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [appointmentType, setAppointmentType] = useState<"regular_placement"|"crisis_admission">("regular_placement");
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAppointmentDate(e.target.value);
    }

    const handleSubmit = (_e: React.MouseEvent<HTMLButtonElement>) => {
        // Handle the form submission logic here
        // You can call the handleAcceptRegistration function here if needed
        handleAcceptRegistration(appointmentDate+"T00:00:00Z",location,appointmentType); // Assuming the date is in YYYY-MM-DD format
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
                            <Label htmlFor="username-2">Appointment Type</Label>
                            <Select onValueChange={(value) => setAppointmentType(value as "regular_placement" | "crisis_admission")}>
                                <SelectTrigger id="username-2" className="w-full">
                                    <SelectValue placeholder="Select appointment type" />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-white">
                                    <SelectItem value="regular_placement">Regular Placement</SelectItem>
                                    <SelectItem value="crisis_admission">Crisis Admission</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Appointment date</Label>
                            <Input id="username-1" type="date" value={appointmentDate} onChange={handleDateChange} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-3">Locatie</Label>
                            <Input id="username-3" type="text" value={location} onChange={(e)=>setLocation(e.target.value)} />
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
