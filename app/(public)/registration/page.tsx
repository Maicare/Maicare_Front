"use client";

import RegistrationForm from "./_components/registration-form";

export default function RegistrationFormPage() {
    return (
        <div className="container mx-auto py-8 space-y-6 ">
            <h1 className="text-3xl font-bold">Aanmeldingsformulier</h1>
            <p className="text-muted-foreground">
                Vul alle verplichte velden in om uw aanmelding te voltooien.
            </p>

            <RegistrationForm mode="create" registration={undefined} />
        </div>
    );
}