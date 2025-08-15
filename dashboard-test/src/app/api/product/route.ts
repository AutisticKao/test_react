import { NextResponse } from "next/server";
import api from "@/lib/axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");
  if (!product_id) {
    return NextResponse.json({ error: "product_id is required" }, { status: 400 });
  }

  try {
    const { data } = await api.get(`/product`, { params: { product_id } });
    return NextResponse.json(data);
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.message || "Failed to fetch product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { data } = await api.post(`/product`, body);
    return NextResponse.json(data);
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.message || "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { data } = await api.put(`/product`, body);
    return NextResponse.json(data);
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.message || "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
