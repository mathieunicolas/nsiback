import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth-guard';
import { AuthService } from './auth/auth.service';
import { Storage } from '@squareboat/nest-storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags, PickType } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { User } from './users/user.entity';
import { ofetch } from 'ofetch';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

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
  async getCAS(@Query('ticket') ticket: string) {
    console.log(ticket);
    const data = await ofetch(
      'https://enthdf.fr/cas/serviceValidate?service=https://nsi.rocks&ticket=' +
        ticket,
    );
    console.log(data);
    return parser.parse(data);
  }

  @ApiTags('login')
  @ApiParam({ name: 'user', type: PickType(User, ['username', 'password']) })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.login(req.user);
    response.cookie('jwt', userData.access_token, {
      sameSite: 'none',
      secure: true,
    });
    return userData;
  }

  @ApiTags('files')
  @ApiParam({ name: 'file', type: 'File' })
  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  createFile(@UploadedFile() file) {
    const fsyst = Storage.disk('test');
    console.log(file);

    fsyst.put('/' + file.originalname, file.buffer);
  }
}
