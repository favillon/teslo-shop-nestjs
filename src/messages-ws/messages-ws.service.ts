import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

import { User } from '../auth/entities/users.entity';

interface ConectClientes {
    [id: string] : {
        socket : Socket,
        user : User
    }
}
@Injectable()
export class MessagesWsService {

    private connectedClients: ConectClientes = {};

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async registerClient(client: Socket, clientId: string) {
        const user = await this.userRepository.findOneBy({ id: clientId });
        if (!user)
           throw new Error('User not found');

        if (!user.isActive)
            throw new Error('User not active');

        this.checkUserConnection(user);
        this.connectedClients[client.id] = {
            socket : client,
            user,
        };
    }
    removeClient(client: Socket) {
        delete this.connectedClients[client.id];
    }

    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);
    }

    getUserBySocketId(socketId: string): string {
        return this.connectedClients[socketId]?.user.fullName;
    }

    private checkUserConnection(user: User){
        for (const clientId  of Object.keys(this.connectedClients)) {
            const client = this.connectedClients[clientId];
            if (client.user.id === user.id) {
                delete this.connectedClients[clientId];
                break;
            }
        }
    }
}
