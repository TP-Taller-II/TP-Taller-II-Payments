'use strict';

const Express = require('express');
// const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const routes = require('./routes/payments');
require('./startup/startup-mongo')();

const app = new Express();

app.use(cors());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options));
app.use('/payments/v1', routes);

const port = process.env.PORT || 8080;
const external_port = process.env.APP_EXTERNAL_PORT || 5000;

app.listen(port, () => console.log(`App listening on port ${port} and external port ${external_port}`));

module.exports = app;
