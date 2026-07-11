from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import gemini_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list = []

SYSTEM_PROMPT = """You are LegalEase AI Assistant, a helpful legal chatbot designed for the Indian legal system.
You help citizens understand:
- How to file legal cases
- What documents are needed
- Which court to approach
- Legal rights and procedures
- Finding appropriate lawyers

Important rules:
1. Always recommend consulting a licensed lawyer for specific legal advice
2. Provide information about Indian legal processes (CPC, CrPC, IPC, etc.)
3. Be empathetic and use simple language
4. If asked about Kannada, respond in English with key Kannada terms
5. Never provide specific legal opinions or predictions about case outcomes
6. Focus on procedural guidance and general legal awareness
"""

MOCK_RESPONSES = {
    "file": "To file a case on LegalEase, follow these steps:\n\n"
            "1. Go to your Dashboard and click 'File New Case'\n"
            "2. Select the case category (Civil, Criminal, Family, etc.)\n"
            "3. Describe your complaint in detail\n"
            "4. Upload supporting documents\n"
            "5. Review and submit\n\n"
            "Your case will be assigned a unique case number and you can track its progress from your dashboard.",
    "lawyer": "You can find a lawyer through our 'Find a Lawyer' feature:\n\n"
              "1. Navigate to 'Find Lawyer' from the sidebar\n"
              "2. Filter by specialization, location, and rating\n"
              "3. View lawyer profiles and their experience\n"
              "4. Send a request to your preferred lawyer\n\n"
              "Our AI system also recommends lawyers based on your case type.",
    "hearing": "Hearing dates are scheduled by the assigned judge. You can:\n\n"
               "1. Check your upcoming hearings on the Dashboard\n"
               "2. View hearing details in the Case Workspace\n"
               "3. Receive notifications when hearings are scheduled\n\n"
               "Make sure to have all required documents ready before the hearing date.",
    "document": "Documents required typically depend on your case type:\n\n"
                "**General Requirements:**\n"
                "- Identity Proof (Aadhaar/PAN Card)\n"
                "- Address Proof\n"
                "- Relevant Evidence Documents\n"
                "- Signed Affidavit\n\n"
                "After filing, our AI system will suggest specific documents based on your case category.",
    "default": "Thank you for your question. I'm the LegalEase AI assistant.\n\n"
               "I can help you with:\n"
               "• Filing a new case\n"
               "• Finding a lawyer\n"
               "• Understanding court procedures\n"
               "• Document requirements\n"
               "• Case status tracking\n\n"
               "Please ask me about any of these topics!"
}

@router.post("/chat")
async def chat(request: ChatRequest):
    # Try Gemini first
    if gemini_service.is_available:
        messages = []
        for msg in request.history:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        messages.append({"role": "user", "content": request.message})

        result = await gemini_service.chat(messages, system_instruction=SYSTEM_PROMPT)
        if result:
            return {"response": result, "source": "gemini"}

    # Fallback mock responses
    msg_lower = request.message.lower()
    response = MOCK_RESPONSES["default"]

    for keyword, reply in MOCK_RESPONSES.items():
        if keyword in msg_lower:
            response = reply
            break

    return {"response": response, "source": "mock"}
