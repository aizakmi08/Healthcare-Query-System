#!/usr/bin/env python3
"""
Healthcare Query System - Example Usage
Take-Home Assessment: Full-Stack Engineer – AI on FHIR

This script demonstrates the core NLP and FHIR functionality
as requested in the assessment requirements.
"""

import json
import sys
from pathlib import Path

# Add the current directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent))

from nlp_processor import NLPProcessor
from fhir_simulator import FHIRSimulator

def main():
    """
    Demonstrate the healthcare query system functionality
    with 5 example queries as required by the assessment.
    """
    
    print("=" * 80)
    print("HEALTHCARE QUERY SYSTEM - AI ON FHIR")
    print("Take-Home Assessment Demonstration")
    print("=" * 80)
    
    # Initialize processors
    nlp_processor = NLPProcessor()
    fhir_simulator = FHIRSimulator()
    
    # Example queries as required by the assessment
    example_queries = [
        "Show me all diabetic patients over 50",
        "Find female patients with hypertension", 
        "List male cancer patients between 40 and 60",
        "Show patients with asthma under 30",
        "Find heart disease patients"
    ]
    
    print(f"\nProcessing {len(example_queries)} example queries:\n")
    
    for i, query in enumerate(example_queries, 1):
        print(f"{'='*60}")
        print(f"EXAMPLE {i}: {query}")
        print(f"{'='*60}")
        
        # Step 1: NLP Processing
        print("\n1. NLP PROCESSING:")
        print(f"   Input Query: '{query}'")
        
        params, explanation = nlp_processor.process_query(query)
        
        print(f"   Explanation: {explanation}")
        print(f"   Extracted Parameters:")
        print(f"   {json.dumps(params, indent=6)}")
        
        # Step 2: FHIR Query Translation
        print(f"\n2. FHIR QUERY TRANSLATION:")
        fhir_query_parts = []
        
        if params.get("conditions"):
            conditions_query = "&".join([f"condition={cond.replace(' ', '-')}" 
                                       for cond in params["conditions"]])
            fhir_query_parts.append(conditions_query)
        
        if params.get("gender"):
            fhir_query_parts.append(f"gender={params['gender']}")
        
        if params.get("age_filter"):
            age_filter = params["age_filter"]
            if "min_age" in age_filter:
                fhir_query_parts.append(f"age=ge{age_filter['min_age']}")
            if "max_age" in age_filter:
                fhir_query_parts.append(f"age=le{age_filter['max_age']}")
        
        fhir_query = "GET /Patient?" + "&".join(fhir_query_parts) if fhir_query_parts else "GET /Patient"
        print(f"   FHIR Query: {fhir_query}")
        
        # Step 3: Simulated FHIR Response
        print(f"\n3. FHIR RESPONSE SIMULATION:")
        fhir_response = fhir_simulator.generate_response(params)
        
        # Extract patients for display
        patients = [entry["resource"] for entry in fhir_response["entry"] 
                   if entry["resource"]["resourceType"] == "Patient"]
        conditions = [entry["resource"] for entry in fhir_response["entry"] 
                     if entry["resource"]["resourceType"] == "Condition"]
        
        print(f"   Total Patients Found: {len(patients)}")
        print(f"   Total Conditions: {len(conditions)}")
        
        # Show first 3 patients as example
        print(f"\n   Sample Patients (first 3):")
        for j, patient in enumerate(patients[:3], 1):
            print(f"   Patient {j}:")
            print(f"     ID: {patient['id']}")
            print(f"     Name: {patient['_computed']['display_name']}")
            print(f"     Age: {patient['_computed']['age']}")
            print(f"     Gender: {patient['gender']}")
            print(f"     Conditions: {', '.join(patient['_computed']['conditions']) or 'None'}")
        
        # Step 4: Statistics
        print(f"\n4. SUMMARY STATISTICS:")
        stats = fhir_simulator.get_summary_statistics(fhir_response)
        print(f"   Average Age: {stats['average_age']:.1f}")
        print(f"   Gender Distribution: {stats['gender_distribution']}")
        print(f"   Age Distribution: {stats['age_distribution']}")
        if stats['condition_distribution']:
            print(f"   Top Conditions: {list(stats['condition_distribution'].keys())[:3]}")
        
        print(f"\n   FHIR Bundle Structure:")
        print(f"   Resource Type: {fhir_response['resourceType']}")
        print(f"   Bundle Type: {fhir_response['type']}")
        print(f"   Total Entries: {len(fhir_response['entry'])}")
        print(f"   Last Updated: {fhir_response['meta']['lastUpdated']}")
        
        print("\n")
    
    print("=" * 80)
    print("DEMONSTRATION COMPLETE")
    print("=" * 80)
    print("\nKey Features Demonstrated:")
    print("✓ Natural Language Processing for healthcare queries")
    print("✓ Entity extraction (conditions, age filters, gender)")
    print("✓ FHIR-compliant Patient and Condition resource generation")
    print("✓ Realistic healthcare data simulation")
    print("✓ Statistical analysis and aggregation")
    print("✓ Proper FHIR Bundle structure")
    
    print(f"\nSupported Medical Conditions:")
    for condition in fhir_simulator.condition_codes.keys():
        code_info = fhir_simulator.condition_codes[condition]
        print(f"  • {condition.title()}: {code_info['code']} - {code_info['display']}")
    
    print(f"\nAPI Endpoints Available:")
    print(f"  • POST /api/query - Process natural language queries")
    print(f"  • GET /api/suggestions - Get query suggestions")
    print(f"  • GET /api/examples - Get example queries")
    print(f"  • GET /api/conditions - Get supported conditions")
    print(f"  • GET /api/demo - Demo endpoint")
    print(f"  • GET /health - Health check")

if __name__ == "__main__":
    main() 