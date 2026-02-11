const utils = {

    sleep: (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    },

    getDayDifferenceFromDate: (dateInput) => {
        const inputDate = new Date(dateInput);
        const now = new Date();

        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const inputDateUTC = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate()));

        const diffTime = todayUTC - inputDateUTC;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays; // negative for future, 0 for today, positive for past
    },

    getTodayUTC: () => {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
            .toISOString().split('T')[0];
    },

    getPreviousDate: (dateStr, daysBack = 1) => {
        const date = new Date(dateStr + "T00:00:00Z");
        date.setUTCDate(date.getUTCDate() - daysBack);
        return date.toISOString().split('T')[0];
    },

    getNextDate: (dateStr, daysAhead = 1) => {
        const date = new Date(dateStr + "T00:00:00Z");
        date.setUTCDate(date.getUTCDate() + daysAhead);
        return date.toISOString().split('T')[0];
    },

    compareDates: (dateStr1, dateStr2) => {
        if (dateStr1 < dateStr2) return -1;
        if (dateStr1 > dateStr2) return 1;
        return 0;
    },

    // Update user streaks based on last solve date
     updateStreaks: (
     currentStreaks = { current: 0, longest: 0, lastUpdated: new Date() }
     ) =>{
        const lastUpdated = currentStreaks.lastUpdated;
        const daysSinceLastUpdate = utils.getDayDifferenceFromDate(lastUpdated);

        let current = currentStreaks.current;
        let longest = currentStreaks.longest;

        if (daysSinceLastUpdate === 0) {
            // Same day, no change
            return { current, longest, lastUpdated: new Date() };
        } else if (daysSinceLastUpdate === 1) {
            // Consecutive day, increment streak
            current += 1;
            longest = Math.max(longest, current);
        } else {
            // Streak broken, reset to 1
            current = 1;
        }

        return {
            current,
            longest,
            lastUpdated: new Date()
        };
    },

    calculatePoints: (difficulty, isFirstSolve = true) => {
        const pointsMap = {
            "easy": 10,
            "medium": 20,
            "hard": 30,
            "super-hard": 50
        };
       if (!difficulty) return 0;
        const basePoints = pointsMap[difficulty.toLowerCase()] || 10;
        return isFirstSolve ? basePoints : Math.floor(basePoints * 0.5); // Half points for re-solving
    },

    // Summarize submissions by date for heatmap/calendar view
    summarizeSubmissionsByDate: (submissions) => {
        const summaryMap = {};

        for (const item of submissions) {
            const date = new Date(item.createdAt).toISOString().split('T')[0];
            const status = item.status.toLowerCase();

            if (!summaryMap[date]) {
                summaryMap[date] = {
                    date,
                    count: 0,
                    acceptedCount: 0,
                    runtimeErrorCount: 0,
                    errorCount: 0,
                    wrongCount: 0,
                    tleCount: 0,
                    pendingCount: 0
                };
            }

            summaryMap[date].count++;
            if (status === 'accepted') summaryMap[date].acceptedCount++;
            else if (status === 'wrong') summaryMap[date].wrongCount++;
            else if (status === 'tle') summaryMap[date].tleCount++;
            else if (status === 'runtime-error') summaryMap[date].runtimeErrorCount++;
            else if (status === 'error') summaryMap[date].errorCount++;
            else if (status === 'pending') summaryMap[date].pendingCount++;
        }

        return Object.values(summaryMap).sort((a, b) => a.date.localeCompare(b.date));
    },

    getMappedValue: (value) => {
        const mappings = {
            "emailId": "Email Address",
            "username": "Username",
            "firstName": "First Name",
            "lastName": "Last Name",
            "password": "Password"
        };
        return mappings[value] || value;
    },

};

module.exports = utils;
