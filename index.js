'use strict';
const Alexa = require('alexa-sdk');
var request = require('request');


//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  const APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
const APP_ID = undefined;



//Return the question from this array item
function getQuestion(counter, property, item)
{

	
	return "Okay. Now, " + item.Question;
	
    
}



const interestingResponses = ["Interesting. ", "I see. ", "Uh huh. ", "Thank you. ", "Alright then, "];


const suretyStatements = [ "How confident are you in your answer?", 
                           "Would you necessarily say that all the time?", 
                           //"Is that your final answer?", 
                           "Are you sure about that?",
                           "Would you answer that question the same way if I asked you again?"];


//This is the welcome message for when a user starts the skill without a specific intent.
const WELCOME_MESSAGE = "Welcome to the Daemon Allocator! This pseudo-scientific quiz will allocate you a technology Daemon based on your personality. To start, say start quiz.";//"Welcome to the United States Quiz Game!  You can ask me about any of the fifty states and their capitals, or you can ask me to start a quiz.  What would you like to do?";

//This is the message a user will hear when they start a quiz.
const START_QUIZ_MESSAGE = "I'm going to ask you some questions to determine your Jungian personality type.";//"OK.  I will ask you 10 questions about the United States.";

//This is the message a user will hear when they try to cancel or stop the skill, or when they finish a quiz.
const EXIT_SKILL_MESSAGE = "Thanks for your quiz answers. Next step is to calculate the response.";//"Thank you for playing the United States Quiz Game!  Let's play again soon!";

//This is the message a user will hear when they ask Alexa for help in your skill.
const HELP_MESSAGE = "I'll map your answers, based on how certain you sound, to the open-source Jungian score, and allocate you a daemon based on your personality type.";//"I know lots of things about the United States.  You can ask me about a state or a capital, and I'll tell you what I know.  You can also test your knowledge by asking me to start a quiz.  What would you like to do?";


//This is the response a user will receive when they ask about something we weren't expecting.  For example, say "pizza" to your
//skill when it starts.  This is the response you will receive.
function getBadAnswer(item) { return "I'm sorry. " + item + " is not something I know very much about in this skill. " + HELP_MESSAGE; }

//These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
//This only happens outside of a quiz.

//If you don't want to use cards in your skill, set the USE_CARDS_FLAG to false.  If you set it to true, you will need an image for each
//item in your data.
const USE_CARDS_FLAG = true;

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) { return item.StateName;}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
function getSmallImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/720x400/" + item.Abbreviation + "._TTH_.png"; }

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
function getLargeImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/1200x800/" + item.Abbreviation + "._TTH_.png"; }

//=========================================================================================================================================
//TODO: Replace this data with your own.
//=========================================================================================================================================

const personalityTypes = new Object();
personalityTypes["ESTJ"] = "DevOps";
personalityTypes["ISTJ"] = "Server-side development";
personalityTypes["ENTJ"] = "DevOps";
personalityTypes["INTJ"] = "Server-side development";
personalityTypes["ESTP"] = "Technology Scout";
personalityTypes["ISTP"] = "Server-side development";
personalityTypes["ENTP"] = "Technology Scout";
personalityTypes["INTP"] = "Server-side development";
personalityTypes["ESFJ"] = "DevOps";
personalityTypes["ISFJ"] = "DevOps";
personalityTypes["ENFJ"] = "Agile Coaching";
personalityTypes["INFJ"] = "Agile Coaching";
personalityTypes["ESFP"] = "Front-end Development";
personalityTypes["ISFP"] = "Front-end Development";
personalityTypes["ENFP"] = "Front-end Development";
personalityTypes["INFP"] = "Agile Coaching";


const psyData = [
                 {Question: "Do you prefer to make lists, or do you rely on memory?"},
                 {Question: "Are you sceptical, or do you want to believe?"},
                 {Question: "How about time alone. Are you bored by time alone, or do you need time alone?"},
                 {Question: "Do you accept things as they are, or are you unsatisfied with the way things are?"},
                 {Question: "Do you keep a clean room, or do you just put stuff wherever?"},
                 {Question: "Do you think the term robotic is an insult, or do you strive to have a mechanical mind?"},
                 {Question: "Would you describe yourself as energetic, or mellow?"},
                 {Question: "Would you rather sit a multiple choice test, or do you prefer essay answers?"},
                 {Question: "Do you describe yourself as chaotic, or organised?"},
                 {Question: "Are you easily hurt, or are you more thick skinned?"},
                 {Question: "Do you work best in groups, or do you prefer to work alone?"},
                 {Question: "Are you focussed on the present, or on the future?"},
                 {Question: "Do you plan far ahead, or do you plan at the last minute?"},
                 {Question: "What do you want most from people, their respect or their love?"},
                 {Question: "Do you get worn out by parties, or do you get fired up by parties?"},
                 {Question: "Do you like to fit in, or do you like to stand out?"},
                 {Question: "Do you prefer to keep your options open, or do you like to commit to something?"},
                 {Question: "Do you want to be good at fixing things, or do you want to be good at fixing people?"},
                 {Question: "Do you talk more, or do you listen more?"},
                 {Question: "Think about when you describe an event. Do you tell people what happened, or do you tell them what it meant?"},
                 {Question: "Do you get work done right away, or do you procrastinate?"},
                 {Question: "Do you follow your heart, or follow your head?"},
                 {Question: "Do you like to stay at home, or do you prefer to go out on the town?"},
                 {Question: "Do you want the big picture, or do you want the details?"},
                 {Question: "Do you improvise, or do you prepare?"},
                 {Question: "Do you find it difficult to yell very loudly, or if others are far away does yelling come naturally to you?"},
                 {Question: "Would you describe yourself as theoretical, or empirical?"},
                 {Question: "Do you work hard, or do you play hard?"},
                 {Question: "Would you describe yourself as uncomfortable with emotions, or do you value emotions?"},
                 {Question: "Do you like to perform in front of other people, or do you avoid public speaking?"},
                 {Question: "Do you like to know Who, What, When or do you like to know Why?"}
                 ];



//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const states = {
    START: "_START",
    QUIZ: "_QUIZ",
    ASSERT: "_ASSERT"
};

const handlers = {
     "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
     },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

const startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function() {
        this.response.speak(WELCOME_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "QuizIntent": function() {
    	console.log("QuizIntent Intent");
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.PauseIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


const assertHandlers = Alexa.CreateStateHandler(states.ASSERT, {
	
	 "AssertionIntent" : function() {
		 
		 console.log("AssertionIntent in assert");
		 
		 	let response = "";
	        let speechOutput = "";
	        let item = this.attributes["quizitem"];
	        let property = this.attributes["quizproperty"];
	        let score = this.attributes["score"];

	        
	        console.log(' Slots ' + this.event.request.intent.slots);
	    
	        var answer = getSlot(this.event.request.intent.slots);
	        
	        while(answer.length < 10) {
	        	// ten characters required for sentiment analysis, if yes or no just duplicate
	        	answer += (" " + answer);
	        }
	        

	        console.log('Calling sentiment API with ' + answer);
	        
	        request({
				  url: 'https://api.theysay.io/v1/sentiment',
				  method: 'POST',
				  headers: {
				    Accept: 'application/json',
				    'Content-Type': 'application/json',
				    'Authorization' : 'Basic c2FyYWguc2F1bmRlcnNAY2FwZ2VtaW5pLmNvbTo1bVh1VXZ4Mml6UWwxYnhJYmkybQ=='
				  },
				  body: JSON.stringify({
				    "text": answer,
				    "level": "sentence"
				  })
				},  (error, resp, body) => {
					console.log('REturn from sentiment analysis, HTTP status code ' + resp.statusCode);
				  if (!error && resp.statusCode == 200) {
				    console.log('BODY: ', body);
				    var jsonResponse = JSON.parse(body); // turn response into JSON

				    // do stuff with the response and pass it to the callback...
				    let sentiment = jsonResponse[0].sentiment.label;
				    
				    console.log('Sentiment is ' + sentiment);
				    
				    var result = -1;
				    if(sentiment === 'POSITIVE') {
				    	result = 1;
				    } else if (sentiment === 'NEGATIVE') {
				    	result = 0;
				    } else {
				    	//negative is greatest
				    	console.log('Label is neutral');
				    }
				    
				 // Use this to calculate 1 to 5 for the previous response, and save this in the answer array.
			    	// Algorithm: response 1 and +ve  : 1. response 1 and neutral : 2. response 1 and -ve : 3.
			    	// response 2 and -ve : 3. response 5 and neutral : 4. response 5 and +ve : 5. 
			    	if(score == 1 && result == 0) {
			    		score = 2;
			    	}
			    	if(score == 1 && result == -1) {
			    		score = 3;
			    	}
			    	if(score == 5 && result == 0) {
			    		score = 4;
			    	}
			    	if(score == 5 && result == -1) {
			    		score = 3;
			    	}
				    
				    //let newArr = new Array(this.attributes["type"].length + 1);
				    //var i = 0;
				    //for(; i < this.attributes["type"].length; i++) {
				    //	newArr[i] = this.attributes["type"][i];
				    //}
				    
				    
				    //newArr[i] = JSON.stringify({"question" : this.attributes["counter"], "score": score});
				    this.attributes["type"][this.attributes["counter"]] = JSON.stringify({"question": this.attributes["counter"], "score": score});//newArr;
				    
				  } else {
					  
					  console.log('Failed to connect to sentiment analysis - ' + error);
					  
					  //let newArr = new Array(this.attributes["type"].length + 1);
					   // var i = 0;
					    //for(; i < this.attributes["type"].length; i++) {
					    //	newArr[i] = this.attributes["type"][i];
					    //}
					    
					    
					    //newArr[i] = 
					    this.attributes["type"][this.attributes["counter"]] = JSON.stringify({"question" : this.attributes["counter"], "score": score});
					    console.log("SentimentError - Set new score of " + score);
					    //this.attributes["type"] = newArr;
				  }
		 
				  if (this.attributes["counter"] < 15) // debug set to 15 should be //psyData.length)
		        	{
		        		this.attributes["response"] = ""; // so it's not the start quiz message any more
						this.handler.state = states.QUIZ;
						this.emitWithState("AskQuestion");


		        	}
		        	else
		        	{
		        		console.log('End of quiz, question answers are ' + this.attributes["quizscore"]);
		        		console.log("Scores are " + this.attributes["type"]);

		        		
		        		const output = calculateScore(this.attributes["type"]);
		        		

		        		this.response.speak(output);
		        		this.emit(":responseReady");
		        	}
					    
				  
				  
         
				});
	 },
	 
"AMAZON.RepeatIntent": function() {
    let question = suretyStatements[getRandom(0, suretyStatements.length - 1)];// doesn't matter if this is a different question as all have the same meaning
    this.response.speak(question).listen(question);
    this.emit(":responseReady");
},
"AMAZON.StartOverIntent": function() {
    this.emitWithState("Quiz");
},
"AMAZON.StopIntent": function() {
    this.response.speak(EXIT_SKILL_MESSAGE);
    console.log('StopIntent');
    this.emit(":responseReady");
},
"AMAZON.PauseIntent": function() {
    this.response.speak(EXIT_SKILL_MESSAGE);
    console.log('PauseIntent');

    this.emit(":responseReady");
},
"AMAZON.CancelIntent": function() {
    this.response.speak(EXIT_SKILL_MESSAGE);
    console.log('CancelIntent');

    this.emit(":responseReady");
},
"AMAZON.HelpIntent": function() {
    this.response.speak("Try a positive, neutral, or negative response").listen("Try a positive, neutral, or negative response");
    this.emit(":responseReady");
},
"Unhandled": function() {
	console.log("Assertion unhandled");
	
	// We won't bother trying to fix
	
	this.handler.state = states.QUIZ;
    this.emitWithState("AnswerIntent");
}
});


const quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
    "Quiz": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = "";
        this.attributes["type"] = new Array(psyData.length);
        for(var i = 0; i < (psyData.length); i++) {
        	this.attributes["type"][i] = JSON.stringify({"question" : i, "score": 3});
        }
        
        this.emitWithState("AskQuestion");
        
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }

        let item = psyData[this.attributes["counter"]];

        let propertyArray = Object.getOwnPropertyNames(item);
        let property = propertyArray[getRandom(1, propertyArray.length-1)];

        this.attributes["quizitem"] = item;
        this.attributes["quizproperty"] = property;
        this.attributes["counter"]++;

        /* Test set all questions
         * this.attributes["counter"] = psyData.length;
        var newArr = new Array(psyData.length - 1);

        for (var i = 0; i < (psyData.length - 1); i++) {
    	    newArr[i] = JSON.stringify({"question" : (i+1), "score": (Math.floor(Math.random() * Math.floor(5)) + 1)});
        }
	    this.attributes["type"] = newArr;
        	console.log('Set up type as ' + newArr);
         end test set all questions */
        	
        let question = getQuestion(this.attributes["counter"], property, item);
        let speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
      
    },
    "AnswerIntent": function() {
		 
		 		 
	        let response = "";
	        let speechOutput = "";
	        let item = this.attributes["quizitem"];
	        let property = this.attributes["quizproperty"];

	        this.handler.state = states.ASSERT;
	        
	        if(this.event.request.intent) {
	           console.log('Slots: ' +this.event.request.intent.slots);
		}
	    
	        let answer = getSlot(this.event.request.intent.slots);
	        
	        console.log('Looking for question at index ' + this.attributes["counter"] - 1);
	        let question = psyData[this.attributes["counter"] - 1];
	        console.log('Found ' + question.Question);
	        var score = 0;
			if(question && question.Question) {
				console.log('Looking for ' + question.Question.indexOf('or'));
				console.log('Is it less than ' + question.Question.indexOf(answer) + '?');
				if(question.Question.indexOf(answer) > question.Question.indexOf('or')) {
					// answered to the negative
					score = 5;
				} else {
					score = 1;
				}
			} else {
				console.log('ERROR = Could not find question ');
			}
	        console.log('Score currently ' + score);
	        this.attributes["score"] = score;
	        
	        this.attributes["quizscore"] += answer;
	        
	        
	        // Finish stuff
	        response = interestingResponses[getRandom(0, interestingResponses.length-1)];
	        
	        	
	        this.emit(":ask", response + suretyStatements[getRandom(0, suretyStatements.length - 1)], "Please could you repeat that?");

	},
    "AMAZON.RepeatIntent": function() {
        let question = getQuestion(this.attributes["counter"], this.attributes["quizproperty"], this.attributes["quizitem"]);
        this.response.speak(question).listen(question);
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        console.log('StopIntent in Answer');

        this.emit(":responseReady");
    },
    "AMAZON.PauseIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        console.log('PauseIntent in Answer');

        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        console.log('CancelIntent in Answer');

        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function calculateScore(type) {
	
	// TODO calculate
	//IE = 30 - __ - __ - __ + __ - __ + __ + __ - __ = ___
	// (Q3) (Q7) (Q11) (Q15) (Q19) (Q23) (Q27) (Q31)
	
	console.log('Calcualates core, type of length ' + type.length);
	console.log(type[6]);
	console.log(type[30]);
	console.log(JSON.parse(type[6]));
	console.log(JSON.parse(type[30]));

	let ieConstant = 30 - JSON.parse(type[2]).score 
		- JSON.parse(type[6]).score
		- JSON.parse(type[10]).score
		- JSON.parse(type[14]).score
		- JSON.parse(type[18]).score
		- JSON.parse(type[22]).score
		- JSON.parse(type[26]).score
		- JSON.parse(type[30]).score;
		
	// if IE > 24, Extroverted (E) else Introverted (I)

	let ieString = "I";
	if(ieConstant > 24) {
		ieString = "E";
	}
	console.log("IE constant " + ieConstant + ", IE " + ieString );
	//SN = 12 + __ + __ + __ + __ + __ - __ - __ + __ = ___
	 //(Q4) (Q8) (Q12) (Q16) (Q20) (Q24) (Q28) (Q32)
	let snConstant = 12 + JSON.parse(type[3]).score 
	+ JSON.parse(type[7]).score
	+ JSON.parse(type[11]).score
	+ JSON.parse(type[15]).score
	+ JSON.parse(type[19]).score
	- JSON.parse(type[23]).score
	- JSON.parse(type[27]).score;
	//+ JSON.parse(type[31]).score;
	
	// if SN > 24, Intuitive (N) else Sensing (S)

let snString = "S";
if(snConstant > 24) {
	snString = "I";
}
console.log("SN constant " + snConstant + ", SN " + snString );

//FT = 30 - __ + __ + __ - __ - __ + __ - __ - __ = ____
 //(Q2) (Q6) (Q10) (Q14) (Q18) (Q22) (Q26) (Q30)
let ftConstant = 30 - JSON.parse(type[1]).score 
+ JSON.parse(type[5]).score
+ JSON.parse(type[9]).score
- JSON.parse(type[13]).score
- JSON.parse(type[17]).score
+ JSON.parse(type[21]).score
- JSON.parse(type[25]).score;
- JSON.parse(type[29]).score;

// If FT > 24, Thinking (T) else Feeling (F)

let ftString = "F";
if(ftConstant > 24) {
ftString = "T";
}
console.log("FT constant " + ftConstant + ", FT " + ftString );


//JP = 18 + __ + __ - __ + __ - __ + __ - __ + __ = ____
//(Q1) (Q5) (Q9) (Q13) (Q17) (Q21) (Q25) (Q29)

let jpConstant = 18 + JSON.parse(type[0]).score 
+ JSON.parse(type[4]).score
- JSON.parse(type[8]).score
+ JSON.parse(type[12]).score
- JSON.parse(type[16]).score
+ JSON.parse(type[20]).score
- JSON.parse(type[24]).score;
+ JSON.parse(type[28]).score;



// IF JP > 24, Perceiving (P) else judging (J)

let jpString = "J";
if(jpConstant > 24) {
jpString = "P";
}
console.log("JP constant " + jpConstant + ", JP " + jpString );

// Combine letters to get output
let typeCode = ieString + snString + ftString + jpString;
let strength = personalityTypes[typeCode];



let output = "Thank you for taking the quiz. Your personality type is " + ieString +", "+ snString +", "+ ftString +", "+ jpString 
+". We guess from this that your strengths lie in " + strength;

return output;

}


function compareSlots(slots, value)
{
    for (let slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getSlot(slots) {
	for (let slot in slots)
    {
		console.log('Slot ' + slots[slot].value);
        if (slots[slot].value !== undefined)
        {
            return slots[slot].value;
           
        }
    }	
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getItem(slots)
{
    let propertyArray = Object.getOwnPropertyNames(data[0]);
    let value;

    for (let slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (let property in propertyArray)
            {
                let item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{

    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item)
{
    let text = "";

    for (let key in item)
    {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers, assertHandlers);
    alexa.execute();
};
