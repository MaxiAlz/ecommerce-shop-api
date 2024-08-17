import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUuid } from 'uuid';

@Injectable()
export class EventsService {
  private readonly logger = new Logger('EventsService');

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const event = this.eventRepository.create(createEventDto);
      await this.eventRepository.save(event);
      return event;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 0 } = paginationDto;
    return await this.eventRepository.find({
      take: limit,
      skip: page,
      // TODO: Relaciones
    });
  }

  async findOne(identifier: string) {
    let event: Event;

    if (isUuid(identifier)) {
      event = await this.eventRepository.findOneBy({ id: identifier });
    } else {
      event = await this.eventRepository.findOneBy({ slug: identifier });
    }

    if (!event)
      throw new NotFoundException(
        `Producto con identificador ${identifier} no fue encontrado`,
      );

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.preload({
      id: id,
      ...updateEventDto,
    });

    if (!event)
      throw new NotFoundException(`No se econtro evento con id: ${id}`);

    try {
      await this.eventRepository.save(event);
      return event;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    return await this.eventRepository.remove(event);
  }

  private handleDbExceptions(error: any) {
    if (error.code == 23505) {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'error inesperado, revisar logs en servidor',
    );
  }
}
