import mongoose, { Schema } from 'mongoose';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface DonationInterface {
    _slID: string;
    amount: number;
    hashtag: string;
    isTest: boolean;
    type: string;
    username: string;
}

const Donation = new Schema<DonationInterface>(
    {
        _slID: { type: String, unique: true, required: true },
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

Donation.index({ createdAt: 1 });
Donation.index({ updatedAt: 1 });

Donation.plugin(mongooseLeanVirtuals);
Donation.plugin(mongooseLeanDefaults);

export default mongoose.model('Donation', Donation);
