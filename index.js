import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { promises as fs, unlinkSync, existsSync, mkdirSync } from 'fs';
import { GoogleGenAI } from '@google/genai';

const UPLOAD_DIR = './uploads';
// Create the upload directory if it doesn't exist
if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR);
}

const app = express();
// Configure multer to save files to the uploads directory
const upload = multer({ dest: UPLOAD_DIR });
const ai = new GoogleGenAI({ apiKey : process.env.API_KEY});

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post('/generate-text', async(req, res) => {
    const { prompt } = req.body;
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt
        });

        res.status(200).json({ result: response.text});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Creates a route handler for generating content from a file.
 * @param {string} defaultPrompt - The default prompt to use if one isn't provided in the request.
 * @returns {import('express').RequestHandler}
 */
const generateFromFileHandler = (defaultPrompt) => async (req, res) => {
    const { prompt } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'File is required.' });
    }

    try {
       const fileBuffer = await fs.readFile(file.path);
       const base64Data = fileBuffer.toString("base64");
       const response = await ai.models.generateContent({
           model: GEMINI_MODEL,
           contents: [
               { text: prompt ?? defaultPrompt , type: "text" },
               { inlineData: { data: base64Data, mimeType: file.mimetype }}
            ],
       });

       res.status(200).json({ result: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        unlinkSync(file.path);
    }
};

app.post("/generate-from-image", upload.single("image"), generateFromFileHandler("Describe this image."));
app.post("/generate-from-document", upload.single("document"), generateFromFileHandler("Please make a summary of the following document."));
app.post("/generate-from-audio", upload.single("audio"), generateFromFileHandler("Please make a transcript of the following recording."));
