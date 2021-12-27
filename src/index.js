'use strict';

// This line must come before importing any instrumented module.
require('dd-trace').init();
const Express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const status = require('./routes/status');
const routes = require('./routes/payments');
require('./startup/startup-mongo')();
const logger = require("./helpers/logger");
const options = require('../documentation/options');

const app = new Express();

app.use(cors());

app.use('/payments', status);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options));
app.use('/payments/v1', routes);

const port = process.env.PORT || 8080;
const external_port = process.env.APP_EXTERNAL_PORT || 5000;

app.listen(port, () => logger.info(`App listening on port ${port} and external port ${external_port}`));

module.exports = app;
