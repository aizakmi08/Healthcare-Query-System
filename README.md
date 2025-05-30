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
- **Docker & Docker Compose**: Recommended for easiest setup
- **Node.js 20+**: Required for local development
- **Python 3.12+**: Required for local development
- **Git**: To clone the repository

### Option 1: Quick Start with Docker (Recommended)

This is the fastest way to get the application running:

1. **Clone the repository**
   ```bash
   git clone https://github.com/aizakmi08/Healthcare-Query-System.git
   cd Healthcare-Query-System
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```
   
   This will:
   - Build both frontend and backend containers
   - Install all dependencies
   - Start both services
   - Set up networking between containers

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development Setup

For development with hot reloading:

#### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy model**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Start backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup
1. **Navigate to frontend directory (new terminal)**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Option 3: Hybrid Setup (Backend in Docker, Frontend Local)

Useful for frontend development:

1. **Start only backend with Docker**
   ```bash
   docker-compose up backend
   ```

2. **Run frontend locally**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🎯 Usage Examples

### Sample Queries to Try
```
Show me all diabetic patients over 50
Find female patients with hypertension
List male cancer patients between 40 and 60
Show patients with asthma under 30
Display all patients
```

### API Usage
```bash
# Direct API call
curl -X POST "http://localhost:8000/api/query" \
  -H "Content-Type: application/json" \
  -d '{"text": "Find female patients with diabetes"}'
```

## 📊 Data Structure

### Generated Patient Data
Each patient includes:
- **Demographics**: Name, age, gender, birth date
- **Medical Conditions**: ICD-10 coded conditions
- **FHIR Compliance**: Proper Patient and Condition resources

### Example FHIR Response
```json
{
  "resourceType": "Patient",
  "id": "patient-001",
  "name": [{"family": "Smith", "given": ["John"]}],
  "gender": "male",
  "birthDate": "1970-05-15"
}
```

## 🔧 Development Notes

### What I Focused On

#### 1. **Natural Language Processing Excellence**
- **Pattern-based Entity Extraction**: Custom regex patterns for medical conditions, age ranges, and gender
- **Fallback Mechanisms**: Multiple extraction strategies to handle various query formats
- **Medical Terminology**: Comprehensive mapping of common medical conditions to ICD-10 codes
- **Query Suggestions**: Intelligent autocomplete based on common medical queries

#### 2. **FHIR Compliance & Healthcare Standards**
- **Proper Resource Structure**: Authentic FHIR Patient and Condition resources
- **ICD-10 Integration**: Real medical coding for conditions
- **Healthcare Data Realism**: Realistic patient demographics and medical histories
- **API Standards**: RESTful endpoints following healthcare API conventions

#### 3. **Modern User Experience Design**
- **2025 UI Standards**: Glass morphism, modern gradients, micro-interactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Optimized charts, lazy loading, efficient state management

#### 4. **Comprehensive Data Visualization**
- **Multiple Chart Types**: Bar charts for age distribution, pie charts for demographics
- **Interactive Features**: Hover effects, tooltips, clickable legends
- **Real-time Filtering**: Dynamic updates without page reloads
- **Export Capabilities**: Ability to save and share visualizations

#### 5. **Production-Ready Architecture**
- **Docker Containerization**: Multi-stage builds, optimized images
- **Environment Configuration**: Separate dev/prod configurations
- **Error Handling**: Comprehensive error responses and user feedback
- **API Documentation**: Automatic OpenAPI/Swagger documentation

#### 6. **Security Foundation**
- **HIPAA Compliance Documentation**: Detailed security requirements
- **RBAC System Design**: Four-tier access control (Admin, Doctor, Nurse, Auditor)
- **Data Privacy**: Simulated data approach for safe development
- **Input Validation**: SQL injection prevention, XSS protection

### What I Would Improve With More Time

#### 1. **Advanced AI/ML Integration** (Priority: High)
- **Transformer Models**: Integrate BERT/BioBERT for medical language understanding
- **Intent Classification**: ML-based query intent recognition
- **Medical NER**: Named Entity Recognition for medical terms
- **Query Expansion**: Automatic synonym and related term suggestions
- **Estimated Time**: 3-4 weeks

#### 2. **Real FHIR Server Integration** (Priority: High)
- **FHIR Client**: Connect to actual FHIR servers (Epic, Cerner, etc.)
- **SMART on FHIR**: OAuth 2.0 authentication flow
- **Resource Mapping**: Handle real FHIR resource variations
- **Pagination**: Handle large datasets efficiently
- **Estimated Time**: 2-3 weeks

#### 3. **Enhanced Security & Compliance** (Priority: High)
- **OAuth 2.0 Implementation**: Full authentication system
- **Audit Logging**: Comprehensive access logging
- **Data Encryption**: At-rest and in-transit encryption
- **HIPAA Audit Tools**: Compliance monitoring dashboard
- **Estimated Time**: 2-3 weeks

#### 4. **Advanced Analytics & Reporting** (Priority: Medium)
- **Predictive Analytics**: Disease progression models
- **Population Health**: Aggregate health statistics
- **Custom Reports**: User-defined report generation
- **Data Export**: Multiple format support (PDF, Excel, CSV)
- **Estimated Time**: 2-3 weeks

#### 5. **Performance & Scalability** (Priority: Medium)
- **Caching Layer**: Redis for query caching
- **Database Integration**: PostgreSQL with proper indexing
- **API Rate Limiting**: Protect against abuse
- **CDN Integration**: Static asset optimization
- **Estimated Time**: 1-2 weeks

#### 6. **Testing & Quality Assurance** (Priority: Medium)
- **Unit Tests**: Comprehensive backend test coverage
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Frontend user flow testing
- **Performance Tests**: Load testing for scalability
- **Estimated Time**: 2-3 weeks

#### 7. **Advanced UI/UX Features** (Priority: Low)
- **Dark Mode**: Complete theme system
- **Mobile App**: React Native companion
- **Offline Support**: Progressive Web App features
- **Customizable Dashboards**: User-defined layouts
- **Estimated Time**: 3-4 weeks

### Technical Challenges Overcome

1. **Complex Query Parsing**: Developed robust regex patterns to handle natural language variations
2. **FHIR Resource Generation**: Created realistic, compliant healthcare data structures
3. **Real-time Visualizations**: Implemented efficient Chart.js integration with filtering
4. **Docker Orchestration**: Set up multi-container development environment
5. **Modern UI Implementation**: Achieved 2025 design standards with glass morphism

### Architecture Decisions

1. **FastAPI over Flask**: Chosen for automatic API documentation and type hints
2. **Next.js over Create React App**: Better performance and SSR capabilities
3. **Chart.js over D3**: Faster implementation for standard chart types
4. **Docker Compose**: Simplified development setup and deployment
5. **Tailwind CSS**: Rapid prototyping and consistent design system

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

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Test Coverage
- Unit tests for NLP processing
- API endpoint integration tests
- Frontend component tests

## 📚 Additional Resources

- **FHIR Documentation**: http://hl7.org/fhir/
- **spaCy Documentation**: https://spacy.io/usage
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Next.js Documentation**: https://nextjs.org/docs

## 🐛 Troubleshooting

### Common Issues

**Docker Build Fails**
```bash
# Clean Docker cache
docker system prune -a
docker-compose build --no-cache
```

**Frontend Not Loading**
```bash
# Check if backend is running
curl http://localhost:8000/health
```

**CORS Errors**
- Ensure backend is running on port 8000
- Check frontend is accessing correct backend URL

## 📝 License

This project is for demonstration purposes as part of a technical assessment.

## 🤝 Contributing

This is a take-home assessment project. For questions or clarifications, please contact the development team.

---

**Note**: This application uses simulated data for demonstration purposes. In a production environment, it would interface with actual FHIR-compliant healthcare systems with proper security and compliance measures.