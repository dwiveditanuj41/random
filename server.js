require('dotenv').config({ path: '.env.production' });

const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
const session = require('express-session');
const companion = require('@uppy/companion');
const cors = require('cors');
app.use(require('cookie-parser')());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(require('compression')());

app.use(cors());
app.use(
  session({
    secret: 'test-secret',
    resave: true,
    saveUninitialized: true,
  }),
);
const options = {
  providerOptions: {
    google: {
      key: process.env.COMPANION_GOOGLE_KEY,
      secret: process.env.COMPANION_GOOGLE_SECRET,
    },
    dropbox: {
      key: process.env.COMPANION_DROPBOX_KEY,
      secret: process.env.COMPANION_DROPBOX_SECRET,
    },
    s3: {
      getKey: (req, filename) => {
        return filename;
      },
      key: process.env.COMPANION_AWS_KEY,
      secret: process.env.COMPANION_AWS_SECRET,
      bucket: process.env.COMPANION_AWS_BUCKET,
      region: process.env.COMPANION_AWS_REGION,
    },
  },
  server: {
    host: process.env.COMPANION_DOMAIN,
    protocol: 'https',
  },
  filePath: process.env.COMPANION_DATADIR,
  secret: process.env.COMPANION_SECRET,
  debug: true,
};
app.use(companion.app(options));

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

companion.socket(app.listen(3000), options);
