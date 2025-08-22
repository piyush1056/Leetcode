const {getLanguageById,submitBatch,submitToken} = require("../utils/ProblemUtility");
const Problem = require("../models/problem")

const createProblem = async (req,res)=>{
   
  // console.log(req.body);

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;


    

    try{
       
      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
        

        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
       const testResult = await submitToken(resultToken);

      //  console.log(testResult);
      
      //console.log(testResult);
         const statusMap = {
            1: 'In Queue',
            2: 'Processing',
            3: 'Accepted',
            4: 'Wrong Answer',
            5: 'Time Limit Exceeded',
            6: 'Compilation Error',
            7: 'Runtime Error',
        };

  for (const test of testResult) {

  const readableStatus = statusMap[test.status_id] || "Unknown";
  // console.log(`Test ${test.token}: Status ${test.status_id} (${readableStatus})`);

  if (test.status_id != 3) {
    return res.status(400).send(`Test failed: ${readableStatus}`);
    }
  }

  }
        //by now for all lang must have been tested 
        //if alright,we can store in DB now

      

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const updateProblem = async(req,res)=>{

    const{id} = req.params;

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;
   
    try{
       
      if(!id)
      {
        return res.status(400).send("ID missing");
      }

      const DsaProblem = await Problem.findById(id);

      if(!DsaProblem)
      {
         return res.status(400).send("Problem doesnt Exist");

      }
      for(const {language,completeCode} of referenceSolution){
  

        const languageId = getLanguageById(language);
          
        
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
        

        const resultToken = submitResult.map((value)=> value.token);

       const testResult = await submitToken(resultToken);

      //  console.log(testResult);
      
      //console.log(testResult);
         const statusMap = {
            1: 'In Queue',
            2: 'Processing',
            3: 'Accepted',
            4: 'Wrong Answer',
            5: 'Time Limit Exceeded',
            6: 'Compilation Error',
            7: 'Runtime Error',
        };

  for (const test of testResult) {

  const readableStatus = statusMap[test.status_id] || "Unknown";
  // console.log(`Test ${test.token}: Status ${test.status_id} (${readableStatus})`);

  if (test.status_id != 3) {
    return res.status(400).send(`Test failed: ${readableStatus}`);
    }
  }

  }
  //update now 
 const newProblem =  await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true,new:true});  //schema validate before saving in db and return new document
   
    res.status(200).send(newProblem);
 }
    catch(err)
    {
        res.status(404).send("Error:"+err)
    }
  
  }


const deleteProblem = async(req,res)=>{
  
  try {
   
   const {id} = req.params;
    if(!id)
    {
      return res.status(400).send("Id is Missing");
    }    
    
    const DsaProblem = await Problem.findById(id);

      if(!DsaProblem)
      {
         return res.status(400).send("Problem doesnt Exist");

      }

     const deletedProblem = await  Problem.findByIdAndDelete(id);

     res.status(200).send("Successfully deleted");

  }
   catch (err) {
    res.status(500).send("Error :"+err);
  }
}


const getProblemById = async(req,res)=>{

 
     
     try {
   
        const {id} = req.params;
         if(!id)
         {
            return res.status(400).send("Id is Missing");
         }  
         
         const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode')

         if(!getProblem)
         {
          return res.status(404).send("Problem is Missing")
         }

         res.status(200).send(getProblem);


  } 
  catch (error) {
    res.status(500).send("Error : "+error);
  }
}

const getAllProblem = async(req,res)=>{

  try {
        
         const getProblem = await Problem.find({}).select('_id title difficulty tags');

         if(getProblem.length==0)
         {
          return res.status(404).send("Problem is Missing")
         }

         res.status(200).send(getProblem);


  } 
  catch (error) {
    res.status(500).send("Error : "+error);
  }
}



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById , getAllProblem};

