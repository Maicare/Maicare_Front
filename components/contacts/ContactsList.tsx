"use client";

import React, { FunctionComponent, useMemo } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import styles from "./contacts-list.module.css";
import PencilSquare from "@/components/icons/PencilSquare";
import { Contact, ContactType } from "@/types/contacts.types";

import IconButton from "@/components/common/Buttons/IconButton";
import { useContact } from "@/hooks/contact/use-contact";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";

const ContactsList: FunctionComponent = () => {
  const { contacts: data, page, setPage, isLoading } = useContact({autoFetch:true});
  console.log(isLoading);
  const columns = useMemo<ColumnDef<Contact>[]>(() => {
    return [
      {
        header: "Opdrachtgever",
        accessorKey: "name",
      },
      {
        id: "full_address",
        header: "Adres",
        cell: (info) => {
          const { address, postal_code, place, land } = info.row.original;
          return (
            <div>
              <div>
                {address}, {postal_code}
              </div>
              <div>{place}</div>
              <div>{land}</div>
            </div>
          );
        },
      },
      {
        header: "Telefoonnummer",
        accessorKey: "phone_number",
        cell: (info) => (
          <a href={`tel:${info.getValue()}`}>{info.getValue() as string}</a>
        ),
      },
      {
        header: "KvK Nummer",
        accessorKey: "KVKnumber",
      },
      {
        header: "BTW Nummer",
        accessorKey: "BTWnumber",
      },
      // {
      //   accessorKey: "action",
      //   header: "Actions",
      //   cell: (info) => {
      //     // Show the edit button/link
      //     const senderId = info.row.original.id;
      //     return (
      //       <div className="flex gap-3">
      //         <Link href={`contacts/${senderId}/edit`}>
      //           <IconButton>
      //             <PencilSquare className="w-5 h-5" />
      //           </IconButton>
      //         </Link>
      //       </div>
      //     );
      //   },
      // },
    ];
  }, []);
  return (
    <div>
      {data && (
        <PaginatedTable
          className={styles.table}
          columns={columns}
          data={data}
          page={page}
          isFetching={isLoading}
          onPageChange={setPage}
          renderRowDetails={(row) => {
            const contacts = row.original.contacts;
            const senderId = row.original.id;

            return (
              <div className="flex">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Naam</th>
                      <th>Email</th>
                      <th>Telefoonnummer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts?.map((contact: ContactType, index: number) => (
                      <tr key={index}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link href={`contacts/${senderId}/edit`}>
                  <IconButton>
                    <PencilSquare className="w-5 h-5" />
                  </IconButton>
                </Link>
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

export default ContactsList;
