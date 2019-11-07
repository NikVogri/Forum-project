const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes/apiRoutes');
const viewRouter = require('./routes/viewRouter');

const app = express();
const port = process.env.PORT || 3000;

// Set pug as view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'front')));
// Limiter middleware config - limit requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // api request limit
  statusCode: 429,
  message: {
    status: 'error',
    message: 'Limit reached please wait a couple of minutes before trying again'
  }
});
// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(limiter);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// APP ROUTE
app.use('/', viewRouter);

// API ROUTE
app.use('/api/v1', apiRoutes);

// SERVER
app.listen(port, () => {
  console.log(`Server launched on port ${port}`);
});
