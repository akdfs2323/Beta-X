"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const announcement_entity_1 = require("./entities/announcement.entity");
let AnnouncementsService = class AnnouncementsService {
    announcementRepository;
    constructor(announcementRepository) {
        this.announcementRepository = announcementRepository;
    }
    create(createAnnouncementDto, author) {
        const announcement = this.announcementRepository.create({
            ...createAnnouncementDto,
            author,
        });
        return this.announcementRepository.save(announcement);
    }
    async findAll() {
        return this.announcementRepository.find({
            order: {
                pinned: 'DESC',
                created_at: 'DESC',
            },
        });
    }
    async findOne(id) {
        const announcement = await this.announcementRepository.findOne({ where: { id } });
        if (!announcement) {
            throw new common_1.NotFoundException(`Announcement with ID ${id} not found`);
        }
        return announcement;
    }
    async update(id, updateAnnouncementDto) {
        const announcement = await this.findOne(id);
        const updated = this.announcementRepository.merge(announcement, updateAnnouncementDto);
        return this.announcementRepository.save(updated);
    }
    async remove(id) {
        const result = await this.announcementRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Announcement with ID ${id} not found`);
        }
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(announcement_entity_1.Announcement)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map