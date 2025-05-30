import re
from typing import Dict, List, Tuple, Any
from datetime import datetime, timedelta
import json

class NLPProcessor:
    def __init__(self):
        """Initialize the NLP processor with medical patterns."""
        # Note: Using pattern-based processing instead of spaCy for simplicity
        # In production, spaCy or transformer models would provide better results
        self.nlp = None
            
        # Medical condition mappings
        self.conditions = {
            "diabetes": ["diabetes", "diabetic", "dm", "type 1", "type 2"],
            "hypertension": ["hypertension", "high blood pressure", "hbp", "hypertensive"],
            "asthma": ["asthma", "asthmatic", "respiratory"],
            "heart disease": ["heart disease", "cardiac", "coronary", "heart condition", "cardiovascular"],
            "cancer": ["cancer", "oncology", "tumor", "malignant", "carcinoma"],
            "copd": ["copd", "chronic obstructive", "emphysema"],
            "stroke": ["stroke", "cerebrovascular", "cva"]
        }
        
        # Age pattern keywords
        self.age_patterns = {
            "over": ["over", "above", "older than", "greater than"],
            "under": ["under", "below", "younger than", "less than"],
            "between": ["between", "from", "age range"]
        }
        
        # Gender patterns - using word boundaries to avoid partial matches
        self.gender_patterns = {
            "female": [r"\bfemale\b", r"\bwomen\b", r"\bwoman\b", r"\bfeminine\b"],
            "male": [r"\bmale\b", r"\bmen\b", r"\bman\b", r"\bmasculine\b"]
        }

    def extract_age_filter(self, text: str) -> Dict[str, Any]:
        """Extract age-related filters from text."""
        age_filter = {}
        text_lower = text.lower()
        
        # Look for age numbers
        age_numbers = re.findall(r'\b\d{1,3}\b', text)
        
        if "over" in text_lower or "above" in text_lower or "older than" in text_lower:
            if age_numbers:
                age_filter["min_age"] = int(age_numbers[0])
        elif "under" in text_lower or "below" in text_lower or "younger than" in text_lower:
            if age_numbers:
                age_filter["max_age"] = int(age_numbers[0])
        elif "between" in text_lower and len(age_numbers) >= 2:
            age_filter["min_age"] = int(age_numbers[0])
            age_filter["max_age"] = int(age_numbers[1])
        
        return age_filter

    def extract_gender(self, text: str) -> str:
        """Extract gender from text using word boundaries to avoid partial matches."""
        text_lower = text.lower()
        
        # Check female patterns first, then male patterns to avoid conflicts
        # Use regex with word boundaries to prevent "men" matching in "women"
        for gender, patterns in self.gender_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return gender
        
        return None

    def extract_conditions(self, text: str) -> List[str]:
        """Extract medical conditions from text."""
        text_lower = text.lower()
        found_conditions = []
        
        for condition, patterns in self.conditions.items():
            if any(pattern in text_lower for pattern in patterns):
                found_conditions.append(condition)
        
        return found_conditions

    def process_query(self, query_text: str) -> Tuple[Dict[str, Any], str]:
        """
        Process natural language query and extract structured parameters.
        
        Returns:
            Tuple of (parameters_dict, explanation_string)
        """
        params = {
            "conditions": [],
            "age_filter": {},
            "gender": None,
            "limit": 10,
            "query_type": "patient_search"
        }
        
        # Extract conditions
        conditions = self.extract_conditions(query_text)
        if conditions:
            params["conditions"] = conditions
        
        # Extract age filters
        age_filter = self.extract_age_filter(query_text)
        if age_filter:
            params["age_filter"] = age_filter
        
        # Extract gender
        gender = self.extract_gender(query_text)
        if gender:
            params["gender"] = gender
        
        # Generate explanation
        explanation_parts = []
        
        if conditions:
            explanation_parts.append(f"Searching for patients with: {', '.join(conditions)}")
        
        if gender:
            explanation_parts.append(f"Gender: {gender}")
        
        if age_filter:
            if "min_age" in age_filter and "max_age" in age_filter:
                explanation_parts.append(f"Age between {age_filter['min_age']} and {age_filter['max_age']}")
            elif "min_age" in age_filter:
                explanation_parts.append(f"Age over {age_filter['min_age']}")
            elif "max_age" in age_filter:
                explanation_parts.append(f"Age under {age_filter['max_age']}")
        
        explanation = "; ".join(explanation_parts) if explanation_parts else "General patient search"
        
        return params, explanation

    def get_example_queries(self) -> List[Dict[str, Any]]:
        """Return example queries with their processed outputs."""
        examples = [
            {
                "input": "Show me all diabetic patients over 50",
                "expected_params": {
                    "conditions": ["diabetes"],
                    "age_filter": {"min_age": 50},
                    "gender": None,
                    "limit": 10,
                    "query_type": "patient_search"
                }
            },
            {
                "input": "Find female patients with hypertension",
                "expected_params": {
                    "conditions": ["hypertension"],
                    "age_filter": {},
                    "gender": "female",
                    "limit": 10,
                    "query_type": "patient_search"
                }
            },
            {
                "input": "List male cancer patients between 40 and 60",
                "expected_params": {
                    "conditions": ["cancer"],
                    "age_filter": {"min_age": 40, "max_age": 60},
                    "gender": "male",
                    "limit": 10,
                    "query_type": "patient_search"
                }
            },
            {
                "input": "Show patients with asthma under 30",
                "expected_params": {
                    "conditions": ["asthma"],
                    "age_filter": {"max_age": 30},
                    "gender": None,
                    "limit": 10,
                    "query_type": "patient_search"
                }
            },
            {
                "input": "Find heart disease patients",
                "expected_params": {
                    "conditions": ["heart disease"],
                    "age_filter": {},
                    "gender": None,
                    "limit": 10,
                    "query_type": "patient_search"
                }
            }
        ]
        
        # Process each example to show actual output
        for example in examples:
            params, explanation = self.process_query(example["input"])
            example["actual_params"] = params
            example["explanation"] = explanation
        
        return examples 