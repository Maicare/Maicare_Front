import React, { useState, useEffect } from "react";
import Panel from "@/components/common/Panel/Panel";
import { useEmployee } from "@/hooks/employee/use-employee";
import { useClient } from "@/hooks/client/use-client";
import { Incident } from "@/types/incident.types";

type ReportProps = {
  clientId: number;
  incident?: Incident;
  selectedEmails: string[];
  setSelectedEmails: (emails: string[]) => void;
};

type EmailItem = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export default function Report({
  clientId,
  incident,
  selectedEmails,
  setSelectedEmails,
}: ReportProps) {
  const { readEmployeesEmails } = useEmployee({ autoFetch: false });
  const { readClientRelatedEmails } = useClient({ autoFetch: false });
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<EmailItem[]>([]);

  useEffect(() => {
    if (incident) {
      setSelectedEmails(incident.emails || []);
    } else {
      (async () => {
        try {
          const data = await readClientRelatedEmails(clientId);
          if (!data.emails || data.emails.length === 0) return;
          setSelectedEmails(data.emails);
        } catch (error) {
          console.error("Failed to fetch emails", error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, incident, setSelectedEmails]);

  useEffect(() => {
    if (query.length > 0) {
      (async () => {
        try {
          const data = await readEmployeesEmails(query);
          setSuggestions(data.data);
        } catch (error) {
          console.error("Failed to fetch emails", error);
          setSuggestions([]);
        }
      })();
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const addEmail = (emailItem: EmailItem) => {
    if (!selectedEmails.includes(emailItem.email)) {
      setSelectedEmails([...selectedEmails, emailItem.email]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const removeEmail = (email: string) => {
    setSelectedEmails(selectedEmails.filter((item) => item !== email));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && query === "") {
      setSelectedEmails(selectedEmails.slice(0, -1));
    } else if (e.key === " ") {
      const trimmedQuery = query.trim();
      if (trimmedQuery && isValidEmail(trimmedQuery)) {
        e.preventDefault();
        if (!selectedEmails.includes(trimmedQuery)) {
          setSelectedEmails([...selectedEmails, trimmedQuery]);
        }
        setQuery("");
        setSuggestions([]);
      }
    }
  };

  return (
    <Panel title={"6. Rapport"}>
      <div className="mb-4.5 mt-4.5 flex flex-col gap-6 px-6.5">
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 border rounded p-2">
            {selectedEmails.map((email, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
              >
                <span className="mr-1">{email}</span>
                <button
                  type="button"
                  className="text-sm text-red-500"
                  onClick={() => removeEmail(email)}
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow p-2 outline-none"
              placeholder="Typ e-mailadres of naam..."
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border rounded mt-1 max-h-60 overflow-auto">
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => addEmail(item)}
                >
                  {item.email} ({item.first_name} {item.last_name})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Panel>
  );
}
