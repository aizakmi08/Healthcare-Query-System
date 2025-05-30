from typing import Dict, List, Any
import random
from datetime import datetime, timedelta
import uuid
import json

class FHIRSimulator:
    def __init__(self):
        """Initialize the FHIR simulator with sample data."""
        
        # Sample patient names
        self.first_names = {
            "male": ["James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Christopher"],
            "female": ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"]
        }
        
        self.last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
                          "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]
        
        # Medical conditions with ICD-10 codes
        self.condition_codes = {
            "diabetes": {
                "code": "E11.9",
                "display": "Type 2 diabetes mellitus without complications",
                "system": "http://hl7.org/fhir/sid/icd-10-cm"
            },
            "hypertension": {
                "code": "I10",
                "display": "Essential hypertension",
                "system": "http://hl7.org/fhir/sid/icd-10-cm"
            },
            "asthma": {
                "code": "J45.9",
                "display": "Asthma, unspecified",
                "system": "http://hl7.org/fhir/sid/icd-10-cm"
            },
            "heart disease": {
                "code": "I25.9",
                "display": "Chronic ischemic heart disease, unspecified",
                "system": "http://hl7.org/fhir/sid/icd-10-cm"
            },
            "cancer": {
                "code": "C80.1",
                "display": "Malignant neoplasm, unspecified",
                "system": "http://hl7.org/fhir/sid/icd-10-cm"
            }
        }
        
        # Sample addresses
        self.addresses = [
            {"street": "123 Main St", "city": "Boston", "state": "MA", "zip": "02101"},
            {"street": "456 Oak Ave", "city": "New York", "state": "NY", "zip": "10001"},
            {"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601"},
            {"street": "321 Elm St", "city": "Los Angeles", "state": "CA", "zip": "90001"},
            {"street": "654 Maple Dr", "city": "Houston", "state": "TX", "zip": "77001"}
        ]

    def generate_patient_id(self) -> str:
        """Generate a unique patient ID."""
        return f"patient-{uuid.uuid4().hex[:8]}"

    def generate_patient(self, gender: str = None, age_range: Dict = None, conditions: List[str] = None) -> Dict[str, Any]:
        """Generate a FHIR Patient resource."""
        
        # Determine gender
        if not gender:
            gender = random.choice(["male", "female"])
        
        # Generate age
        if age_range:
            min_age = age_range.get("min_age", 18)
            max_age = age_range.get("max_age", 85)
            age = random.randint(min_age, max_age)
        else:
            age = random.randint(18, 85)
        
        # Calculate birth date
        birth_date = datetime.now() - timedelta(days=age * 365.25)
        
        # Generate name
        first_name = random.choice(self.first_names[gender])
        last_name = random.choice(self.last_names)
        
        # Generate address
        address = random.choice(self.addresses)
        
        patient_id = self.generate_patient_id()
        
        # FHIR Patient resource
        patient = {
            "resourceType": "Patient",
            "id": patient_id,
            "meta": {
                "versionId": "1",
                "lastUpdated": datetime.now().isoformat() + "Z"
            },
            "identifier": [
                {
                    "use": "official",
                    "system": "http://hospital.example.org/patients",
                    "value": patient_id
                }
            ],
            "active": True,
            "name": [
                {
                    "use": "official",
                    "family": last_name,
                    "given": [first_name]
                }
            ],
            "gender": gender,
            "birthDate": birth_date.strftime("%Y-%m-%d"),
            "address": [
                {
                    "use": "home",
                    "line": [address["street"]],
                    "city": address["city"],
                    "state": address["state"],
                    "postalCode": address["zip"],
                    "country": "US"
                }
            ],
            "telecom": [
                {
                    "system": "phone",
                    "value": f"({random.randint(100, 999)}) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
                    "use": "home"
                },
                {
                    "system": "email",
                    "value": f"{first_name.lower()}.{last_name.lower()}@email.com",
                    "use": "home"
                }
            ]
        }
        
        # Add computed age for easier filtering
        patient["_computed"] = {
            "age": age,
            "display_name": f"{first_name} {last_name}",
            "conditions": conditions or []
        }
        
        return patient

    def generate_condition(self, patient_id: str, condition_name: str) -> Dict[str, Any]:
        """Generate a FHIR Condition resource."""
        
        if condition_name not in self.condition_codes:
            # Default to unknown condition
            condition_code = {
                "code": "R06.9",
                "display": "Unspecified abnormalities of breathing",
                "system": "http://hl7.org/fhir/sid/icd-10-cm"
            }
        else:
            condition_code = self.condition_codes[condition_name]
        
        # Generate random onset date (within last 5 years)
        onset_date = datetime.now() - timedelta(days=random.randint(30, 1825))
        
        condition = {
            "resourceType": "Condition",
            "id": f"condition-{uuid.uuid4().hex[:8]}",
            "meta": {
                "versionId": "1",
                "lastUpdated": datetime.now().isoformat() + "Z"
            },
            "clinicalStatus": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                        "code": "active",
                        "display": "Active"
                    }
                ]
            },
            "verificationStatus": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                        "code": "confirmed",
                        "display": "Confirmed"
                    }
                ]
            },
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                            "code": "encounter-diagnosis",
                            "display": "Encounter Diagnosis"
                        }
                    ]
                }
            ],
            "code": {
                "coding": [
                    {
                        "system": condition_code["system"],
                        "code": condition_code["code"],
                        "display": condition_code["display"]
                    }
                ],
                "text": condition_code["display"]
            },
            "subject": {
                "reference": f"Patient/{patient_id}",
                "display": f"Patient {patient_id}"
            },
            "onsetDateTime": onset_date.isoformat() + "Z",
            "recordedDate": onset_date.isoformat() + "Z"
        }
        
        return condition

    def filter_patients(self, patients: List[Dict], params: Dict[str, Any]) -> List[Dict]:
        """Filter patients based on search parameters."""
        filtered = patients
        
        # Filter by gender
        if params.get("gender"):
            filtered = [p for p in filtered if p["gender"] == params["gender"]]
        
        # Filter by age
        age_filter = params.get("age_filter", {})
        if age_filter:
            if "min_age" in age_filter:
                filtered = [p for p in filtered if p["_computed"]["age"] >= age_filter["min_age"]]
            if "max_age" in age_filter:
                filtered = [p for p in filtered if p["_computed"]["age"] <= age_filter["max_age"]]
        
        # Filter by conditions
        conditions = params.get("conditions", [])
        if conditions:
            filtered = [p for p in filtered if any(cond in p["_computed"]["conditions"] for cond in conditions)]
        
        return filtered

    def generate_response(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a simulated FHIR response based on search parameters."""
        
        # Generate a pool of patients
        patient_pool = []
        conditions_requested = params.get("conditions", [])
        
        # Generate 20-50 random patients
        total_patients = random.randint(20, 50)
        
        for _ in range(total_patients):
            # Randomly assign conditions to some patients
            patient_conditions = []
            if conditions_requested:
                # 30% chance of having the requested condition
                if random.random() < 0.3:
                    patient_conditions = [random.choice(conditions_requested)]
                # 10% chance of having multiple conditions
                elif random.random() < 0.1:
                    patient_conditions = random.sample(conditions_requested, min(2, len(conditions_requested)))
            else:
                # Random condition for general searches
                if random.random() < 0.4:
                    patient_conditions = [random.choice(list(self.condition_codes.keys()))]
            
            patient = self.generate_patient(
                gender=params.get("gender"),
                age_range=params.get("age_filter"),
                conditions=patient_conditions
            )
            patient_pool.append(patient)
        
        # Filter patients based on parameters
        matching_patients = self.filter_patients(patient_pool, params)
        
        # Limit results
        limit = params.get("limit", 10)
        matching_patients = matching_patients[:limit]
        
        # Generate conditions for matching patients
        all_conditions = []
        for patient in matching_patients:
            for condition_name in patient["_computed"]["conditions"]:
                condition = self.generate_condition(patient["id"], condition_name)
                all_conditions.append(condition)
        
        # Create FHIR Bundle response
        response = {
            "resourceType": "Bundle",
            "id": f"bundle-{uuid.uuid4().hex[:8]}",
            "meta": {
                "lastUpdated": datetime.now().isoformat() + "Z"
            },
            "type": "searchset",
            "total": len(matching_patients),
            "entry": []
        }
        
        # Add patients to bundle
        for patient in matching_patients:
            response["entry"].append({
                "fullUrl": f"http://example.org/fhir/Patient/{patient['id']}",
                "resource": patient,
                "search": {"mode": "match"}
            })
        
        # Add conditions to bundle
        for condition in all_conditions:
            response["entry"].append({
                "fullUrl": f"http://example.org/fhir/Condition/{condition['id']}",
                "resource": condition,
                "search": {"mode": "include"}
            })
        
        return response

    def get_summary_statistics(self, fhir_response: Dict[str, Any]) -> Dict[str, Any]:
        """Generate summary statistics from FHIR response."""
        
        patients = [entry["resource"] for entry in fhir_response["entry"] 
                   if entry["resource"]["resourceType"] == "Patient"]
        conditions = [entry["resource"] for entry in fhir_response["entry"] 
                     if entry["resource"]["resourceType"] == "Condition"]
        
        # Age distribution
        ages = [p["_computed"]["age"] for p in patients]
        age_groups = {
            "18-30": len([a for a in ages if 18 <= a <= 30]),
            "31-50": len([a for a in ages if 31 <= a <= 50]),
            "51-70": len([a for a in ages if 51 <= a <= 70]),
            "71+": len([a for a in ages if a > 70])
        }
        
        # Gender distribution
        gender_dist = {
            "male": len([p for p in patients if p["gender"] == "male"]),
            "female": len([p for p in patients if p["gender"] == "female"])
        }
        
        # Condition distribution
        condition_dist = {}
        for condition in conditions:
            condition_name = condition["code"]["text"]
            condition_dist[condition_name] = condition_dist.get(condition_name, 0) + 1
        
        return {
            "total_patients": len(patients),
            "total_conditions": len(conditions),
            "age_distribution": age_groups,
            "gender_distribution": gender_dist,
            "condition_distribution": condition_dist,
            "average_age": sum(ages) / len(ages) if ages else 0
        } 