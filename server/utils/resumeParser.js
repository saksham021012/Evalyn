import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { parseResumeWithAI } from '../services/aiService.js';

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (fileBuffer) => {
    try {
        const data = await pdfParse(fileBuffer);
        return {
            success: true,
            text: data.text
        };
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Extract text from DOCX file
 */
export const extractTextFromDOCX = async (fileBuffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return {
            success: true,
            text: result.value
        };
    } catch (error) {
        console.error('Error extracting text from DOCX:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Main resume parsing function
 */
export const parseResume = async (fileBuffer, fileType) => {
    try {
        // Step 1: Extract text based on file type
        let extractionResult;

        if (fileType === 'pdf') {
            extractionResult = await extractTextFromPDF(fileBuffer);
        } else if (fileType === 'docx') {
            extractionResult = await extractTextFromDOCX(fileBuffer);
        } else {
            return {
                success: false,
                error: 'Unsupported file type'
            };
        }

        if (!extractionResult.success) {
            return extractionResult;
        }

        const rawText = extractionResult.text;

        // Step 2: Use AI to parse the text into structured data
        const aiParseResult = await parseResumeWithAI(rawText);

        if (!aiParseResult.success) {
            return {
                success: false,
                error: 'Failed to parse resume with AI',
                rawText
            };
        }

        return {
            success: true,
            rawText,
            parsedData: aiParseResult.data
        };

    } catch (error) {
        console.error('Error in parseResume:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Suggest difficulty based on resume
 */
export const suggestDifficulty = (parsedData) => {
    const experienceLevel = parsedData.experienceLevel;
    const yearsOfExperience = parsedData.totalYearsOfExperience;

    if (experienceLevel === 'fresher' || yearsOfExperience < 1) {
        return 'easy';
    } else if (experienceLevel === 'junior' || yearsOfExperience <= 2) {
        return 'medium';
    } else {
        return 'hard';
    }
};
