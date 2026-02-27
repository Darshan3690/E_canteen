import { redirect } from "next/navigation";

export default async function StudentPage() {
  // Redirect to the new canteen marketplace
  redirect("/canteens");
}
