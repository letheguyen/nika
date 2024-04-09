import { Model } from 'mongoose';
import { ClientSession } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Common } from '@/constant';
import { BaseService } from 'module/base.service';
import { Blog, BlogDocument } from '@/models/blog';
import { MyGateway } from 'module/gateway/gateway';
import { ICreateBlog, IGetBlogs } from './blog.dto';
import { globalEventName } from 'module/gateway/contant';
import { NotificationType } from 'module/notification/contant';
import { Notification, NotificationDocument } from '@/models/notification';

@Injectable()
export class BlogService extends BaseService<BlogDocument> {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly myGateway: MyGateway,
  ) {
    super(blogModel);
  }

  async createBlog(ownerId: string, data: ICreateBlog): Promise<any> {
    return await this.usingTransaction(async (session: ClientSession) => {
      const dataCreateBlog = { owner: ownerId, ...data };
      const dataCreateNotification = {
        owner: ownerId,
        content: data.description,
        type: NotificationType.blog,
      };

      const blog = await this.blogModel.create([dataCreateBlog], {
        session,
      });

      await this.notificationModel.create(
        [{ ...dataCreateNotification, hrefId: blog[0]._id.toString() }],
        { session },
      );

      this.myGateway.server.emit(globalEventName.blogEvent);
      return true;
    });
  }

  async getAllBlog(query: IGetBlogs): Promise<any> {
    const { pageIndex, pageSize } = query;
    const [blogs, totalItem] = await Promise.all([
      this.blogModel
        .find()
        .skip((Number(pageIndex) - 1) * Number(pageSize))
        .limit(Number(pageSize))
        .populate({ 
          path: 'owner', 
          select: 'userName email avatarUrl',
        })
        .lean(),
      this.blogModel.countDocuments()
    ])
    
    return ({
      totalItem,
      data: blogs,
      page: pageIndex ?? 1,
      totalPage: Math.ceil(totalItem / pageSize ?? Common.DEFAULT_PAGE_SIZE),
    })
  }

  async getDetailBlog(id: string) {
    return await this.blogModel.findOne({ _id: id.toString() }).lean();
  }

  async updateBlog(_id: string, data: ICreateBlog) {
    await this.blogModel.updateOne({ _id }, data);
    await this.notificationModel.updateOne({ hrefId: _id }, { content: data.description });
    this.myGateway.server.emit(globalEventName.blogEvent);
    return true;
  }

  async deleteBlog(_id: string) {
    try {
      await this.blogModel.deleteOne({ _id });
      await this.notificationModel.deleteOne({ hrefId: _id });
      this.myGateway.server.emit(globalEventName.blogEvent);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
