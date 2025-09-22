"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";
import { useContact } from "@/hooks/contact/use-contact";
import { Contact } from "@/schemas/contact.schema";
import { Id } from "@/common/types/types";
import UpsertContactForm from "../../_components/upsert-contact-form";

const Page: React.FC = () => {
  const router = useRouter();
  const { contactId } = useParams();

  const { readOne } = useContact({ autoFetch: false });

  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchContact = async (id: Id) => {
      setIsLoading(true);
      const data = await readOne(id);
      setContact(data);
      setIsLoading(false);
    }
    if (contactId) fetchContact(+contactId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);


  const onSuccess = (id: number) => {
    router.push(`/contacts/${id}`)
  }
  const onCancel = () => {
    router.back();
  }
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Opdrachtgevers bijwerken</h1>
        <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Opdrachtgevers bijwerken</span></p>
      </div>
      {
        (!contact || isLoading) ?
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
          :
          <UpsertContactForm
            mode="update"
            onSuccess={onSuccess}
            defaultValues={contact}
            onCancel={onCancel}
          />
      }
    </div>
  );
};

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.UpdateSender, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
