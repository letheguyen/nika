import mongoose, { Model, ObjectId, set } from 'mongoose';
import { User } from '@/models/user';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Common } from '@/constant';
import { NotificationStatus } from './contant';
import { MyGateway } from 'module/gateway/gateway';
import { IUserData } from 'module/user/interfaces/interface';
import { IQueryGetNotificationsDto } from './notification.dto';
import {
  WatchedNotification,
  WatchedNotificationDocument,
} from '@/models/watchedNotification';
import { Notification, NotificationDocument } from '@/models/notification';
import { isNil } from 'lodash';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(WatchedNotification.name)
    private readonly watchedNotificationModel: Model<WatchedNotificationDocument>,
  ) { }
  
  async getWatchedDataByUser(userId: string): Promise<ObjectId[]> {
    try {
      const dataNotIn = [];
        const watchedData = await this.watchedNotificationModel
          .findOne(
            { owner: userId.toString() },
            { notificationsWatched: 1 },
          )
          .lean();
  
        if (watchedData.notificationsWatched) {
          Object.keys(watchedData.notificationsWatched).forEach((key) =>
            dataNotIn.push(new mongoose.Types.ObjectId(key)),
          );
      }
    
      return dataNotIn
    } catch (error) {
      return []
    }
  }

  async countNotificationByUser(currentUser: IUserData) {
    try {
      const dataNotIn = await this.getWatchedDataByUser(currentUser._id);
      return await this.notificationModel
        .find(
          {
            _id: { $nin: dataNotIn },
            $or: [{ isGlobal: true }, { to: currentUser._id.toString() }],
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

      const [totalNotification, totalItem, notificationsWatched] =
        await Promise.all([
          this.notificationModel
            .find({
              $or: [{ isGlobal: true }, { to: currentUser._id.toString() }],
              createdAt: { $gt: currentUser.createdAt },
            })
            .sort({ createdAt: -1 })
            .skip((Number(pageIndex) ?? 1) - 1)
            .limit(Number(pageSize) ?? Common.DEFAULT_PAGE_SIZE)
            .populate({
              path: 'owner',
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

          this.watchedNotificationModel.findOne(
            { owner: currentUser._id.toString() },
            { notificationsWatched: 1 },
          ),
        ]);

      const size = Number(pageSize) ?? Common.DEFAULT_PAGE_SIZE;

      return {
        totalItem,
        data: totalNotification,
        page: Number(pageIndex) ?? 1,
        totalPage: Math.ceil(totalItem / size),
        notificationsWatched: notificationsWatched?.notificationsWatched ?? {},
      };
    } catch (error) {
      throw error;
    }
  }

  async viewAllNotification(currentUser: IUserData) {
    const dataWatched = {};
    const userId = currentUser._id.toString();
    const dataNotIn = await this.getWatchedDataByUser(currentUser._id);

    const notification = await this.notificationModel
      .find({
        _id: { $nin: dataNotIn },
        $or: [{ isGlobal: true }, { to: currentUser._id.toString() }],
        createdAt: { $gt: currentUser.createdAt },
      })
      .lean();

    const watchedNotification = await this.watchedNotificationModel.findOne({
      owner: userId,
    });

    notification.forEach((notification) => {
      dataWatched[notification._id.toString()] = notification._id.toString();
    });

    if (isNil(watchedNotification)) {
      await this.watchedNotificationModel.create({
        notificationsWatched: dataWatched,
        owner: userId,
      });

      return true;
    }

    await this.watchedNotificationModel.updateOne(
      { owner: userId },
      {
        notificationsWatched: {
          ...watchedNotification.notificationsWatched,
          ...dataWatched,
        },
      },
    );

    return true;
  }
}
