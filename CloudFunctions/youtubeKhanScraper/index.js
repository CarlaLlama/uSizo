let search = require('scrape-youtube');
const request = require('request');
const cheerio = require('cheerio');



/**
 * Triggered from a message on a Cloud Pub/Sub topic 'scrape'
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.startScrape = (event, context) => {
    const topicToScrape = event.data;
    console.log(Buffer.from(topicToScrape, 'base64').toString());

    search(`Khan Academy ${topicToScrape}`, {
        limit : 10,
        type : "video"
    }).then(function(results){
        results.forEach(result => {
            console.log(`Title: ${result.title} , link: ${result.link}`);
        });
    }, function(err){
        console.log(err);
    });
};


