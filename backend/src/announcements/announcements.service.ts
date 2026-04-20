import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  create(createAnnouncementDto: CreateAnnouncementDto, author: string): Promise<Announcement> {
    const announcement = this.announcementRepository.create({
      ...createAnnouncementDto,
      author,
    });
    return this.announcementRepository.save(announcement);
  }

  async findAll(): Promise<Announcement[]> {
    return this.announcementRepository.find({
      order: {
        pinned: 'DESC',
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({ where: { id } });
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }
    return announcement;
  }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.findOne(id);
    const updated = this.announcementRepository.merge(announcement, updateAnnouncementDto);
    return this.announcementRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.announcementRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }
  }
}
