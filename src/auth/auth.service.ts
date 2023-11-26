import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async entlogin(dtCAS) {
    console.log(dtCAS);
    const tmp = dtCAS['cas-serviceResponse']['cas-authenticationSuccess'];
    const payload = {
      username: tmp['cas-user'],
      sub: tmp['cas-attributes']['cas-userAttributes']['id'],
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
