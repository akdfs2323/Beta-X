import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    create(req: any, createAnnouncementDto: CreateAnnouncementDto): Promise<import("./entities/announcement.entity").Announcement>;
    findAll(): Promise<import("./entities/announcement.entity").Announcement[]>;
    findOne(id: string): Promise<import("./entities/announcement.entity").Announcement>;
    update(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<import("./entities/announcement.entity").Announcement>;
    remove(id: string): Promise<void>;
}
