# Riff Planner — AI-Powered Itinerary & Weekend Planning Agent

Riff Planner is a multi-agent itinerary generation system built using the Google Agent Development Kit (ADK). It automatically designs personalized weekend plans, day trips, and local experiences based on the user’s location, time window, budget, vibe, and food preferences.

This project demonstrates how AI agents can transform vague lifestyle preferences into structured, validated itineraries powered by real-time Google Search results.

---

## Problem Statement

Planning a weekend or short trip requires significant time spent searching for activities, food options, and schedules. Users often struggle to match their mood, budget, and available hours with realistic plans. This results in repetitive weekends, stress, and decision fatigue.

Manual planning involves:
- Searching for activities and restaurants
- Checking reviews, hours, and locations
- Coordinating timing and transportation
- Building a chronological schedule

This process is slow and overwhelming.

---

## Solution Statement

Riff Planner streamlines the experience by:
- Interpreting the user's preferences (location, budget, vibe, duration)
- Generating multiple targeted Google Search queries
- Selecting real, grounded venues and activities
- Building a chronological itinerary
- Validating against a strict JSON schema

The final output is a structured JSON plan that apps or frontend clients can render directly.

---

## System Instruction (Core Logic)

### Role
The agent acts as the **Riff Planner**, an enthusiastic and efficient itinerary designer.

### Output Requirement
All responses must return a valid JSON object matching the `SCHEDULE_SCHEMA`.

### Grounding
All activities and food items must come from Google Search tool calls.

### Required Planning Steps
Before using tools, the agent must outline its reasoning:

1. Analyze: interpret user request parameters  
2. Strategy: generate 2–3 precise Google Search queries  
3. Synthesize: build the itinerary timeline  
4. Output: prepare final JSON matching `SCHED
