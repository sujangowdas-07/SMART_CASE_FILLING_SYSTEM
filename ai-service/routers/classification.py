from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import gemini_service

router = APIRouter()

class ClassifyRequest(BaseModel):
    text: str

class ClassifyResponse(BaseModel):
    category: str
    courtType: str
    requiredDocuments: list[str]
    severity: str
    confidence: float
    summary: str

CATEGORY_KEYWORDS = {
    "property": ["property", "land", "boundary", "encroach", "real estate", "plot", "survey"],
    "family": ["divorce", "custody", "marriage", "child", "alimony", "maintenance", "adoption"],
    "labor": ["salary", "employment", "wages", "termination", "workplace", "employer", "worker"],
    "cybercrime": ["fraud", "cyber", "hacking", "online", "phishing", "bank fraud", "data theft"],
    "consumer": ["consumer", "defective", "product", "warranty", "refund", "service complaint"],
    "criminal": ["murder", "assault", "theft", "robbery", "kidnapping", "violence", "crime"],
    "corporate": ["company", "shareholder", "business", "corporate", "merger", "contract breach"],
    "traffic": ["traffic", "accident", "vehicle", "driving", "road", "collision"],
    "civil": ["contract", "agreement", "dispute", "damages", "compensation", "negligence"]
}

COURT_MAP = {
    "property": "City Civil Court",
    "family": "Family Court",
    "labor": "Labour Court",
    "cybercrime": "Magistrate Court",
    "consumer": "Consumer Disputes Redressal Forum",
    "criminal": "Sessions Court",
    "corporate": "Commercial Court",
    "traffic": "Traffic Court",
    "civil": "City Civil Court"
}

REQUIRED_DOCS = {
    "property": ["Property Deed / Title Document", "Survey Map", "Tax Receipts", "Identity Proof", "Encumbrance Certificate"],
    "family": ["Marriage Certificate", "Birth Certificate of Children", "Income Proof", "Identity Proof", "Photographs"],
    "labor": ["Employment Contract", "Salary Slips", "Appointment Letter", "Termination Letter", "Identity Proof"],
    "cybercrime": ["Bank Statements", "Transaction Records", "Screenshots of Fraud", "FIR Copy", "Identity Proof"],
    "consumer": ["Purchase Receipt/Invoice", "Product Warranty Card", "Complaint Letters", "Identity Proof"],
    "criminal": ["FIR Copy", "Medical Reports", "Witness Statements", "Identity Proof", "Evidence Photos"],
    "corporate": ["Company Registration", "Board Resolutions", "Contract Documents", "Financial Statements"],
    "traffic": ["Vehicle Registration", "Driving License", "Insurance Documents", "Accident Report", "Medical Bills"],
    "civil": ["Contract Documents", "Communication Records", "Identity Proof", "Supporting Evidence", "Affidavit"]
}

@router.post("/classify", response_model=ClassifyResponse)
async def classify_case(request: ClassifyRequest):
    text = request.text.lower()

    # Try Gemini first
    if gemini_service.is_available:
        prompt = f"""Analyze this legal complaint and classify it. Return a JSON response with:
- category: one of [civil, criminal, family, property, labor, consumer, cybercrime, corporate, traffic, other]
- courtType: the appropriate court type in India
- requiredDocuments: list of required documents
- severity: one of [low, medium, high, critical]
- confidence: confidence score 0-1
- summary: one-line summary of the classification

Complaint: {request.text}

Return ONLY valid JSON, no markdown.
"""
        result = await gemini_service.generate(prompt)
        if result:
            try:
                import json
                data = json.loads(result.strip().removeprefix("```json").removesuffix("```").strip())
                return ClassifyResponse(**data)
            except Exception:
                pass  # Fall through to keyword-based classification

    # Keyword-based fallback classification
    category = "civil"
    max_score = 0

    for cat, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > max_score:
            max_score = score
            category = cat

    severity = "medium"
    if category in ["criminal", "cybercrime"]:
        severity = "high"
    elif category in ["traffic", "consumer"]:
        severity = "low"

    return ClassifyResponse(
        category=category,
        courtType=COURT_MAP.get(category, "City Civil Court"),
        requiredDocuments=REQUIRED_DOCS.get(category, REQUIRED_DOCS["civil"]),
        severity=severity,
        confidence=0.85 if max_score > 0 else 0.6,
        summary=f"Case classified as {category} matter suitable for {COURT_MAP.get(category, 'City Civil Court')}."
    )
