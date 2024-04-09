import {
  MessageBody,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { isNil } from 'lodash';
import { Server, Socket } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { Role } from 'module/user/contants/constants';
import { UserService } from 'module/user/services/user.service';

@Injectable()
@WebSocketGateway({ cors: 'http://localhost:3000' })
export class MyGateway implements OnModuleInit, OnGatewayDisconnect {
  private users: { [userId: string]: Role };

  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UserService) {}

  private async onConnection(userId: string | string[]) {
    try {
      if (isNil(userId)) return;
      const user = await this.userService.findOne({ _id: userId.toString() });
      const newUser = { [user._id.toString()]: user.role };
      this.users = { ...this.users, ...newUser };
      console.log("USER CONNECTED :", this.users)
    } catch (error) {
      console.error('Connection error :', error);
    }
  }

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      const userId = socket.handshake.query['userId'];
      userId && this.onConnection(userId);
    });
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query['userId'];
    const oldUsers = this.users;
    delete oldUsers[userId.toString()];
    this.users = oldUsers;
  }
}
