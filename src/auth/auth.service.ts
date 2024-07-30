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
    // console.log(dtCAS);
    const tmp = dtCAS['cas-serviceResponse']['cas-authenticationSuccess'];
    const payload = {
      username: tmp['cas-user'],
      sub: tmp['cas-attributes']['cas-userAttributes']['id'],
      firstName: tmp['cas-attributes']['cas-userAttributes']['firstName'],
      lastName: tmp['cas-attributes']['cas-userAttributes']['lastName'],
      type: tmp['cas-attributes']['cas-userAttributes']['type'],
      classes: tmp['cas-attributes']['cas-userAttributes']['classes'],
      bday: tmp['cas-attributes']['cas-userAttributes']['birthDate'],
    };
    return {
      access_token: this.jwtService.sign(payload),
      payload: payload
    };
  }
}
