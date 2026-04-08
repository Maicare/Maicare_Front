import { redirect } from "next/navigation";

export default async function LocationPage({ params }: { params: Promise<{ locationId: string }> }) {
    const { locationId } = await params;
    redirect(`/locations/${locationId}/overview`);
}
