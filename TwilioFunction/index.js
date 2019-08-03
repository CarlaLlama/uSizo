const request = require('request');
const storage = require('@google-cloud/storage')();

/**
 * Twilio Whatsapp Session Init
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.handler = function(context, event, callback) {
    let twiml = new Twilio.twiml.MessagingResponse();

    if(null === event){
        callback("null", null);
    }
    console.log(JSON.stringify(event));

    const messageText = event;
    console.log("Initiating Message lookup: " + messageText);

    if(event.NumMedia === "0"){
        callback("null", null);
    }

    twiml.message("THANKS FOR THE MESSAGE.");

    let numMedia = event.NumMedia;
    let imageName = Date.now() + '_name.jpg';
    numMedia.forEach(index => {
        if (event.hasOwnProperty(`MediaUrl${index.toString()}`)) {
            let mediaURL = event.get(`MediaUrl${index.toString()}`);
            console.log(`Begin upload image to Storage: ${mediaURL}, Image name: ${imageName}`);
            saveImageToStorage(mediaURL, 'usizo-image', imageName)
                .then((outputText) => {
                    twiml.message("Thanks for the message!");
                    callback(null, twiml);
                })
        }
    });

    callback(null, twiml);
};

function saveImageToStorage(attachmentUrl, bucketName, objectName) {
    const req = request(attachmentUrl);
    req.pause();
    req.on('response', res => {
        if (res.statusCode !== 200) {
            return;
        }
        const writeStream = storage.bucket(bucketName).file(objectName)
            .createWriteStream({
                metadata: {
                    contentType: res.headers['content-type']
                }
            });
        req.pipe(writeStream)
            .on('finish', () => console.log('saved'))
            .on('error', err => {
                writeStream.end();
                console.error(err);
            });

        // Resume only when the pipe is set up.
        req.resume();
    });
}
