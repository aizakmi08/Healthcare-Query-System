FROM python:3.12-slim

WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt .

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y build-essential \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY backend/ .

# Expose port
EXPOSE 8000

# Start the application
CMD ["python", "main.py"] 