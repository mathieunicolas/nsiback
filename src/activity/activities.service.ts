import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private actiRepository: Repository<Activity>,
  ) {}

  findAllByUser(user?: number): Promise<Activity[]> {
    return this.actiRepository.find({
      relations: ['author'],
      where: {
        author: { id: user },
      },
    });
  }

  findAllByMaster(masterId: number): Promise<Activity[]> {
    return this.actiRepository.find({
      relations: ['author'],
      where: {
        master: masterId,
      },
    });
  }

  // ici on assigne l'activité actiID à l'utilisateur user
  async assignActi(user: number, actiID: number): Promise<void> {
    // ici je démonte l'objet récupéré par findOne pour extraire directement l'ID
    // ce qui permettra la génération automatique d'un nouvel ID qlq lignes plus bas
    // et ça me permet aussi de réinjecter l'ID pour l'assigner à la prop master
    // du coup si on cherche par master on retrouve toutes les activités assignées à une activité "prof"
    const { id, ...data } = await this.actiRepository.findOne({
      where: {
        id: actiID,
      },
    });
    this.actiRepository.save({
      ...data,
      master: id,
      author: { id: user },
    });
  }

  // findOne(id: number): Promise<Activity | null> {
  //   return this.actiRepository.findOneBy({ id });
  // }

  async remove(id: number): Promise<void> {
    await this.actiRepository.delete(id);
  }

  async create(user: Activity): Promise<Activity> {
    return this.actiRepository.save(user);
  }

  // async patch(user: Partial<Activity>): Promise<void> {
  //   await this.actiRepository.update(user.id, user);
  // }
}
