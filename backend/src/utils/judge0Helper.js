
const axios = require('axios');

const getLanguageId = (lang) => {
    const languageMap = {
        "c++": 54,
        "java": 62,
        "javascript": 63,
        "c": 50,
        "cpp": 54,
        "python": 92
    };
    return languageMap[lang.toLowerCase()] || null;
};

// HELPER: Clean code to prevents windows \r artifacts and ensure newlines
const clean = (code) => (code ? code.replace(/\r\n/g, '\n').trim() : '');

const buildFullSourceCode = ({ problem, language, userCode }) => {
    const start = problem.startCode.find(sc => sc.language === language);
    if (!start) throw new Error("Starter code not found for selected language");

    const header = clean(start.headerCode);
    const main = clean(start.mainCode);
    const user = clean(userCode);

    //  Ensure clean separation between imports, user class, and driver code
    return `${header}\n\n${user}\n\n${main}`;
};

const buildFullSourceCodeForValidation = ({ startCode, language, userCode }) => {
    const start = startCode.find(sc => sc.language === language);
    if (!start) throw new Error("Starter code not found for selected language");

    const header = clean(start.headerCode);
    const main = clean(start.mainCode);
    const user = clean(userCode); // Reference Solution

    // Reference solutions usually include the full class/function definition.
    // Including initialCode (e.g., "class Solution {") + userCode creates a syntax error.
    
    return `${header}\n\n${user}\n\n${main}`;
};

const submitBatch = async (submissions) => {
    if (!Array.isArray(submissions) || submissions.length === 0) {
        throw new Error('submissions must be a non-empty array');
    }

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: { base64_encoded: 'false', wait: 'false' },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: { submissions },
        timeout: 30000,
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Judge0 batch submission error:', error.message);
        throw new Error('Failed to submit code to Judge0');
    }
};

const waiting = (timer) => new Promise((resolve) => setTimeout(resolve, timer));

const submitToken = async (resultToken) => {
    if (!Array.isArray(resultToken) || resultToken.length === 0) {
        throw new Error('resultToken must be a non-empty array of tokens');
    }

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(','),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    const maxRetries = 15;
    const delay = 2000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await axios.request(options);
            const result = response.data;

            if (!result || !Array.isArray(result.submissions)) {
                throw new Error('Invalid response from Judge0');
            }

            // Check if all submissions are processed (Status > 2)
            const allDone = result.submissions.every((r) => r.status.id !== 1 && r.status.id !== 2);

            if (allDone) return result.submissions;

        } catch (err) {
            if (!err.response && attempt === maxRetries - 1) {
                throw new Error('Judge0 polling failed after maximum retries');
            }
        }
        await waiting(delay);
    }
    throw new Error('Polling timed out after 30 seconds');
};

const createSubmissionPayload = ({ code, language, testCase }) => {
    const language_id = getLanguageId(language);
    if (!language_id) throw new Error(`Unsupported language: ${language}`);

    return {
        language_id,
        source_code: code,
        stdin: testCase.input,
        expected_output: testCase.output,
        cpu_time_limit: 5, 
        memory_limit: 128000,
    };
};

const mapJudge0Status = (statusId) => {
    const statusMap = {
        1: 'pending',
        2: 'pending',
        3: 'accepted',
        4: 'wrong',
        5: 'tle',
        6: 'error',
        7: 'runtime-error',
        8: 'runtime-error',
        9: 'runtime-error',
        10: 'runtime-error',
        11: 'runtime-error',
        12: 'runtime-error',
        13: 'error',
        14: 'error'
    };
    return statusMap[statusId] || 'error';
};

module.exports = {
    getLanguageId,
    submitBatch,
    submitToken,
    createSubmissionPayload,
    mapJudge0Status,
    waiting,
    buildFullSourceCode,
    buildFullSourceCodeForValidation
};






