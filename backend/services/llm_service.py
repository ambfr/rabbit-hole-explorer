import json
import re
import random
from groq import AsyncGroq

from config import GROQ_API_KEY

_client: AsyncGroq | None = None


def _get_client() -> AsyncGroq:
    global _client
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    if _client is None:
        _client = AsyncGroq(api_key=GROQ_API_KEY)
    return _client


def _parse_json_response(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


async def expand_topic(topic: str) -> dict:
    client = _get_client()

    prompt = f"""Given the topic "{topic}", respond ONLY with valid JSON in this exact format — no other text, no markdown:

{{"summary": "a short paragraph about the topic", "related_topics": ["topic1", "topic2", "topic3", "topic4", "topic5"]}}

The related_topics list must contain exactly 5 related topic names."""

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.choices[0].message.content
    if not raw:
        raise ValueError("Empty response from LLM")

    result = _parse_json_response(raw)

    if "summary" not in result or "related_topics" not in result:
        raise ValueError("Invalid response format from LLM")

    return result


import random

async def get_random_topic() -> str:
    client = _get_client()

    categories = [
        "an obscure historical event", "a strange animal or organism",
        "a scientific phenomenon", "a mythological figure or story",
        "an unsolved mystery", "a place in the world", "a piece of technology",
        "an art movement", "a food or culinary tradition", "a space object or phenomenon",
        "a famous invention", "a cultural tradition or festival", "a historical figure",
        "a natural disaster", "a language or linguistics topic"
    ]
    category = random.choice(categories)

    prompt = f"""Give me one single specific, interesting topic related to {category} - something that would be genuinely surprising or lesser-known. Respond with ONLY the topic name, nothing else, no quotes, no explanation."""

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=50,
        temperature=1.2,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.choices[0].message.content
    if not raw:
        raise ValueError("Empty response from LLM")

    return raw.strip().strip('"')