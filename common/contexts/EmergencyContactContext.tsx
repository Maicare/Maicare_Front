// context/EmergencyContactContext.tsx
"use client"

import { createContext, useContext, useState } from "react"
import { EmergencyContactList } from "@/types/emergency.types"

type EmergencyContactContextType = {
  emergencyContact: EmergencyContactList | null
  setEmergencyContact: (contact: EmergencyContactList | null) => void
}

const EmergencyContactContext = createContext<EmergencyContactContextType | undefined>(undefined)

export function EmergencyContactProvider({ children }: { children: React.ReactNode }) {
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContactList | null>(null)

  return (
    <EmergencyContactContext.Provider value={{ emergencyContact, setEmergencyContact }}>
      {children}
    </EmergencyContactContext.Provider>
  )
}

export function useEmergencyContactContext() {
  const context = useContext(EmergencyContactContext)
  if (context === undefined) {
    throw new Error('useEmergencyContactContext must be used within a EmergencyContactProvider')
  }
  return context
}