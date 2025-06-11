# JobHunt Backend

This repository contains the backend services for JobHunt, consisting of two main components:

1. A NestJS-based raw jobs scraper
2. A Python-based mature job processor

## Project Structure

```
jobzhunt-backend/
├── jobScraper/           # Job processing system
    ├── matureJob/       # Python-based mature job processor
    └── rawJobs/         # NestJS-based Service

```

## Components

### Raw Jobs Scraper (NestJS)

The raw jobs scraper is built using NestJS and handles the initial scraping of job postings:

- Scrapes job listings from various sources
- Performs initial data cleaning and validation
- Stores raw job data in MongoDB

#### Setup Instructions for Raw Jobs Scraper

1. Navigate to the raw jobs directory:

```bash
cd jobScraper/rawJobs
```

2. Install dependencies:

```bash
pnpm install
```

3. Development:

```bash
# Start in development mode
pnpm run start
```

### Mature Job Processor (Python)

The mature job processor is built in Python and handles the processing of raw job postings:

- Processes job postings from MongoDB
- Validates application types using Playwright and LinkedIn
- Updates job status in the database

#### Setup Instructions for Mature Job Processor

1. Navigate to the mature job directory:

```bash
cd jobScraper/matureJob
```

2. Create and activate a virtual environment:

On macOS/Linux:

```bash
python3.11 -m venv venv
source venv/bin/activate
```

On Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
python -m playwright install chromium
```

4. Run the processor:

```bash
python main.py
```
