import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidácia po publikovaní článku vo WordPresse.
 *
 * WP webhook (napr. mu-plugin na hooku `publish_post`) zavolá:
 *   POST /api/revalidate?secret=<REVALIDATE_SECRET>
 * alebo pošle secret v hlavičke `x-revalidate-secret`.
 *
 * Bez správneho secretu endpoint nič neprezradí ani neurobí.
 */
export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true, revalidated: "/" });
}
