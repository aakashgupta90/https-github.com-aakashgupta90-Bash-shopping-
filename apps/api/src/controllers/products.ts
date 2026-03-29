import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getAll(req.query);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
