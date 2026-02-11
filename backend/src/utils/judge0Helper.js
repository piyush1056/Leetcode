const axios = require('axios');

const getLanguageId = (lang)=>{

    const languageMap = {
        "c++":54,
        "java":62,
        "javascript":63,
        "c": 50, 
        "cpp": 54, 
         "python": 92 

    }

 return languageMap[lang.toLowerCase()] || null;
}

const submitBatch = async (submissions)=>{

    if (!Array.isArray(submissions) || submissions.length === 0) {
    throw new Error('submissions must be a non-empty array');
  }

  const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false',
     wait: 'false'
  },
  headers: {
    'x-rapidapi-key':  process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions     
  },
   timeout: 30000,
};

try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Judge0 batch submission error:', error.message);
        throw new Error('Failed to submit code to Judge0');
    }

}

const waiting = (timer) => new Promise((resolve) => setTimeout(resolve, timer));

const submitToken = async(resultToken)=>{

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



const maxRetries = 30;
const delay = 1000;

for (let attempt = 0; attempt < maxRetries; attempt++) {
  try {
    const response = await axios.request(options);
            const result = response.data;

   if (!result || !Array.isArray(result.submissions)) {
    throw new Error('Invalid response from Judge0');
  }

     const allDone = result.submissions.every(sub => {const statusId = sub.status_id || (sub.status && sub.status.id);return statusId != null && statusId > 2;});
   
    if (allDone)
       return result.submissions;

  } catch (err) {
    // transient error — ignore and retry
    if (!err.response && attempt === maxRetries - 1) {
                throw new Error('Judge0 polling failed after maximum retries');
            }
  }

  await waiting(delay);
}

throw new Error('Polling timed out after 30 seconds');


}

const createSubmissionPayload = ({ code, language, testCase }) => {
    const language_id = getLanguageId(language);
    
    if (!language_id) {
        throw new Error(`Unsupported language: ${language}`);
    }

    return {
        language_id,
        source_code: code,
        stdin: testCase.input,
        expected_output: testCase.output,
        cpu_time_limit: 3,   
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
        13: 'error',    // Internal Error
        14: 'error'     // Exec Format Error
    };

    return statusMap[statusId] || 'error';
};

module.exports = {
    getLanguageId,
    submitBatch,
    submitToken,
    createSubmissionPayload,
    mapJudge0Status,
    waiting
};











