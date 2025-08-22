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


module.exports = createProblem;


// const submissions = [
//     {
//       "language_id": 46,
//       "source_code": "echo hello from Bash",
//       stdin:23,
//       expected_output:43,
//     },
//     {
//       "language_id": 123456789,
//       "source_code": "print(\"hello from Python\")"
//     },
//     {
//       "language_id": 72,
//       "source_code": ""
//     }
//   ]