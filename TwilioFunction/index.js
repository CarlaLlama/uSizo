
exports.handler = function(context, event, callback) {
    twiml = new Twilio.twiml.MessagingResponse();

    if(null === event.Body){
        callback("null", null);
    }

    const messageText = event.Body;
    console.log("Initiating Message lookup: " + messageText);

    createModel(messageText).then((outputText) => {
        twiml.message(outputText);
        callback(null, twiml);
    });


};
