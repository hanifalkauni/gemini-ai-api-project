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

app.post("/generate-from-image", upload.single("image"), async (req, res) => {
    const { prompt } = req.body;

    try {
       const fileBuffer = await fs.readFile(req.file.path);
       const base64Image = fileBuffer.toString("base64");
       const response = await ai.models.generateContent({
           model: GEMINI_MODEL,
           contents: [
               { text: prompt , type: "text" },
               { inlineData: { data: base64Image, mimeType: req.file.mimetype }}
            ],
       });

       res.status(200).json({ result: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up the uploaded file
        if (req.file) {
            unlinkSync(req.file.path);
        }
    }
});

app.post("/generate-from-document", upload.single("document"), async (req, res) => {
    const { prompt } = req.body;

    try {
       const fileBuffer = await fs.readFile(req.file.path);
       const base64Document = fileBuffer.toString("base64");
       const response = await ai.models.generateContent({
           model: GEMINI_MODEL,
           contents: [
               { text: prompt ?? "Tolong buat ringkasan dari dokumen berikut" , type: "text" },
               { inlineData: { data: base64Document, mimeType: req.file.mimetype }}
            ],
       });

       res.status(200).json({ result: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up the uploaded file
        if (req.file) {
            unlinkSync(req.file.path);
        }
    }
});

app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
    const { prompt } = req.body;

    try {
        const fileBuffer = await fs.readFile(req.file.path);
        const base64Audio = fileBuffer.toString("base64");
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt ?? "Tolong buatkan transkrip dari rekaman berikut" , type: "text" },
                { inlineData: { data: base64Audio, mimeType: req.file.mimetype }}
            ],
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up the uploaded file
        if (req.file) {
            unlinkSync(req.file.path);
        }
    }
});
