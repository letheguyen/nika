import { Model } from 'mongoose';
import { User } from '@/models/user';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Common } from '@/constant';
import { NotificationStatus } from './contant';
import { IUserData } from 'module/user/interfaces/interface';
import { IQueryGetNotificationsDto } from './notification.dto';
import { Notification, NotificationDocument } from '@/models/notification';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async countNotificationByUser(currentUser: IUserData) {
    try {
      return await this.notificationModel
        .find(
          {
            $or: [{ isGlobal: true }, { to: currentUser._id.toString() }],
            status: NotificationStatus.NotSeen,
            createdAt: { $gt: currentUser.createdAt },
          },
          { _id: 1 },
        )
        .count()
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async getNotificationsByUser(
    currentUser: IUserData,
    query: IQueryGetNotificationsDto,
  ) {
    try {
      const { pageIndex, pageSize } = query;

      const [totalNotification, totalItem] = await Promise.all([
        this.notificationModel
          .find({
            $or: [{ isGlobal: true }, { to: currentUser._id.toString() }],
            status: NotificationStatus.NotSeen,
            createdAt: { $gt: currentUser.createdAt },
          })
          .skip((Number(pageIndex) ?? 1) - 1)
          .limit(Number(pageSize) ?? Common.DEFAULT_PAGE_SIZE)
          .populate({ 
            path: 'ownerId', 
            select: 'userName email avatarUrl',
          })
          .lean(),

        this.notificationModel
          .find({
            $or: [{ isGlobal: true }, { to: currentUser._id.toString() }],
            createdAt: { $gt: currentUser.createdAt },
          })
          .count()
          .lean(),
      ]);

      return {
        totalItem,
        page: Number(pageIndex) ?? 1,
        data: totalNotification,
        totalPage: Math.ceil(totalItem / Number(pageSize) ?? Common.DEFAULT_PAGE_SIZE),
      };
    } catch (error) {
      throw error;
    }
  }
}
