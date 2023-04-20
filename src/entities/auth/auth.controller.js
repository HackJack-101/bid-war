import axios from 'axios';

import configuration from '../../configuration.js';

export default class AuthController {
    static async oAuth(req, res) {
        const code = req.query.code;

        let data = JSON.stringify({
            grant_type: 'authorization_code',
            client_id: configuration.clientId,
            client_secret: configuration.clientSecret,
            redirect_uri: configuration.clientRedirectUri,
            code: code,
        });

        const getTokenConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://streamlabs.com/api/v2.0/token',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        try {
            const tokenResponse = await axios.request(getTokenConfig);
            if (!tokenResponse.data) {
                throw new Error('No data');
            }

            const { token_type, expires_in, access_token, refresh_token } = tokenResponse.data;

            const getUserData = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://streamlabs.com/api/v2.0/user',
                headers: {
                    accept: 'application/json',
                    Authorization: `${token_type} ${access_token}`,
                    'Content-Type': 'application/json',
                },
            };

            const userResponse = await axios.request(getUserData);

            return res.json(userResponse.data);
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    }
}
