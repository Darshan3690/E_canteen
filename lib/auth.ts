import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getUserRole() {
  const { userId } = await auth();
  if (!userId) return null;

  const profile = await prisma.profile.findUnique({ where: { id: userId } });
  return profile?.role ?? null;
}
