import io from 'socket.io-client';

import DonationModel from '../entities/donation/donation.model';
import { UserInterface } from '../entities/user/user.model';

const regex = /(\S+)/gim;

type EventDataMessageType = {
    name: string;
    isTest: boolean;
    formattedAmount: string;
    formatted_amount: string;
    currency: 'USD' | 'EUR';
    twitchDisplayName: string;
    amount: number;
    message: string;
    to: unknown;
    from: string;
    id: number;
    userId: number;
    campaignId: number;
    createdAt: string;
    _id: string;
    priority: number;
};

type EventDataType = {
    type: 'streamlabscharitydonation';
    message: Array<EventDataMessageType>;
    for: 'streamlabscharity';
    event_id: string;
};

export default class SocketService {
    private client: SocketIOClient.Socket;
    private username: string;
    private type: string;

    constructor(user: UserInterface) {
        const { token, username, event } = user;
        this.client = io(`https://sockets.streamlabs.com?token=${token}`, { transports: ['websocket'] });
        this.username = username;
        this.type = event;
    }

    open(): void {
        this.client.on('event', (eventData: EventDataType) => {
            if (eventData.type === this.type) {
                console.log('[socket]', this.type, eventData.event_id);
                if (eventData.message.length > 0) {
                    Promise.all(
                        eventData.message.map(async (donation: EventDataMessageType) => {
                            try {
                                const regexResults = donation.message.match(regex);
                                if (!regexResults) {
                                    return;
                                }
                                if (regexResults.length > 0) {
                                    const newDonation = new DonationModel({
                                        _messageID: donation.id,
                                        _slID: donation._id,
                                        amount: donation.amount,
                                        hashtag: regexResults[0],
                                        isTest: donation.isTest ?? false,
                                        username: this.username,
                                    });

                                    await newDonation.save();
                                    return newDonation;
                                }
                            } catch (e) {
                                console.error('[socket] error:', e);
                            }
                        }),
                    ).catch((e) => console.error('socket donation error', e));
                }
            }
        });
    }

    close(): void {
        this.client.close();
    }
}
