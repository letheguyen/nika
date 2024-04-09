import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { BaseService } from 'module/base.service';
import { User, UserDocument } from '@/models/user';
import { IUserCreate } from 'module/user/dtos/user.dto';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async createUser(data: IUserCreate): Promise<any> {
    return await this.userModel.create(data);
  }

  async findOne(where: any) {
    return this.userModel.findOne(where).lean();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).lean();
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).lean();
  }
}
