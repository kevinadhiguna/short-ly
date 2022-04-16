const express = require('express');
const mongoose = require('mongoose');
const { createHttpTerminator } = require("http-terminator");

const ShortUrl = require('./models/shortUrl');
const app = express();

require("dotenv").config();

const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;

mongoose.connect(MONGODB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async(req,res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async(req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});

app.get('/:shortUrl', async(req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

    // Error Handling if the shorten url doesn't exist
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++
    shortUrl.save();

    res.redirect(shortUrl.full)
});

const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

const server = app.listen(PORT, HOSTNAME, () => {
  console.log(`Server has been launched on ${HOSTNAME}:${PORT}`);
});

const httpTerminator = createHttpTerminator({ server });

async function shutdown(signalOrEvent) {
  console.log(`\n${signalOrEvent} occured, shutting down...`);
  try {
    await httpTerminator.terminate();
    console.log("Terminated the server successfully !");
    process.exit(0);
  } catch (errorShutdown) {
    console.error(`Error shutting down the server: ${errorShutdown}`) 
    process.exit(1);
  }  
}

// Signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Events
process.on("uncaughtException", shutdown);
process.on("unhandledRejection", shutdown);
