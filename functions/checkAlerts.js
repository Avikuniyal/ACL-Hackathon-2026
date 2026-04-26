require("dotenv").config();

const urgentKeywords = [
    `fell`, `fall`, `scared`, `hurt`, `don't feel good`, 
    `cant breathe`, `can't breathe`, `pain`, `help`, `emergency`
];

function checkAlerts(transcript){
    const lowerTranscript = transcript.toLowerCase();

    for(const keyword of urgentKeywords){
        if(lowerTranscript.includes(keyword)){
            console.log("Urgent alert triggered by keyword: ", keyword);
            return "urgent";
        }
    }

    console.log("No alert keywords found");
    return "routine";
}

module.exports = {checkAlerts};

console.log("Test 1:", checkAlerts("I fell down this morning and hurt my arm"));    
console.log("Test 2:", checkAlerts("I had a lovely day and watched some TV"));