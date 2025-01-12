import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MAICare",
  description: "This is Home for MAICare",
  // other metadata
};

export default function Home() {
  redirect("/signin");
}
