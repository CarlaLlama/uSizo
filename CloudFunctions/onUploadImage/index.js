// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision');
//usizo answres bucket
const Storage = require('@google-cloud/storage');
const store = new Storage();
const bucket = store.bucket('usizo-images');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/* TODO: Remove the following and replace them with Environment Variables" */
const bucketName = 'usizo-images';
//wolfram api create client
var wolfram = require('wolfram').createClient("H24G5X-8Y6X92H7JG")

/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.onImageUploadToStorage = (event, context) => {

    console.log(`Processing file: ${event.name}`);

    // Path to uploaded image is event.name
    const fileName = event.name;
    let result = readImage(fileName)
        .then(result => {
            console.log(`Result json: ${JSON.stringify(result)}`);

            const fullTextAnnotation = result.fullTextAnnotation;
            if(fullTextAnnotation && fullTextAnnotation.hasOwnProperty('text')){
                console.log(fullTextAnnotation.text);
                postToWolfram(fullTextAnnotation.text);


            } else {
                console.log('No text found.');
            }
            return;

        });
};

async function readImage(fileName){
    // Read a remote image as a text document
    const [result] = await client.documentTextDetection(
        `gs://${bucketName}/${fileName}`
    );
    return result;
}

function postToWolfram(result){
    const options = {
        destination: "/usizo-answers/answerimage"
    };
    let answer = wolfram.query(result, function(err, answer) {
        if(err) throw err


        console.log("Answer: %j", answer)
        console.log("proccessed",answer[1].subpods);
        console.log("proccessed",answer[1].subpods[0]);
        console.log("proccessed",answer[1].subpods[0].image);

        bucket.upload(''+answer[1].subpods[0].image, options).then(function(data) {
            const file = data[0];
        });

        return answer;

    });
}
