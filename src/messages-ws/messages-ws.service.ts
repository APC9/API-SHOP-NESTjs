import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

interface ConectedClients {
  [id: string]: {
    socket: Socket,
    user: User
  };
}

@Injectable()
export class MessagesWsService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  private connectedClients: ConectedClients = {};

  async registerClient( client: Socket, id:string  ) {
   
    const user = await this.userRepository.findOneBy({id});
    
    if(!user)  throw new Error('User not found');
    if(!user.isActive )  throw new Error('User not found');
    
    this.ckeckUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user
    };
  }

  removeClients( clientId: string) {
    delete this.connectedClients[clientId];
  }

  getconnectedClients():string[]{
    return Object.keys( this.connectedClients );
  }

  getUserFullName(socketID: string) {
    return this.connectedClients[socketID].user.fullName;
  }

  //Desconectar clientes duplicados
  private ckeckUserConnection(user:User){
    for (const clientId of Object.keys(this.connectedClients) ){
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
