# Gemini Flash API

A Node.js Express API that integrates with Google's Gemini AI to generate content from text, images, documents, and audio files.

## Features

- **Text Generation**: Generate AI responses from text prompts
- **Image Analysis**: Upload images and get AI-generated descriptions or analysis
- **Document Processing**: Upload documents and get summaries or analysis
- **Audio Transcription**: Upload audio files and get transcriptions

## Prerequisites

- Node.js (v14 or higher)
- Google AI API Key (Gemini)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hanifalkauni/gemini-ai-api-project.git
cd gemini-flash-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Google AI API key to the `.env` file:
```
GEMINI_API_KEY=your_google_ai_api_key_here
PORT=3000
```

## Usage

Start the server:
```bash
node index.js
```

The server will run on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### 1. Generate Text
**POST** `/generate-text`

Generate AI content from a text prompt.

**Request Body:**
```json
{
  "prompt": "Your text prompt here"
}
```

**Response:**
```json
{
  "result": "AI generated response"
}
```

### 2. Generate from Image
**POST** `/generate-from-image`

Upload an image and get AI analysis or description.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `image`: Image file (required)
  - `prompt`: Text prompt for image analysis (optional)

**Response:**
```json
{
  "result": "AI analysis of the image"
}
```

### 3. Generate from Document
**POST** `/generate-from-document`

Upload a document and get AI summary or analysis.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `document`: Document file (required)
  - `prompt`: Text prompt for document analysis (optional)

**Response:**
```json
{
  "result": "AI summary or analysis of the document"
}
```

### 4. Generate from Audio
**POST** `/generate-from-audio`

Upload an audio file and get transcription.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `audio`: Audio file (required)
  - `prompt`: Text prompt for audio processing (optional)

**Response:**
```json
{
  "result": "Audio transcription"
}
```

## Example Usage

### Using curl

**Text Generation:**
```bash
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing in simple terms"}'
```

**Image Analysis:**
```bash
curl -X POST http://localhost:3000/generate-from-image \
  -F "image=@path/to/your/image.jpg" \
  -F "prompt=Describe this image"
```

**Document Processing:**
```bash
curl -X POST http://localhost:3000/generate-from-document \
  -F "document=@path/to/your/document.pdf" \
  -F "prompt=Summarize this document"
```

**Audio Transcription:**
```bash
curl -X POST http://localhost:3000/generate-from-audio \
  -F "audio=@path/to/your/audio.mp3" \
  -F "prompt=Transcribe this audio"
```

## Dependencies

- **express**: Web framework for Node.js
- **multer**: Middleware for handling multipart/form-data (file uploads)
- **@google/genai**: Google AI SDK for Gemini integration
- **dotenv**: Environment variable management

## File Structure

```
gemini-flash-api/
├── uploads/          # Temporary file upload directory
├── .env             # Environment variables (not in repo)
├── .env.example     # Environment variables template
├── .gitignore       # Git ignore rules
├── index.js         # Main application file
├── package.json     # Project dependencies and scripts
├── package-lock.json # Dependency lock file
└── README.md        # This file
```

## Error Handling

The API includes error handling for:
- Invalid requests
- File upload errors
- Google AI API errors
- Server errors

All errors return a JSON response with an error message:
```json
{
  "error": "Error description"
}
```

## Security Notes

- Uploaded files are automatically deleted after processing
- Keep your Google AI API key secure and never commit it to version control
- The uploads directory is created automatically if it doesn't exist

## License

ISC
