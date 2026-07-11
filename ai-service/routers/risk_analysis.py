from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import gemini_service

router = APIRouter()

class RiskAnalysisRequest(BaseModel):
    description: str
    documents: list[str] = []

@router.post("/risk-analysis")
async def analyze_risk(request: RiskAnalysisRequest):
    # Try Gemini first
    if gemini_service.is_available:
        prompt = f"""Analyze this legal case for filing readiness and risk.

Case Description: {request.description}
Documents Provided: {', '.join(request.documents) if request.documents else 'None'}

Provide a JSON assessment with:
- filingReadiness: score 0-100
- missingDocuments: list of documents that should be provided
- verificationScore: score 0-100 for document verification readiness
- riskLevel: one of [low, medium, high, critical]
- recommendations: list of 3-5 actionable recommendations
- strengths: list of case strengths
- weaknesses: list of case weaknesses

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
    doc_count = len(request.documents)
    filing_readiness = min(40 + doc_count * 15, 95)
    verification_score = min(30 + doc_count * 20, 90)

    missing_docs = ["Affidavit", "Identity Proof (Aadhaar/PAN)", "Address Proof"]
    if doc_count < 3:
        missing_docs.append("Supporting Evidence Documents")
    if doc_count < 5:
        missing_docs.append("Witness Statements")

    risk_level = "medium"
    if filing_readiness > 80:
        risk_level = "low"
    elif filing_readiness < 50:
        risk_level = "high"

    return {
        "filingReadiness": filing_readiness,
        "missingDocuments": missing_docs[:3],
        "verificationScore": verification_score,
        "riskLevel": risk_level,
        "recommendations": [
            "Ensure all documents are notarized and authenticated",
            "Include identity proof of all parties involved",
            "Consider consulting a specialized lawyer for legal review",
            "Prepare a chronological timeline of events",
            "Gather witness statements if available"
        ],
        "strengths": [
            "Case description is detailed",
            f"{doc_count} documents provided" if doc_count > 0 else "Case details are clear"
        ],
        "weaknesses": [
            "Some required documents may be missing",
            "Case may need additional evidence review"
        ],
        "source": "mock"
    }
