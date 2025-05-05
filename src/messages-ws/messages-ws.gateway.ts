import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interfaces';


@WebSocketGateway({cors: true})
export class MessagesWsGateway  implements OnGatewayConnection, OnGatewayDisconnect {

  private clientMessageCount = 0;

  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwt: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.auth as string;
    let payload: JwtPayload
    try {
      payload = this.jwt.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return ;
    }
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
   }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageClient(client: Socket, payload: NewMessageDto) {
    this.clientMessageCount++;
    // Emite al mismo cliente
    /*client.emit('message-from-server', {
      fullName : `Yo Naranjas Cantidad de mensajes: ${this.clientMessageCount}`,
      message: payload.message || 'no message',
    });*/

    // Emite a todos los clientes menos al que lo envió
    /*client.broadcast.emit('message-from-server', {
      fullName : this.messagesWsService.getUserBySocketId(client.id),
      message: payload.message || 'no message',
    });*/

    this.wss.emit('message-from-server', {
      fullName : this.messagesWsService.getUserBySocketId(client.id),
      message: payload.message || 'no message',
    });
  }
}
