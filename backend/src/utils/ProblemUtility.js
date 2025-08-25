const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{

  //checkppoints
    if (!Array.isArray(submissions) || submissions.length === 0) {
    throw new Error('submissions must be a non-empty array');
  }

  const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key':  process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions     
  },
   timeout: 15000,
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
}

 return await fetchData();

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

async function fetchData() {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
}


//  while(true){

//  const result =  await fetchData(); //we got the final result as array of object form


//   const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

//   if(IsResultObtained)
//     return result.submissions;//if true ,returns ,and loop breaks


  
//   await waiting(1000);//wait for 1sec

// }
const maxRetries = 30;
const delay = 1000;

for (let attempt = 0; attempt < maxRetries; attempt++) {
  try {
    const result = await fetchData();

   if (!result || !Array.isArray(result.submissions)) {
    throw new Error('Invalid response from Judge0');
  }

    const allDone = result.submissions.every(sub => sub.status_id > 2);
   
    if (allDone)
       return result.submissions;

  } catch (err) {
    // transient error — ignore and retry
  }

  await waiting(delay);
}

throw new Error('Polling timed out after 30 seconds');


}


module.exports = {getLanguageById,submitBatch,submitToken};











