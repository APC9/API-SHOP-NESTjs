import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces'; 

@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,

    private readonly jwtService: JwtService,
    ) {}
 
  async handleConnection(client: Socket) {
    //! Esto viene de la aplicacion front
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {

      payload = await this.jwtService.verify(token);
      const { id } = payload;

      await this.messagesWsService.registerClient(client, id);
      this.wss.emit('clients-update', this.messagesWsService.getconnectedClients() )

    } catch (error) {
      client.disconnect();
      return;
    }

  }
  
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClients(client.id)
    this.wss.emit('clients-update', this.messagesWsService.getconnectedClients() )
  }

  @SubscribeMessage('message-client')
  handleMessageClient(client: Socket, payload: NewMessageDto) {
    //! Emite unicamente al cliente que envia el mensage
    /* client.emit('message-server', {
      fullName: client.id,
      message: payload.message || 'no msg'
    }); */
    
    //! Emite a todo menos al cliente que envia el mensage
    /* client.broadcast.emit('message-server', {
      fullName: client.id,
      message: payload.message || 'no msg'
    });  */

    //! Emite a todos 
    this.wss.emit('message-server',{
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no msg'
    })  
  }
}


// yarn add @nestjs/websockets @nestjs/platform-socket.io 
