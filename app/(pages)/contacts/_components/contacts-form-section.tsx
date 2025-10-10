import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

type Contact = {
  email: string
  name: string
  phone_number: string
}

export function ContactsFormSection() {
  const { control, setValue, getValues } = useFormContext<{ contacts: Contact[] }>()
  const [contacts, setContacts] = useState<Contact[]>(getValues("contacts") || [])
  
  const addContact = () => {
    const newContacts = [...contacts, { email: "", name: "", phone_number: "" }]
    setContacts(newContacts)
    setValue("contacts", newContacts)
  }

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index)
    setContacts(newContacts)
    setValue("contacts", newContacts)
  }

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts]
    newContacts[index][field] = value
    setContacts(newContacts)
    setValue("contacts", newContacts)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Contactpersonen</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addContact}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Contact toevoegen
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          Nog geen contactpersonen toegevoegd
        </div>
      ) : (
        <div className="space-y-6">
          {contacts.map((contact, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="flex justify-between">
                <h4 className="mb-4 font-medium">Contactpersoon</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={control}
                  name={`contacts.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naam</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, "name", e.target.value)}
                          placeholder="Jan Jansen"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`contacts.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mailadres</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, "email", e.target.value)}
                          placeholder="jan@voorbeeld.nl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`contacts.${index}.phone_number`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefoonnummer</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={contact.phone_number}
                          onChange={(e) => handleContactChange(index, "phone_number", e.target.value)}
                          placeholder="+31612345678"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}