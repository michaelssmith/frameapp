const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const path = require('path');
const morgan = require('morgan');
const expressHbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000;
const carLookupRouter = require('./src/routes/carLookupRoutes.js')();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine
app.set('view engine', 'hbs');

// Configure the view engine
app.engine('hbs', expressHbs({
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
  defaultLayout: 'main',
  extname: 'hbs',
}));

// Configure the views path
app.set('views', path.join(__dirname, 'src/views/pages'));

app.use('/', carLookupRouter);

app.listen(port, '0.0.0.0', () => {
  debug(`listening on port #${chalk.green(port)}`);
});
