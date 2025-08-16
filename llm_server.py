from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class Message(BaseModel):
    group: str
    sender: str
    message: str

@app.post("/evaluate")
async def evaluate(msg: Message):
    prompt = f"""You are an AI assistant that filters WhatsApp messages.

                Your goal: Notify the user only if a message is related to job opportunities, internships, 
                freelance work, or any professional opportunity (e.g., hiring, referrals, gigs, openings, 
                collaborations).

                Here is the message context:

                Group Name: {msg.group}

                Sender: {msg.sender}

                Message: "{msg.message}"

                Respond with:
                "Yes" — if the message is about a job, internship, freelance, or career-related opportunity.

                "No" — otherwise.
                summarize the message if it is relevant.
                """

    # Send request to Ollama's local API
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "gemma3:4b",  # or mistral, gemma, etc.
            "prompt": prompt,
            "stream": False,
            "temperature": 0.5,
        }
    )

    data = response.json()
    message = data['response'].strip()
    reply = data['response'].strip().lower()

    if(reply.startswith("yes")):

        return {"relevant": 1, "summary": message}
    elif(reply.startswith("no")):   

        return {"relevant": 0}
       
