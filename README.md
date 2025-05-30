# Healthcare Query System - AI on FHIR

A full-stack AI-powered healthcare data querying tool that interfaces with FHIR-compliant systems using natural language processing.

## 🚀 Features

- **Natural Language Processing**: Convert plain English queries into structured FHIR API requests
- **FHIR Compliance**: Simulates proper FHIR Patient and Condition resources
- **Interactive Frontend**: React/Next.js UI with query autocomplete and suggestions
- **Data Visualization**: Charts and tables for patient data analysis
- **Advanced Filtering**: Filter results by age, gender, and medical conditions
- **Docker Support**: Fully containerized application for easy deployment

## 📋 Architecture

### Backend (Python/FastAPI)
- **NLP Processing**: Uses spaCy for intent and entity extraction
- **FHIR Simulation**: Generates realistic FHIR Patient and Condition resources
- **API Endpoints**: RESTful API for query processing and data retrieval

### Frontend (React/Next.js)
- **Query Interface**: Auto-complete search with suggestion system
- **Data Display**: Responsive tables and Chart.js visualizations
- **Filtering**: Interactive filters for refined data exploration

## 🛠️ Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.12+ (for local development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd home-test
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔍 Example Queries

The system supports various natural language queries for healthcare data:

### 1. **Age-based Queries**
```
"Show me all diabetic patients over 50"
→ Filters: diabetes condition, age > 50
```

### 2. **Gender-specific Queries**
```
"Find female patients with hypertension"
→ Filters: gender = female, hypertension condition
```

### 3. **Age Range Queries**
```
"List male cancer patients between 40 and 60"
→ Filters: gender = male, cancer condition, age 40-60
```

### 4. **Condition-specific Queries**
```
"Show patients with asthma under 30"
→ Filters: asthma condition, age < 30
```

### 5. **General Queries**
```
"Find heart disease patients"
→ Filters: heart disease condition
```

## 📊 API Documentation

### Core Endpoints

#### POST `/api/query`
Process natural language query and return FHIR results.

**Request:**
```json
{
  "text": "Show me all diabetic patients over 50"
}
```

**Response:**
```json
{
  "query": "Show me all diabetic patients over 50",
  "explanation": "Searching for patients with: diabetes; Age over 50",
  "extracted_parameters": {
    "conditions": ["diabetes"],
    "age_filter": {"min_age": 50},
    "gender": null,
    "limit": 10,
    "query_type": "patient_search"
  },
  "fhir_response": {
    "resourceType": "Bundle",
    "type": "searchset",
    "total": 5,
    "entry": [...]
  },
  "patients": [...],
  "statistics": {...},
  "total_results": 5
}
```

#### GET `/api/suggestions?prefix=<text>`
Get query suggestions based on input prefix.

#### GET `/api/examples`
Get example queries with expected outputs.

#### GET `/api/conditions`
Get supported medical conditions.

## 🏥 FHIR Implementation

### Supported Resources

#### Patient Resource
- Complete demographic information
- FHIR-compliant structure
- Unique identifiers and metadata

#### Condition Resource
- ICD-10 coded conditions
- Clinical status and verification
- Proper FHIR categorization

### Supported Conditions
- Diabetes (Type 1, Type 2)
- Hypertension
- Asthma
- Heart Disease
- Cancer
- COPD
- Stroke

## 🎯 NLP Processing

### Intent Recognition
The system recognizes various query intents:
- Patient search queries
- Condition-based filtering
- Age range specifications
- Gender-specific requests

### Entity Extraction
- **Medical Conditions**: Diabetes, hypertension, asthma, etc.
- **Age Filters**: "over 50", "under 30", "between 40 and 60"
- **Gender**: Male, female
- **Query Modifiers**: "all", "show", "find", "list"

### Example Processing

**Input:** "Show me all diabetic patients over 50"

**Extracted Parameters:**
```json
{
  "conditions": ["diabetes"],
  "age_filter": {"min_age": 50},
  "gender": null,
  "limit": 10,
  "query_type": "patient_search"
}
```

**FHIR Query Translation:**
```
GET /Patient?condition=diabetes&age=ge50
```

## 📈 Data Visualization

### Charts Available
- **Age Distribution**: Bar chart showing patient counts by age groups
- **Gender Distribution**: Pie chart showing male/female distribution
- **Condition Distribution**: Horizontal bar chart showing condition prevalence

### Interactive Filters
- Age range slider
- Gender selection
- Condition text search
- Real-time result filtering

## 🔧 Development Notes

### What I Focused On
1. **Comprehensive NLP Processing**: Pattern-based entity extraction with fallbacks
2. **Realistic FHIR Simulation**: Proper resource structure and relationships
3. **User Experience**: Intuitive interface with helpful suggestions
4. **Data Visualization**: Multiple chart types for data analysis
5. **Docker Integration**: Complete containerization for easy deployment

### Future Improvements
1. **Enhanced NLP**: Integration with transformer models for better understanding
2. **Real FHIR Integration**: Connection to actual FHIR servers
3. **Advanced Analytics**: More sophisticated data analysis capabilities
4. **Caching Layer**: Redis integration for improved performance
5. **Authentication**: OAuth 2.0 and SMART on FHIR implementation

## 🔐 Security Considerations

For a production deployment, the following security measures should be implemented:

### Authentication & Authorization
- OAuth 2.0 / SMART on FHIR integration
- Role-based access control (RBAC)
- JWT token management

### Data Privacy
- HIPAA compliance measures
- Data encryption at rest and in transit
- Audit logging for all data access

### API Security
- Rate limiting
- Input validation and sanitization
- CORS configuration
- API key management

## 📝 License

This project is for demonstration purposes as part of a technical assessment.

## 🤝 Contributing

This is a take-home assessment project. For questions or clarifications, please contact the development team.

---

**Note**: This application uses simulated data for demonstration purposes. In a production environment, it would interface with actual FHIR-compliant healthcare systems with proper security and compliance measures.