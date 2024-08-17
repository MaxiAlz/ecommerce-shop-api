import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { validate as isUuid } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('EventsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.productRepository.find({});
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findOne(identifier: string) {
    let product: Product;

    product = await this.findProductByIdentifier(identifier);

    if (!product)
      throw new BadRequestException(
        `Producto con identificador ${identifier} no fue encontrado`,
      );

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
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

  private async findProductByIdentifier(identifier: any) {
    let product: Product;

    if (isUuid(identifier)) {
      product = await this.productRepository.findOneBy({ id: identifier });
    } else {
      product = await this.productRepository.findOneBy({ slug: identifier });
    }

    return product;
  }
}
