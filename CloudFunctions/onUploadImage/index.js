// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision');
// Creates a client
const client = new vision.ImageAnnotatorClient();

/* TODO: Remove the following and replace them with Environment Variables" */
const bucketName = 'usizo-images';

/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.onImageUploadToStorage = (event, context) => {
    console.log(`Processing file: ${event.name}`);q

    // Path to uploaded image is event.name
    const fileName = event.name;
    let result = readImage(fileName);

    const fullTextAnnotation = result.fullTextAnnotation;
    if(fullTextAnnotation.text ){
        console.log(fullTextAnnotation.text);
    } else {
        console.log('No text found.');
    }
    return;

};

async function readImage(fileName){
    // Read a remote image as a text document
    const [result] = await client.documentTextDetection(
        `gs://${bucketName}/${fileName}`
    );
    return result;
}
