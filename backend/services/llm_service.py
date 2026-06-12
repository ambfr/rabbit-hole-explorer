import json
import re

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
