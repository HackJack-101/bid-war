import UserModel from '../entities/user/user.model';
import SocketService from './socket.service';

export async function openSockets() {
    const users = await UserModel.find().lean();
    users.forEach((user) => {
        const socket = new SocketService(user);
        socket.open();
    });
}
