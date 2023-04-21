import { Request, Response } from 'express';

import UserModel, { UserInterface } from './user.model';
import DonationModel from '../donation/donation.model';
import SocketService from '../../services/socket.service';
import configuration from '../../configuration';

export default class UserController {
    static async create(req: Request, res: Response): Promise<Response> {
        const { username, token } = req.body;

        if (!username || !token) {
            return res.sendStatus(400);
        }

        const existantUser = await UserModel.findOne({ username });
        if (existantUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const createdUser = new UserModel({ username, token });
        await createdUser.save();

        const socket = new SocketService(createdUser);
        socket.open();

        return res.status(201).json(createdUser);
    }

    static async getOne(req: Request, res: Response): Promise<Response> {
        const { username } = req.params;

        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Username does not exist' });
        }
        const donations = await DonationModel.find({ username }).sort({ createdAt: -1 }).limit(10).lean();

        return res.json(donations);
    }

    static async getAll(req: Request, res: Response): Promise<Response> {
        const users = await UserModel.find({}).lean();

        const response = users.map((user: UserInterface) => {
            return {
                bidWar: `${configuration.apiUrl}/api/bidwar/${user.username}/{hashtag}/{hashtag}`,
                lastDonations: `${configuration.apiUrl}/api/user/${user.username}`,
                username: user.username,
            };
        });

        return res.json(response);
    }
}
