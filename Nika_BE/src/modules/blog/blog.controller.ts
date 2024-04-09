import { Body, Controller, Get, Post, Query, Req, UseGuards, Param, Put, Delete } from "@nestjs/common";

import { RolesGuard } from "@/guards/roles.guard";
import { JwtAuthGuard } from "@/guards/jwt-auth.guard";
import { BlogService } from "module/blog/blog.service";
import { Role } from "module/user/contants/constants";
import { ICreateBlog, IGetBlog, IGetBlogs } from "./blog.dto";

@Controller('')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post('/create/blog')
  @UseGuards(JwtAuthGuard, RolesGuard(Role.Admin)) 
  async createBlog(@Req() request: any, @Body() data: ICreateBlog) {
    const currentUser = request.user;
    return this.blogService.createBlog(currentUser._id.toString(), data);
  }

  @Get('/all/blog')
  async getAllBlog(@Query() query: IGetBlogs) {
    return this.blogService.getAllBlog(query);
  }

  @Get('/blog/:blogId')
  async getDetailBlog(@Param() params: IGetBlog) {
    return this.blogService.getDetailBlog(params.blogId);
  }

  @Put('/blog/:blogId')
  async updateBlog(@Body() data: ICreateBlog, @Param() params: IGetBlog) {
    return this.blogService.updateBlog(params.blogId, data);
  }

  @Delete('/blog/:blogId')
  async deleteBlog(@Param() params: IGetBlog) {
    return this.blogService.deleteBlog(params.blogId);
  }
}