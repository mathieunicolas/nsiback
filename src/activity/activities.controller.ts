import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Activity } from './activity.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Roles } from 'src/users/roles.decorator';
import { Role } from 'src/users/role.enum';
import { RolesGuard } from 'src/users/roles.guard';
import { ApiCookieAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  // Une requête GET sur l'endpoint /activities va chercher un param "user" dans la query
  // Si user il y a les activités renvoyées seront celles dont le champ "author" est égal à cette variable
  // Sinon, on renvoie toutes les activités
  @ApiCookieAuth('jwt')
  @ApiHeader({
    name: 'Access-Control-Allow-Credentials',
    description:
      'Doit être égal à true (include pour fetch) pour inclure le cookie côté client.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Prof, Role.Eleve)
  async findAll(@Request() req): Promise<Activity[]> {
    console.log(req.user);

    return this.activitiesService.findAllByUser(req.user.id);
  }

  @ApiCookieAuth('jwt')
  @ApiHeader({
    name: 'Access-Control-Allow-Credentials',
    description:
      'Doit être égal à true (include pour fetch) pour inclure le cookie côté client.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/assigned/:id')
  @Roles(Role.Prof)
  async findAssigned(
    @Request() req,
    @Param('id') id: number,
  ): Promise<Activity[]> {
    return this.activitiesService.findAllByMaster(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/assign/:id')
  @Roles(Role.Prof, Role.Eleve)
  async assign(@Request() req, @Param('id') id: number): Promise<void> {
    this.activitiesService.assignActi(req.user.id, id);
  }

  @Delete(':id')
  async deleteOne(@Param() id: number): Promise<void> {
    return this.activitiesService.remove(id);
  }

  // Création d'une activité. Ici, je construis le body dans l'UI donc c'est peut-être pas top, à modifier
  @Post()
  async create(@Body() activity: Activity): Promise<Activity> {
    return this.activitiesService.create(activity);
  }
  // Le code que j'utilise pour construire le body :
  // await $fetch(gd.dbURL+'/activities', {
  //   method: "post",
  //   body: { ...acti, author: gd.currentUser.id }
  // })

  // Cette fonction a été la première, et depuis j'ai pris le réflexe de passer le user ID dans la @Query('user')
  // donc ça pourrait valoir le coup de normaliser la méthode ?
}
