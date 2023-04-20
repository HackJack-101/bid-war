import mongoose from 'mongoose';

import app from './server.js';
import configuration from './configuration.js';

if (configuration.mongoUri) {
    mongoose
        .connect(configuration.mongoUri, {
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            socketTimeoutMS: 30000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Successful connection to MongoDB'))
        .catch((err) => console.log('Failed to connect to MongoDB. error: ', err));
}

app.listen(configuration.port, () => {
    console.log(`The server is listening on port ${configuration.port}`);
});
