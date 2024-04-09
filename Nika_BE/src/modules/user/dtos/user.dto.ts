import { IsNotEmpty, IsString } from "class-validator";

export class IUserCreate {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}