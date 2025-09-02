const Problem = require("../models/problem")
const Submission = require("../models/submission");
const {getLanguageById,submitBatch,submitToken} = require("../utils/ProblemUtility")

const submitCode = async(req,res)=>{
 
    try {
    
        const userId = req.result._id; //from user middleware
        const problemId = req.params.id;

        let {code,language} = req.body;
        
        if(!userId || !code || !problemId || !language)
            return res.status(400).send("some field missing");

         if(language==='cpp')
        language='c++'

        //  fetch the problem from DB
        const problem  = await Problem.findById(problemId);

        if (!problem) {
         return res.status(404).json({ error: "Problem not found" });
        }
 
        //   testcases(hidden)


       // first store the submission code ,then check on judge0 
        const submittedResult = await Submission.create({
        userId,
        problemId,
        code,
        language,
        status:'pending',
        testCasesTotal:problem.hiddenTestCases.length
       })
     
       //submit code to judge0

       const languageId = getLanguageById(language);

       const submissions = problem.hiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value)=> value.token);

        const testResult = await submitToken(resultToken);

        //update submittedResult now
      
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "accepted";
        let errorMessage = null;

        for(const test of testResult)
        {
            if(test.status_id==3)
            {
              testCasesPassed++; 
              runtime = runtime+parseFloat(test.time);
              memory = Math.max(memory,test.memory);
            }
            else
            {
                if(test.status_id==4){
                
                    status = "Compilation Error";
                    errorMessage = test.stderr; 
                }
                else
                {
                    status="wrong";
                    errorMessage = test.stderr
                } 
            }

        }
  
        //store the result in DB
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;

        await submittedResult.save();   //or by findByIdandUpdate

        //add problem id in problemSolved of user if unique
         
        if(!req.result.problemSolved.includes(problemId))
        {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }
       const accepted  = (status == 'accepted');
        res.status(201).
        json({
            accepted,
            totalTestCases : submittedResult.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory
        });

    }
    catch (err) {
     
        console.error("Error in submitCode:", err);
        res.status(500).send("Internal Server Error");

    }
}

const runCode = async(req,res)=>{
    
     // 
     try{
      const userId = req.result._id;
      const problemId = req.params.id;

      let {code,language} = req.body;

     if(!userId||!code||!problemId||!language)
       return res.status(400).send("Some field missing");

   //    Fetch the problem from database
      const problem =  await Problem.findById(problemId);
   //    testcases(Hidden)
      if(language==='cpp')
        language='c++'


   const languageId = getLanguageById(language);

   const submissions = problem.visibleTestCases.map((testcase)=>({
       source_code:code,
       language_id: languageId,
       stdin: testcase.input,
       expected_output: testcase.output
   }));


   const submitResult = await submitBatch(submissions);
   
   const resultToken = submitResult.map((value)=> value.token);

   const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }

   
  
   res.status(201).json({
    success:status,
    testCases: testResult,
    runtime,
    memory
   });
      
   }
   catch(err){
     res.status(500).send("Internal Server Error "+ err);
   }
}

module.exports ={submitCode,runCode};