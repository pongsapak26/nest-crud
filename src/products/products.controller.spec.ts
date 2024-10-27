import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{
        provide: ProductsService,
        useValue: { getAllProducts: jest.fn().mockResolvedValue([]) }, // Mock Service
      }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should return an array of products', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([]); // ตรวจสอบผลลัพธ์
    expect(productsService.findAll).toHaveBeenCalled(); // ตรวจสอบว่าฟังก์ชันถูกเรียก
  });
});
