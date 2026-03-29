import { prisma } from '../lib/prisma';

export class ProductService {
  static async getAll(filters: any) {
    const { category, search, minPrice, maxPrice } = filters;
    
    return prisma.product.findMany({
      where: {
        categoryId: category,
        name: search ? { contains: search } : undefined,
        basePrice: {
          gte: minPrice ? parseFloat(minPrice) : undefined,
          lte: maxPrice ? parseFloat(maxPrice) : undefined,
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  static async getBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  static async create(data: any) {
    return prisma.product.create({
      data: {
        ...data,
        attributes: JSON.stringify(data.attributes || {}),
      },
    });
  }
}
