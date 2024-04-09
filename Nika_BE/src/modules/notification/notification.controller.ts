import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";

import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "@/guards/jwt-auth.guard";
import { Role } from "module/user/contants/constants";
import { RolesGuard } from "@/guards/roles.guard";
import { IQueryGetNotificationsDto } from "./notification.dto";

@Controller('notification/')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get('count')
  @UseGuards(JwtAuthGuard, RolesGuard(Role.Admin, Role.User)) 
  async countNotificationByUser(@Req() request: any,) {
    const currentUser = request.user;
    return this.notificationService.countNotificationByUser(currentUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard(Role.Admin, Role.User)) 
  async getNotificationByUser(@Req() request: any, @Query() query: IQueryGetNotificationsDto) {
    const currentUser = request.user;
    return this.notificationService.getNotificationsByUser(currentUser, query);
  }
}
