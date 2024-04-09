import { IsNotEmpty, IsString, IsArray } from "class-validator";

export class ICreateBlog {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  images: string[];
}


export class IGetBlogs {
  @IsNotEmpty()
  pageSize: number

  @IsNotEmpty()
  pageIndex: number
}

export class IGetBlog {
  @IsNotEmpty()
  blogId: string
}
