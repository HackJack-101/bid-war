import { Request, Response } from 'express';

import UserModel, { UserInterface } from '../user/user.model';
import DonationModel, { DonationInterface } from '../donation/donation.model';

export default class BidWarController {
    static async get(req: Request, res: Response): Promise<Response> {
        const { username, firstHashtag, secondHashtag } = req.params;
        const withTests: boolean = !!req.query.test;

        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Username does not exist' });
        }

        const filters: Partial<DonationInterface> = {
            username,
        };
        if (!withTests) {
            filters.isTest = false;
        }

        const first = await DonationModel.find({ ...filters, hashtag: firstHashtag.toLocaleLowerCase(['fr-FR', 'en-US']) })
            .select({ amount: 1 })
            .lean();
        const second = await DonationModel.find({ ...filters, hashtag: secondHashtag.toLocaleLowerCase(['fr-FR', 'en-US']) })
            .select({ amount: 1 })
            .lean();

        const firstAmount = first.reduce((acc: number, donation: DonationInterface) => {
            return acc + donation.amount;
        }, 0);
        const secondAmount = second.reduce((acc: number, donation: DonationInterface) => {
            return acc + donation.amount;
        }, 0);

        return res.json({
            firstResult: {
                hashtag: firstHashtag,
                amount: firstAmount,
            },
            secondResult: {
                hashtag: secondHashtag,
                amount: secondAmount,
            },
        });
    }
}
