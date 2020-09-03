const mongoose = require('mongoose');
const shortId = require('shortid');

const shortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        /** 
         * 'shortId.generate' will generate ID for each shorten URL. 
         *  This function comes from the 'shortid' library.
        */
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
