const request = require('request');
const storage = require('@google-cloud/storage')();

exports.handler = function(context, event, callback) {
    twiml = new Twilio.twiml.MessagingResponse();

    if(null === event.Body){
        callback("null", null);
    }
    console.log(JSON.stringify(event.Body));
    //upload picture

    //get results from wolfram

    const messageText = event.Body;
    console.log("Initiating Message lookup: " + messageText);

    let numMedia = event.Body.numMedia;
    let imageName = Date.now() + '_name.jpg';
    numMedia.forEach(index => {
        if (event.Body.hasOwnProperty(`MediaUrl${index.toString()}`)) {
            let mediaURL = event.Body.get(`MediaUrl${index.toString()}`);
            console.log(`Begin upload image to Storage: ${mediaURL}, Image name: ${imageName}`);
            saveImageToStorage(mediaURL, 'usizo-image', imageName)
                .then((outputText) => {
                    twiml.message("Thanks for the message!");
                    callback(null, twiml);
                })
        }
    });
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
