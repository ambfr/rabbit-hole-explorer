# 🕳 Internet Rabbit Hole Explorer

A web app that lets you explore topics by following an interactive visual map of related ideas — like falling down a Wikipedia rabbit hole, but with AI guiding the way.

## What does it do?

You type in any topic (say, "Ancient Rome"), and the app shows it as a node on a graph. Click that node, and it expands to show 5 related topics connected to it. Keep clicking, and you build out a sprawling visual map of how ideas connect — with AI-generated summaries for each topic along the way.

There's also a "Random Rabbit Hole" mode — click one button, and the app picks a random topic and automatically keeps exploring on its own, building out the graph for you to watch.

## Features

- **Interactive graph** — search a topic, see it visually connect to related ideas, click to expand further
- **AI summaries** — every topic gets a short AI-written explanation
- **Random Rabbit Hole mode** — sit back and watch the app explore on its own (with pause/stop controls)
- **External links** — each topic has quick links to look it up on Wikipedia, YouTube, Reddit, or Google
- **Optional accounts** — sign up to save your favorite explorations and revisit them later (works fine without an account too)

## Built With

- **Frontend** (what you see/interact with): React, Tailwind CSS (for styling), React Flow (for the graph visuals)
- **Backend** (handles requests, talks to the database and AI): FastAPI (Python)
- **Database**: MongoDB (stores user accounts and saved graphs)
- **AI**: Groq API, running Llama 3.3 (generates topic summaries and related topics)
- **Login system**: JWT tokens (a standard way websites keep you logged in securely)

## How to Run This Yourself

You'll need two things running at once: the **backend** (the server) and the **frontend** (the website).

### 1. Backend Setup

Open a terminal in the `backend` folder:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment (a sandboxed Python environment so packages don't clash with other projects):

```bash
source venv/bin/activate     # Mac/Linux
venv\Scripts\activate         # Windows
```

Install the required packages:
```bash
pip install -r requirements.txt
```

Create a file called `.env` in the `backend` folder, and add:
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=any_random_long_secret_string
GROQ_API_KEY=your_groq_api_key

**Important MongoDB Atlas setup step:**

After creating your MongoDB Atlas cluster, go to **Network Access** in the Atlas dashboard and add your IP address (or `0.0.0.0/0` to allow access from anywhere — fine for development/testing). Without this, the backend won't be able to connect to the database and you'll get connection errors.
(You'll need a free MongoDB Atlas account for the database connection string, and a free Groq account for the API key.)

Start the server:
```bash
uvicorn main:app --reload
```

Leave this running — it's now serving the backend.

### 2. Frontend Setup

Open a **new** terminal in the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

This will give you a local link (usually `http://localhost:5173`) — open that in your browser to use the app.

## What's Next (Ideas for Future Versions)

- A "Challenge Mode" — start at one topic and try to navigate to a target topic
- Real-time collaboration — multiple people exploring the same graph together
- A mobile app version
- Personal notes you can attach to any topic

## About This Project

This was built as a learning project to practice full-stack development — combining a React frontend, a Python/FastAPI backend, a MongoDB database, user authentication, and AI integration into one cohesive app.
