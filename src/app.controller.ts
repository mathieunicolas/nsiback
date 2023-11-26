import {
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  Req,
  Query,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ApiParam, ApiTags, PickType } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ofetch } from 'ofetch';
import { XMLParser } from 'fast-xml-parser';
import { PythonShell } from 'python-shell';
import { JwtAuthGuard } from './auth/jwt-auth-guard';

const parser = new XMLParser({
  transformTagName: (tagName) => tagName.replace(':', '-'),
});

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  hello() {
    return 'hello world !';
  }

  @Get('/ticket')
  async getCAS(
    @Query('ticket') ticket: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await ofetch(
      'https://enthdf.fr/cas/serviceValidate?service=https://nsi.rocks&ticket=' +
        ticket,
    );
    const jwtCAS = await this.authService.entlogin(parser.parse(data));
    response.cookie('jwt', jwtCAS.access_token, {
      sameSite: 'none',
      secure: true,
      domain: 'nsi.rocks',
    });
    return jwtCAS;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/castest')
  async findAll(@Req() req) {
    console.log(req.user);

    return req.user;
  }

  @Post('python')
  async runPython(@Body('script') script) {
    try {
      const res = await PythonShell.runString(script);
      return res;
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('python2')
  async runPython2(@Body('script') script) {
    try {
      const res = await PythonShell.runString(script);
      return res;
    } catch (error) {
      return error;
    }
  }
}
