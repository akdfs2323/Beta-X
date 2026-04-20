import { Repository } from 'typeorm';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './entities/announcement.entity';
export declare class AnnouncementsService {
    private readonly announcementRepository;
    constructor(announcementRepository: Repository<Announcement>);
    create(createAnnouncementDto: CreateAnnouncementDto, author: string): Promise<Announcement>;
    findAll(): Promise<Announcement[]>;
    findOne(id: string): Promise<Announcement>;
    update(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<Announcement>;
    remove(id: string): Promise<void>;
}
