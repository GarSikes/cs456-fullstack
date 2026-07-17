var express = require('express');
var path = require('path');
var hbs = require('hbs');
const db = require('./app_server/models/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server/views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/layout' });

// register the partials folder (header.hbs, footer.hbs)
hbs.registerPartials(path.join(__dirname, 'app_server/views/partials'));

// helper used by header/footer partials to highlight the active nav item
hbs.registerHelper('ifEquals', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

// static assets (css, images, and the not-yet-converted static pages)
app.use(express.static(path.join(__dirname, 'public')));

// routes
var travelRouter = require('./app_server/routes/index');
app.use('/', travelRouter);

app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});
