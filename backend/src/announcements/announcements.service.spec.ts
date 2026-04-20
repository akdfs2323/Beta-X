import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(Announcement),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should query the repository with order by pinned and created_at DESC', async () => {
      const mockResult = [
        { id: '1', title: 'Pinned 1', pinned: true, created_at: new Date('2026-01-02') },
        { id: '2', title: 'Normal 1', pinned: false, created_at: new Date('2026-01-01') },
      ];
      mockRepository.find.mockResolvedValue(mockResult);

      const result = await service.findAll();
      
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: {
          pinned: 'DESC',
          created_at: 'DESC',
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if announcement is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return announcement if found', async () => {
      const mockAnnouncement = { id: 'valid-id', title: 'Found it' };
      mockRepository.findOne.mockResolvedValue(mockAnnouncement);

      const result = await service.findOne('valid-id');
      expect(result).toEqual(mockAnnouncement);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'valid-id' } });
    });
  });
});
