const validator = require("validator");
const CustomError = require("./CustomError");

const validateDetails = {

   
    login: (loginDetails) => {
        const { emailId, password } = loginDetails;

        if (!(emailId && password))
            throw new CustomError("Email and password are required", 400);

        if (!validator.isEmail(emailId))
            throw new CustomError("Invalid email address", 400);
    },

    register: (registerationDetails) => {

    const { fullName, emailId, password } = registerationDetails;
    
    if (!(fullName && emailId && password))
    throw new CustomError("Full name, email, and password are required", 400);

     if (fullName.trim().length < 3 || fullName.trim().length > 50) 
    throw new CustomError("Full name must be between 3 and 50 characters", 400);

        if (!validator.isEmail(emailId))
            throw new CustomError("Invalid email address", 400);

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }))
            throw new CustomError("Password must be at least 8 characters with uppercase, lowercase, number and symbol", 400);
    },

    // Validate problem creation details
    problem: (problemDetails) => {
        const mandatoryFields = [
            "title",
            "problemNo",
            "description",
            "difficulty",
            "tags",
            "startCode",
            "visibleTestCases",
            "hiddenTestCases",
            "referenceSolution",
        ];

        const givenFields = Object.keys(problemDetails);
        const missingFields = mandatoryFields.filter(field => !givenFields.includes(field));

        if (missingFields.length > 0)
            throw new CustomError(`Missing required fields: ${missingFields.join(', ')}`, 400);

        // Validate types
        if (!Array.isArray(problemDetails.tags) || problemDetails.tags.length === 0)
            throw new CustomError("Tags must be a non-empty array", 400);

        if (!Array.isArray(problemDetails.startCode) || problemDetails.startCode.length === 0)
            throw new CustomError("startCode must be a non-empty array", 400);

        if (!Array.isArray(problemDetails.visibleTestCases) || problemDetails.visibleTestCases.length === 0)
            throw new CustomError("visibleTestCases must be a non-empty array", 400);

        if (!Array.isArray(problemDetails.hiddenTestCases) || problemDetails.hiddenTestCases.length === 0)
            throw new CustomError("hiddenTestCases must be a non-empty array", 400);

        if (!Array.isArray(problemDetails.referenceSolution) || problemDetails.referenceSolution.length === 0)
            throw new CustomError("referenceSolution must be a non-empty array", 400);

        const validDifficulties = ["easy", "medium", "hard", "super-hard"];
        if (!validDifficulties.includes(problemDetails.difficulty.toLowerCase()))
            throw new CustomError(`Difficulty must be one of: ${validDifficulties.join(', ')}`, 400);

        if (typeof problemDetails.problemNo !== 'number' || problemDetails.problemNo < 1)
            throw new CustomError("problemNo must be a positive number", 400);
    },

    // Validate submission details
    submission: (submissionDetails) => {
        const {  problemId, code, language } = submissionDetails;

        if (!( problemId && code && language))
            throw new CustomError("problemId, code, and language are required", 400);

        const validLanguages = ['javascript', 'c++', 'java', 'python', 'c'];
        if (!validLanguages.includes(language.toLowerCase()))
            throw new CustomError(`Language must be one of: ${validLanguages.join(', ')}`, 400);

        if (code.trim().length < 10)
            throw new CustomError("Code must be at least 10 characters long", 400);
    },

    // Validate username (for profile updates)
    username: (username) => {
        if (!username || username.trim().length < 3 || username.trim().length > 20)
            throw new CustomError("Username must be between 3 and 20 characters", 400);

        if (!/^[a-z0-9_]+$/.test(username.toLowerCase()))
            throw new CustomError("Username can only contain letters, numbers, and underscores", 400);
    },

    // Validate video upload details
    videoUpload: (videoDetails) => {
        const { problemId, cloudinaryPublicId, secureUrl, duration } = videoDetails;

        if (!(problemId && userId && cloudinaryPublicId && secureUrl && duration))
            throw new CustomError("All video fields are required", 400);

        if (typeof duration !== 'number' || duration <= 0)
            throw new CustomError("Duration must be a positive number", 400);
    }
};

module.exports = validateDetails;
