import mongoose, { Schema } from 'mongoose';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface DonationInterface {
    _slID: string;
    _messageID?: number;
    amount: number;
    hashtag: string;
    isTest: boolean;
    type: string;
    username: string;
}

const Donation = new Schema<DonationInterface>(
    {
        _slID: { type: String, unique: true, required: true },
        _messageID: { type: Number },
        amount: { type: Number, required: true },
        hashtag: { type: String, required: true },
        isTest: { type: Boolean, index: true, required: true, default: false },
        type: { type: String, default: 'streamlabscharitydonation' },
        username: { type: String, index: true, required: true },
    },
    {
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
        timestamps: true,
    },
);

Donation.pre('save', function (next) {
    if (this.hashtag) {
        this.hashtag = this.hashtag.toLocaleLowerCase(['fr-FR', 'en-US']);
    }

    return next();
});

Donation.index({ createdAt: 1 });
Donation.index({ updatedAt: 1 });

Donation.plugin(mongooseLeanVirtuals);
Donation.plugin(mongooseLeanDefaults);

export default mongoose.model('Donation', Donation);
