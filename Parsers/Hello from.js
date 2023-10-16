/*
activation_example:hellofrom
regex:(hellofrom)|(hello\sfrom) 
flags:gmi
*/

var responses = [
    ["IST","Delhi, India"],
    ["PST","San Diego, USA"],
    ["GMT","London, UK"],
    ["JST","Tokyo, Japan"],
    ["CET","Budapest, Hungary"]
];
var randNumber=parseInt(Math.random() * responses.length);
var currentDateTime=new GlideDateTime();
var strConvertedDateTime= new GlideScheduleDateTime(currentDateTime).convertTimeZone("UTC", responses[randNumber][0]); 
var gdtConvertedDateTime = new GlideDateTime(strConvertedDateTime); 

var response="Hello from " + responses[randNumber][1] + ". Our current time is " + gdtConvertedDateTime;
//gs.info(response);

var send_chat = new x_snc_slackerbot.Slacker().send_chat(current, response, true);
