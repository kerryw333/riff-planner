import { NextResponse } from 'next/server';

type RequestBody = {
  destination?: string;
};

const demoTimeline = [
  {
    title: 'Day 1 — Arrival & Old Town',
    details: 'Check in, explore the historic district, and grab dinner at a neighborhood spot.'
  },
  {
    title: 'Day 2 — Museums & Waterfront',
    details: 'Morning at a local museum, afternoon stroll along the waterfront, sunset viewpoints.'
  },
  {
    title: 'Day 3 — Day Trip Adventure',
    details: 'Short train ride to nearby villages, sample regional food, and head back in the evening.'
  }
];

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const destination = body.destination?.trim();

  if (!destination) {
    return NextResponse.json({ message: 'Destination is required.' }, { status: 400 });
  }

  return NextResponse.json(
    {
      destination,
      timeline: demoTimeline,
      notes: 'This is a demo response. Connect your Gemini-powered backend to return live plans.'
    },
    { status: 200 }
  );
}
