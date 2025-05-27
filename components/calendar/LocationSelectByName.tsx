"use client"

import { FunctionComponent, useMemo } from "react"
import Select, { SelectProps } from "@/common/components/Select"
import { SelectionOption } from "@/common/components/UncontrolledCheckboxGroup"
import { useLocation } from "@/hooks/location/use-location"

export const LocationSelectByName: FunctionComponent<
  Omit<SelectProps, "options">
> = props => {
  const { locations } = useLocation({ autoFetch: true })

  const options: SelectionOption[] = useMemo(() => {
    if (!locations) return []

    const locOpts = locations.map(loc => ({
      value: loc.name,
      label: loc.name,
    }))

    return [
      { value: "", label: "Select a location" },
      ...locOpts,
    ]
  }, [locations])

  return <Select {...props} options={options} />
}

export default LocationSelectByName
