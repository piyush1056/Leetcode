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

//base64_encoded :make false ,bcz data is in js obj


  const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '53992d5f44msh08fb3903f4a6f1fp1b5904jsn1419a137a299',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions     
  }
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

 return await fetchData();

}


const waiting = (timer) => new Promise((resolve) => setTimeout(resolve, timer));


// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(','),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '53992d5f44msh08fb3903f4a6f1fp1b5904jsn1419a137a299',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


 while(true){

 const result =  await fetchData(); //we got the final result as array of object form


  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;//if true ,returns ,and loop breaks


  
  await waiting(1000);//wait for 1sec

}


}


module.exports = {getLanguageById,submitBatch,submitToken};











