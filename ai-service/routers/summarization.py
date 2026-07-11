from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import gemini_service

router = APIRouter()

class SummarizeRequest(BaseModel):
    text: str

@router.post("/summarize")
async def summarize_document(request: SummarizeRequest):
    # Try Gemini first
    if gemini_service.is_available:
        prompt = f"""Summarize this legal document. Provide:
1. A concise summary (2-3 paragraphs)
2. Key dates mentioned
3. Important sections or clauses
4. Parties involved
5. Key obligations or outcomes

Document text:
{request.text[:5000]}

Return JSON with: summary, keyDates (list), importantSections (list), parties (list), obligations (list)
Return ONLY valid JSON, no markdown.
"""
        result = await gemini_service.generate(prompt)
        if result:
            try:
                import json
                data = json.loads(result.strip().removeprefix("```json").removesuffix("```").strip())
                return {**data, "source": "gemini"}
            except Exception:
                pass

    # Mock fallback
    word_count = len(request.text.split())
    return {
        "summary": f"This legal document contains approximately {word_count} words. "
                   "It outlines the terms and conditions of the legal proceedings, including party details, "
                   "complaint description, and supporting evidence references. "
                   "The document appears to be related to an ongoing case and includes relevant "
                   "sections on jurisdiction, facts of the case, and relief sought.",
        "keyDates": ["Filing Date", "Response Deadline", "Hearing Date"],
        "importantSections": [
            "Party Details",
            "Statement of Facts",
            "Legal Grounds",
            "Relief Sought",
            "Evidence List"
        ],
        "parties": ["Petitioner", "Respondent"],
        "obligations": [
            "Submit response within 30 days",
            "Provide supporting documents",
            "Attend scheduled hearings"
        ],
        "source": "mock"
    }
