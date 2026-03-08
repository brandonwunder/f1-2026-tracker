import { NextResponse } from "next/server";
import { getRaceResults } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ round: string }> }
) {
  const { round } = await params;
  const roundNum = parseInt(round, 10);

  if (isNaN(roundNum) || roundNum < 1 || roundNum > 24) {
    return NextResponse.json({ error: "Invalid round" }, { status: 400 });
  }

  try {
    const race = await getRaceResults(roundNum);
    if (!race || !race.Results || race.Results.length === 0) {
      return NextResponse.json({ Results: [] });
    }
    return NextResponse.json({ Results: race.Results });
  } catch {
    return NextResponse.json({ Results: [] });
  }
}
