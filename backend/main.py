from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from nlp_processor import NLPProcessor
from fhir_simulator import FHIRSimulator
import json

app = FastAPI(
    title="Healthcare Query API",
    description="AI-powered FHIR healthcare data querying system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize processors
nlp_processor = NLPProcessor()
fhir_simulator = FHIRSimulator()

class Query(BaseModel):
    text: str

class Suggestion(BaseModel):
    text: str
    description: str

@app.get("/")
async def root():
    return {
        "message": "Healthcare Query API is running",
        "version": "1.0.0",
        "description": "AI-powered FHIR healthcare data querying system"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker healthcheck."""
    return {"status": "healthy", "timestamp": "2025-05-29T19:00:00Z"}

@app.post("/api/query")
async def process_query(query: Query):
    """Process natural language query and return FHIR-compliant results."""
    try:
        # Process the natural language query using NLP
        params, explanation = nlp_processor.process_query(query.text)
        
        # Generate simulated FHIR response
        fhir_response = fhir_simulator.generate_response(params)
        
        # Extract patients from FHIR response for frontend display
        patients = []
        for entry in fhir_response["entry"]:
            if entry["resource"]["resourceType"] == "Patient":
                resource = entry["resource"]
                patients.append({
                    "id": resource["id"],
                    "name": resource["_computed"]["display_name"],
                    "age": resource["_computed"]["age"],
                    "gender": resource["gender"],
                    "conditions": resource["_computed"]["conditions"],
                    "birthDate": resource["birthDate"]
                })
        
        # Get summary statistics
        stats = fhir_simulator.get_summary_statistics(fhir_response)
        
        return {
            "query": query.text,
            "explanation": explanation,
            "extracted_parameters": params,
            "fhir_response": fhir_response,
            "patients": patients,
            "statistics": stats,
            "total_results": len(patients)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/api/suggestions")
async def get_suggestions(prefix: str) -> List[Suggestion]:
    """Get query suggestions based on prefix."""
    suggestions = [
        {"text": "Show me all diabetic patients over 50", 
         "description": "Find diabetic patients aged 50 or older"},
        {"text": "Find female patients with hypertension", 
         "description": "Search for women diagnosed with hypertension"},
        {"text": "List male cancer patients between 40 and 60", 
         "description": "Display male cancer patients in middle age"},
        {"text": "Show patients with asthma under 30", 
         "description": "Find young asthma patients"},
        {"text": "Find heart disease patients", 
         "description": "Search for patients with cardiovascular conditions"},
        {"text": "Show diabetic female patients", 
         "description": "Find women with diabetes"},
        {"text": "List patients over 65 with hypertension", 
         "description": "Find elderly patients with high blood pressure"},
        {"text": "Find male patients under 40", 
         "description": "Search for young male patients"}
    ]
    
    # Filter suggestions based on prefix
    if prefix:
        filtered = [s for s in suggestions 
                   if prefix.lower() in s["text"].lower()]
    else:
        filtered = suggestions
    
    return filtered[:5]  # Return top 5 suggestions

@app.get("/api/examples")
async def get_example_queries():
    """Get example queries with their expected outputs for documentation."""
    try:
        examples = nlp_processor.get_example_queries()
        return {
            "description": "Example natural language queries and their processed outputs",
            "examples": examples
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting examples: {str(e)}")

@app.get("/api/conditions")
async def get_supported_conditions():
    """Get list of supported medical conditions."""
    return {
        "supported_conditions": list(fhir_simulator.condition_codes.keys()),
        "condition_details": fhir_simulator.condition_codes
    }

@app.get("/api/demo")
async def demo_endpoint():
    """Demo endpoint showing a sample query processing."""
    try:
        sample_query = "Show me all female diabetic patients over 50"
        params, explanation = nlp_processor.process_query(sample_query)
        fhir_response = fhir_simulator.generate_response(params)
        stats = fhir_simulator.get_summary_statistics(fhir_response)
        
        return {
            "demo_query": sample_query,
            "explanation": explanation,
            "parameters": params,
            "sample_results": len([e for e in fhir_response["entry"] 
                                 if e["resource"]["resourceType"] == "Patient"]),
            "statistics": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demo error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 