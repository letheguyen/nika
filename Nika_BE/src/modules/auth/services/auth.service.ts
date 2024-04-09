import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, HttpException } from '@nestjs/common';

import { BodyDto } from 'module/auth/auth.dto';
import { IUserData } from 'module/user/interfaces/interface';
import { UserService } from 'module/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async signin(data: BodyDto): Promise<any> {
    try {
      const { email, password, token } = data;
      const isError = await this.verifyTokenCapcha(token);
      if (isError) throw new Error('Invalid token');
      const user = await this.checkEmailAndPassword(email, password);
      if (user) return this.generateJwtToken(user);
      throw new HttpException('Wrong password.', HttpStatus.FOUND);
    } catch (error) {
      throw error;
    }
  }

  async signup(data: BodyDto): Promise<any> {
    try {
      const { email, password, token } = data;
      const isError = await this.verifyTokenCapcha(token);
      if (isError) throw new HttpException('Invalid token', HttpStatus.FOUND);

      const isUserAlready = await this.userService.findOneByEmail(email);
      if (isUserAlready) throw new HttpException('User is already exist', HttpStatus.CONFLICT);

      const hashedPassword = await this.hashPassword(password);
      const user = await this.userService.createUser({
        password: hashedPassword,
        email,
      });

      return this.generateJwtToken(user);
    } catch (error) {
      throw error;
    }
  }

  generateJwtToken(user: IUserData) {
    const jwtParams = {
      role: user.role,
      nonce: user.nonce,
      email: user.email,
      userName: user.userName,
      avatarUrl: user.avatarUrl,
      userId: user._id.toString(),
      isUpdatedPassword: user.isUpdatedPassword,
    };

    return {
      accessToken: 'Bearer ' + this.jwtService.sign(jwtParams),
      user: jwtParams,
    };
  }

  private async checkEmailAndPassword(
    email: string,
    password: string,
  ): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    const { password: hashedPassword } = user;
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    return isPasswordMatch ? user : null;
  }

  async verifyTokenCapcha(token: string): Promise<boolean> {
    try {
      const secretKey = process.env.CAPCHA_SECRET_KEY;
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
      const response = await firstValueFrom(this.httpService.post(url));
      if (response && response.data['success']) return false;
      return true;
    } catch (error) {
      return true;
    }
  }

  async verify(id: string) {
    return await this.userService.findOneById(id)
  }
}
