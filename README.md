# Riff Planner — AI-Powered Itinerary & Weekend Planning Agent
<img width="1024" height="1024" alt="Gemini_Generated_Image_mh0nm0mh0nm0mh0n" src="https://github.com/user-attachments/assets/96605f83-05a8-4d46-bd48-f45fbc378766" />

Riff Planner is a multi-agent itinerary generation system built using the Google Agent Development Kit (ADK). It automatically designs personalized weekend plans, day trips, and local experiences based on the user’s location, time window, budget, vibe, and food preferences.

This project demonstrates how AI agents can transform vague lifestyle preferences into structured, validated itineraries powered by real-time Google Search results.



## Problem Statement

Planning a weekend or short trip requires significant time spent searching for activities, food options, and schedules. Users often struggle to match their mood, budget, and available hours with realistic plans. This results in repetitive weekends, stress, and decision fatigue.

Manual planning involves:
- Searching for activities and restaurants
- Checking reviews, hours, and locations
- Coordinating timing and transportation
- Building a chronological schedule

This process is slow and overwhelming.


## Solution Statement

Riff Planner streamlines the experience by:
- Interpreting the user's preferences (location, budget, vibe, duration)
- Generating multiple targeted Google Search queries
- Selecting real, grounded venues and activities
- Building a chronological itinerary
- Validating against a strict JSON schema

The final output is a structured JSON plan that apps or frontend clients can render directly.


## System Instruction (Core Logic)
```bash
riff_planner/
├── agent.py                  # Main interactive agent
├── schema.py                 # SCHEDULE_SCHEMA definition
├── sub_agents/               # All modular agents
│   ├── planner.py            # Planning strategist
│   ├── discovery.py          # Google Search agent
│   ├── scheduler.py          # Itinerary builder
│   └── validator.py          # JSON schema validator
├── tests/
│   └── test_agent.py         # Integration tests
├── frontend/                 # Optional frontend (Next.js / React)
│   ├── public/
│   └── src/
├── requirements.txt
└── README.md
```

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
   

## Value Statement

Riff Planner reduces hours of manual weekend planning into seconds. It produces:
- Real, grounded recommendations
- Clear schedules
- Functional links for immediate use

This helps users explore new activities, simplify decision-making, and enjoy more fulfilling weekends.

Future extensions may include:
- Trend detection from social platforms
- Budget optimization logic
- Group itinerary planning


## Installation

Requires Python **3.11.x**

### Create Virtual Environment
python -m venv venv
source venv/bin/activate


### Install Dependencies
pip install -r requirements.txt


## Running Riff Planner in ADK Web Mode
Start the ADK Web interface:
adk web

Run integration tests:
python -m tests.test_agent

## Conclusion
Riff Planner demonstrates how multi-agent systems can coordinate planning, discovery, scheduling, and validation to create structured, scalable AI itinerary solutions. It is suitable for weekend planners, lifestyle apps, travel assistants, and local discovery tools.



