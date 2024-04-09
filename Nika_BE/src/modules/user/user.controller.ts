import { Body, Controller, Post } from "@nestjs/common";
import { IUserCreate } from "module/user/dtos/user.dto";
import { UserService } from "module/user/services/user.service";

@Controller('users/')
export class UserController {
  constructor(private readonly userService: UserService) { }
}
