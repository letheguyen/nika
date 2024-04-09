import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class IQueryGetNotificationsDto {
  @IsOptional()
  pageIndex: number;

  @IsOptional()
  pageSize: number;
}