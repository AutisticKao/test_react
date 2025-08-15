import { NextResponse } from "next/server";
import api from "@/lib/axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const search = searchParams.get("search") || "";

  try {
    const { data } = await api.get(`/products`, { params: { page, limit, search } });
    return NextResponse.json(data);
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.message || "Failed to fetch products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
