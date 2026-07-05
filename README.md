# Healthcare Query System

A healthcare data prototype that translates plain-language clinical questions into simulated FHIR-style API query parameters.

Example prompt:

```text
Show me all diabetic patients over 50.
```

Example normalized intent:

```json
{
  "resource": "Patient",
  "filters": {
    "condition": "diabetes",
    "age": { "gt": 50 }
  }
}
```

## Goal

Clinical and operations teams often think in natural language, while healthcare systems expose structured APIs. This project explores the translation layer between those two modes: parsing a request, identifying the clinical entity, and converting it into a predictable query shape.

## Concepts Demonstrated

- Natural-language request parsing
- Healthcare query intent extraction
- FHIR-inspired resource and filter modeling
- API request simulation
- Clear examples for validating behavior

## Potential Stack

- Python
- FastAPI or Flask
- FHIR-style query parameters
- Rule-based parser or LLM-assisted parser

## Next Steps

- Add executable parser code and request/response examples.
- Add tests for common patient, observation, condition, and encounter queries.
- Document supported entities and unsupported phrasing.
- Connect the parser to a mock FHIR server for end-to-end demos.

## Status

Concept/prototype documentation. The README is intentionally explicit about the expected system behavior so future implementation can be tested against concrete examples.
