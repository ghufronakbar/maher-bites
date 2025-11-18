import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const site = await prisma.site.findMany();
  return NextResponse.json({ message: "Pong", site: site[0] ?? null }, { status: 200 });
}
