import React, { useState, useCallback, useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormItem, FormControl, FormMessage, FormField, FormLabel } from "@/components/ui/form";
import { CreateClientInput } from "@/schemas/clientNew.schema";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Info, PlusCircle, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import Tooltip from "@/common/components/Tooltip";
import { Separator } from "@/components/ui/separator";
import { Any } from "@/common/types/types";


interface PDOKAddressDoc {
  id: string;
  weergavenaam?: string;
  straatnaam?: string;
  huis_nlt?: string;           // e.g., "12A"
  huisnummer?: number;         // e.g., 12
  postcode?: string;           // "1234 AB"
  woonplaatsnaam?: string;     // city
}

const dutchPostcodeRegex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/;

/** Normalize to Dutch format "1234 AB" (or return original if cannot) */
function normalizePostcode(v: string): string {
  if (!v) return "";
  const clean = v.replace(/\s+/g, "").toUpperCase();
  if (/^[1-9][0-9]{3}[A-Z]{2}$/.test(clean)) {
    return `${clean.slice(0, 4)} ${clean.slice(4)}`;
  }
  return v.toUpperCase();
}

/** Is a value that could be a house number like '12' or '12A' or '12-1' */
function isLikelyHouseNo(v: string) {
  return /^[0-9]+[A-Za-z\-\/0-9]*$/.test(v.trim());
}

const AddressesForm: React.FC<{ className?: string }> = ({ className }) => {
  const { control, setValue, watch, getValues } = useFormContext<CreateClientInput>();
  const { fields, append, remove } = useFieldArray({ control, name: "addresses" });

  const [isSearching, setIsSearching] = useState<Record<number, boolean>>({});
  const [debugInfo, setDebugInfo] = useState<Record<number, string>>({});

  // Per-row debounce timers and abort controllers
  const timersRef = useRef<Record<number, Any>>({});
  const abortersRef = useRef<Record<number, AbortController | undefined>>({});
  const lastQueryRef = useRef<Record<number, string>>({}); // avoid duplicate calls

  const setStatus = (index: number, text: string) =>
    setDebugInfo((prev) => ({ ...prev, [index]: text }));

  const autoCompleteAddress = useCallback(
    async (index: number, postcodeRaw: string, houseRaw: string) => {
      const postcode = normalizePostcode(String(postcodeRaw || ""));
      const house = String(houseRaw || "").trim();

      // Validate input
      if (!dutchPostcodeRegex.test(postcode.replace(/\s+/g, "")) || !isLikelyHouseNo(house)) {
        setStatus(index, "Postcode of huisnummer ongeldig");
        return;
      }

      const queryKey = `${postcode}|${house}`;
      if (lastQueryRef.current[index] === queryKey) {
        // Same query already applied — skip
        return;
      }

      // Cancel any previous request for this row
      abortersRef.current[index]?.abort();
      const aborter = new AbortController();
      abortersRef.current[index] = aborter;

      setIsSearching((p) => ({ ...p, [index]: true }));
      setStatus(index, "Zoeken…");

      try {
        const q = `${postcode.replace(/\s+/g, "")} ${house}`;
        const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(
          q
        )}&fq=type:adres`;

        const res = await fetch(url, { signal: aborter.signal });
        if (!res.ok) throw new Error(`PDOK ${res.status}`);

        const json = await res.json();
        const doc: PDOKAddressDoc | undefined = json?.response?.docs?.[0];

        if (!doc) {
          setStatus(index, "Geen adres gevonden");
          return;
        }

        const street = (doc.straatnaam || "").trim();
        const houseFromApi =
          doc.huis_nlt?.toString().trim() ||
          (typeof doc.huisnummer === "number" ? String(doc.huisnummer) : "").trim();
        const city = (doc.woonplaatsnaam || "").trim();

        const streetLine = [street, houseFromApi || house].filter(Boolean).join(" ").trim();

        // Fill the form (keep zip/user house as typed; fill street & city)
        setValue(`addresses.${index}.address`, streetLine, { shouldDirty: true, shouldValidate: true });
        setValue(`addresses.${index}.city`, city, { shouldDirty: true, shouldValidate: true });

        setStatus(index, `Gevonden: ${streetLine}${city ? `, ${city}` : ""}`);
        lastQueryRef.current[index] = queryKey;
      } catch (e: Any) {
        if (e?.name === "AbortError") return; // ignore canceled
        setStatus(index, `Fout: ${e?.message || "onbekend"}`);
      } finally {
        setIsSearching((p) => ({ ...p, [index]: false }));
      }
    },
    [setValue]
  );

  /** Debounced watcher per row */
  useEffect(() => {
    // Subscribe to the entire addresses array and debounce per index
    const subscription = watch((_, { name }) => {
      // Only react to zip_code or house_number changes
      const match = name?.match(/^addresses\.(\d+)\.(zip_code|house_number)$/);
      if (!match) return;

      const index = Number(match[1]);
      const zip = String(getValues(`addresses.${index}.zip_code`) || "");
      const house = String(getValues(`addresses.${index}.house_number`) || "");

      // Clear previous timer
      if (timersRef.current[index]) {
        clearTimeout(timersRef.current[index]);
      }

      // Debounce 600ms
      timersRef.current[index] = setTimeout(() => {
        // If zip looks like partial "1234 A", we still try only when valid
        const normalized = normalizePostcode(zip);
        const looksValid = dutchPostcodeRegex.test(normalized.replace(/\s+/g, "")) && isLikelyHouseNo(house);
        if (!looksValid) {
          setStatus(index, "Wacht op geldige postcode + huisnummer…");
          return;
        }
        autoCompleteAddress(index, normalized, house);
      }, 600);
    });

    return () => {
      subscription.unsubscribe?.();
      // cleanup all timers and aborters
      Object.values(timersRef.current).forEach((t) => clearTimeout(t));
      Object.values(abortersRef.current).forEach((a) => a?.abort());
    };
  }, [watch, getValues, autoCompleteAddress]);

  const handleManualTrigger = useCallback(
    (index: number) => {
      const zip = String(getValues(`addresses.${index}.zip_code`) || "");
      const house = String(getValues(`addresses.${index}.house_number`) || "");
      const normalized = normalizePostcode(zip);

      if (!zip || !house) {
        setStatus(index, "Postcode of huisnummer ontbreekt");
        return;
      }
      autoCompleteAddress(index, normalized, house);
    },
    [getValues, autoCompleteAddress]
  );

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className={cn("col-span-2 grid grid-cols-2 gap-x-2 gap-y-4", className)}>
          {/* Debug */}
          <div className="col-span-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
            <div className="font-bold">Debug Info (Adres {index + 1}):</div>
            <div>Status: {debugInfo[index] || "Wachten op invoer…"}</div>
            <div>Postcode: &quot;{String(watch(`addresses.${index}.zip_code`) || "Empty")}&quot;</div>
            <div>Huisnummer: &quot;{String(watch(`addresses.${index}.house_number`) || "Empty")}&quot;</div>
            <div>Straat: &quot;{String(watch(`addresses.${index}.address`) || "Empty")}&quot;</div>
            <div>Stad: &quot;{String(watch(`addresses.${index}.city`) || "Empty")}&quot;</div>
            <button
              type="button"
              onClick={() => handleManualTrigger(index)}
              className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded"
            >
              Handmatig zoeken
            </button>
          </div>

          {/* Belongs To */}
          <FormField
            control={control}
            name={`addresses.${index}.belongs_to`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Behoort toe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Bijv: moeder, broer, werk" {...field} />
                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5">
                      <Tooltip text="Aan wie dit adres toebehoort">
                        <Info className="h-5 w-5" />
                      </Tooltip>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* House Number */}
          <FormField
            control={control}
            name={`addresses.${index}.house_number`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huisnummer *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Bijv: 123 of 123A"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        // keep raw; watcher handles debounce/fetch
                        field.onChange(e.target.value);
                      }}
                      onBlur={(e) => {
                        // Trigger a lookup on blur too
                        handleManualTrigger(index);
                      }}
                    />
                    <div className="absolute right-2 top-0 translate-y-1/2 flex items-center space-x-1">
                      {isSearching[index] && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      )}
                      <Tooltip text="Vul huisnummer in voor automatisch adres">
                        <Info className="h-5 w-5" />
                      </Tooltip>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Postal Code */}
          <FormField
            control={control}
            name={`addresses.${index}.zip_code`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postcode *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Bijv: 1234 AB"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const formatted = normalizePostcode(e.target.value);
                        field.onChange(formatted);
                      }}
                      onBlur={() => handleManualTrigger(index)}
                    />
                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5">
                      <Tooltip text="Vul postcode in voor automatisch adres">
                        <Info className="h-5 w-5" />
                      </Tooltip>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Street (auto but editable) */}
          <FormField
            control={control}
            name={`addresses.${index}.address`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Straat</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Wordt automatisch ingevuld op basis van postcode en huisnummer"
                      {...field}
                      value={field.value || ""}
                    />
                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5">
                      <Tooltip text="Automatisch ingevuld maar aanpasbaar">
                        <Info className="h-5 w-5" />
                      </Tooltip>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City (auto but editable) */}
          <FormField
            control={control}
            name={`addresses.${index}.city`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Stad</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Wordt automatisch ingevuld op basis van postcode en huisnummer"
                      {...field}
                      value={field.value || ""}
                    />
                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5">
                      <Tooltip text="Automatisch ingevuld maar aanpasbaar">
                        <Info className="h-5 w-5" />
                      </Tooltip>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={control}
            name={`addresses.${index}.phone_number`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Telefoonnummer (optioneel)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Bijv: +31 6 12345678" {...field} value={field.value || ""} />
                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5">
                      <Tooltip text="Optioneel telefoonnummer voor dit adres">
                        <Info className="h-5 w-5" />
                      </Tooltip>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="bg-slate-300 w-full col-span-2" />
        </div>
      ))}

      {/* Buttons */}
      <PrimaryButton
        text="Adres verwijderen"
        icon={XCircle}
        type="button"
        className="w-full bg-red-200 text-red-500 hover:text-white hover:bg-red-500"
        onClick={() => remove(fields.length - 1)}
        disabled={fields.length <= 1}
      />

      <PrimaryButton
        text="Adres toevoegen"
        icon={PlusCircle}
        type="button"
        className="w-full"
        onClick={() =>
          append({
            belongs_to: "",
            address: "",
            city: "",
            zip_code: "",
            phone_number: "",
            house_number: "",
          })
        }
        disabled={false /* allow adding; validation can enforce completeness later */}
      />
    </div>
  );
};

export default AddressesForm;
