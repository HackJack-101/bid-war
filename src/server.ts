import bodyParser from 'body-parser';
import compression from 'compression';
import enforce from 'express-sslify';
import express from 'express';
import helmet from 'helmet';

import configuration from './configuration';
import routes from './entities';
import { openSockets } from './services/user.service';

openSockets();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (configuration.env === 'clever') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(compression());

app.use('*', (req, res, next) => {
    console.log('req', req.baseUrl);

    return next();
});
app.use('/api/', routes);

export default app;
