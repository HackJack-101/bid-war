import mongoose, { Schema } from 'mongoose';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export interface UserInterface {
    event: string;
    token: string;
    username: string;
}

const User = new Schema<UserInterface>(
    {
        event: { default: 'streamlabscharitydonation', type: String },
        token: { required: true, type: String, unique: true },
        username: { index: true, required: true, type: String, unique: true },
    },
    {
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
        timestamps: true,
    },
);

User.index({ createdAt: 1 });
User.index({ updatedAt: 1 });

User.plugin(mongooseLeanVirtuals);
User.plugin(mongooseLeanDefaults);

export default mongoose.model('User', User);
