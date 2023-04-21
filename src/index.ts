import mongoose from 'mongoose';

import app from './server';
import configuration from './configuration';

if (configuration.mongoUri) {
    mongoose
        .connect(configuration.mongoUri, {
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            socketTimeoutMS: 30000,
        })
        .then(() => {
            console.log('Successful connection to MongoDB');
            app.listen(configuration.port, () => {
                console.log(`The server is listening on port ${configuration.port}`);
            });
        })
        .catch((err) => console.log('Failed to connect to MongoDB. error: ', err));
} else {
    throw new Error('Server need MONGODB_ADDON_URI');
}
