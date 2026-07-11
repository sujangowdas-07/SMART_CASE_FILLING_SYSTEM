import os
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-2.0-flash")
                print("[SUCCESS] Gemini API configured successfully")
            except Exception as e:
                print(f"[WARNING] Failed to configure Gemini API: {e}")
                self.model = None
        else:
            print("[INFO] No GEMINI_API_KEY found. Running in mock mode.")

    @property
    def is_available(self) -> bool:
        return self.model is not None

    async def generate(self, prompt: str, system_instruction: Optional[str] = None) -> Optional[str]:
        if not self.is_available:
            return None
        try:
            if system_instruction:
                model = genai.GenerativeModel(
                    "gemini-2.0-flash",
                    system_instruction=system_instruction
                )
            else:
                model = self.model

            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"[WARNING] Gemini API error: {e}")
            return None

    async def chat(self, messages: list, system_instruction: Optional[str] = None) -> Optional[str]:
        if not self.is_available:
            return None
        try:
            model = genai.GenerativeModel(
                "gemini-2.0-flash",
                system_instruction=system_instruction or ""
            )
            chat = model.start_chat(history=[])

            # Send previous messages as context
            for msg in messages[:-1]:
                role = "user" if msg.get("role") == "user" else "model"
                chat.history.append({"role": role, "parts": [msg.get("content", "")]})

            # Send the last message
            last_message = messages[-1].get("content", "") if messages else ""
            response = chat.send_message(last_message)
            return response.text
        except Exception as e:
            print(f"[WARNING] Gemini chat error: {e}")
            return None


# Singleton instance
gemini_service = GeminiService()
