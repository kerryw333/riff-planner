🌟 Riff Planner — AI-Powered Weekend & Travel Itinerary Agent

A Google ADK Multi-Agent System

📌 Project Overview — Riff Planner

Riff Planner is a multi-agent itinerary-generation system built using the Google Agent Development Kit (ADK).
It automatically designs personalized weekend plans, short trips, and local experiences based on the user’s:

Location

Time window

Budget

Desired vibe / mood

Food preferences

Riff Planner removes the stress of planning and transforms vague user vibes into a fully structured itinerary, powered by real-time Google search results.

This project is inspired by the ADK multi-agent architecture and is built as part of the Kaggle Agents Intensive program.

🎯 Problem Statement

Planning a weekend or short trip is surprisingly stressful.
People often:

Don’t know where to go

Spend hours Googling “best things to do”

Struggle to match timing, locations, and vibe

Get overwhelmed by too many choices

End up doing the same things every weekend

Manually researching activities, reading reviews, checking maps, and aligning schedules takes a huge amount of time.

Users want spontaneity — but planning takes effort.

💡 Solution Statement

Riff Planner turns chaotic decision-making into a 1-click structured itinerary, grounded in real-time local search.

The agent automatically:

✔ Analyzes the user’s goals

Location, time window, budget, vibe, food preferences.

✔ Searches Google for real restaurants and activities

Using the ADK Google Search tool for real-world results.

✔ Synthesizes everything into a plan

A fully chronological itinerary — hour by hour.

✔ Produces a clean JSON schedule that apps can use

Every item has:

Activity / food name

Description

Link

Time allocation

Location

This allows users to instantly execute the plan without thinking.

🧠 Architecture

Riff Planner is built as a multi-agent system powered by Google ADK.

At the center is the interactive_riff_agent, which orchestrates the full workflow.

🔧 Core Agents
1️⃣ Planning Strategist — riff_planning_agent

Analyzes the user's parameters, breaks down the request, and generates search strategies.

2️⃣ Discovery Agent — riff_discovery_agent

Executes 2–3 precise Google Search queries for restaurants + activities.

3️⃣ Schedule Builder — riff_schedule_agent

Takes the search results and constructs a chronological itinerary.

4️⃣ JSON Validator — riff_schema_checker

Ensures the agent produces a valid itinerary based on SCHEDULE_SCHEMA:

At least 1 Activity

At least 1 Food item

All items MUST have links

MUST follow JSON format

Each validator is a LoopAgent — it retries until the output meets quality rules.

🧩 System Instruction (Core Logic)

The agent follows strict behavioral rules:

Role & Goal

You are the Riff Planner, an enthusiastic and efficient itinerary designer.

Output Requirement

You MUST output a JSON object matching the SCHEDULE_SCHEMA.

Grounding Requirement

All Food + Activities MUST come from Google Search tool calls.

Mandatory Structure

Before calling any tools, the agent must reveal its thinking:

[1] Analyze the user request
[2] Strategy: create 2–3 search queries
[3] Synthesize schedule
[4] Output: structured JSON


Then produce the final validated itinerary.

🚀 Workflow
1. Understand Request

User gives location, duration, vibe, budget.

2. Planning

Generate 2–3 targeted search queries.

3. Discovery

Google Search tool retrieves real venues + activities.

4. Synthesis

Schedule the day chronologically:

Start time

Activity blocks

Transit time

Food stops

5. Validation

The schema checker ensures:

JSON validity

Required fields

Links included

Logical timeline

6. Output

Return a final clean itinerary.

🔨 Essential Tools
Google Search Tool

Used to find restaurants, cafés, activities, art spaces, parks, nightlife, etc.

JSON Schema Validator

Guarantees the output matches SCHEDULE_SCHEMA.

📁 Project Structure

(Note: node_modules excluded for clarity)

riff_planner/
    agent.py                    # Main interactive agent
    schema.py                   # SCHEDULE_SCHEMA definition
    sub_agents/
        planner.py              # Planning strategist
        discovery.py            # Google search agent
        scheduler.py            # Itinerary builder
        validator.py            # LoopAgent validation
tests/
    test_agent.py               # Integration tests
frontend/
    ... (React UI, optional)
requirements.txt
README.md

📊 Value Statement

Riff Planner saves me hours of time every week by generating weekend plans automatically.
Instead of searching online endlessly, I now receive:

curated restaurant picks

unique activities

a full schedule with links

delivered in seconds

It helps me discover new local experiences and makes planning effortless.

If expanded in the future, I would add:

an agent that scans TikTok / Google Trends for trending local activities

budget optimization features

group planning support

⚙️ Installation

Requires Python 3.11.x.

Create environment
python -m venv venv
source venv/bin/activate

Install dependencies
pip install -r requirements.txt

🖥️ Running Riff Planner in ADK Web Mode

Start the web UI:

adk web


Run tests:

python -m tests.test_agent

🎉 Conclusion

Riff Planner demonstrates how multi-agent systems can intelligently transform vague lifestyle preferences into usable, chronological itineraries — combining real-time search, structured planning, and schema validation.

This modular, scalable approach can support travel apps, local discovery tools, and lifestyle assistants.
