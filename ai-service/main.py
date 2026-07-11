from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import classification, chatbot, summarization, risk_analysis

app = FastAPI(
    title="LegalEase AI Service",
    description="AI microservice for case classification, legal chatbot, document summarization, and risk analysis",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(classification.router, prefix="/api", tags=["Classification"])
app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])
app.include_router(summarization.router, prefix="/api", tags=["Summarization"])
app.include_router(risk_analysis.router, prefix="/api", tags=["Risk Analysis"])

@app.get("/")
async def root():
    return {"service": "LegalEase AI Service", "status": "running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
