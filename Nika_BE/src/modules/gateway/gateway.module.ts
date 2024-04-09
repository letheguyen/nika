import { Module } from "@nestjs/common";
import { MyGateway } from "./gateway";
import { UserModule } from "module/user/user.module";

@Module({
  imports: [UserModule],
  providers: [MyGateway],
  exports: [MyGateway]
})
export class GatewayModule {}
