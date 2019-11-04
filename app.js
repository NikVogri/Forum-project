const express = require('express');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // api request limit
  statusCode: 429,
  message: {
    status: 'error',
    message: 'Limit reached please wait a couple of minutes before trying again'
  }
});

app.use(limiter);
// API ROUTE
app.use('/api/v1', apiRoutes);

// SERVER
app.listen(port, () => {
  console.log(`Server launched on port ${port}`);
});
