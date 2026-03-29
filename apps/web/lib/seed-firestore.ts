import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function seedFirestore() {
  try {
    // 1. Create Categories
    const watchesRef = doc(collection(db, 'categories'));
    await setDoc(watchesRef, { id: watchesRef.id, name: 'Watches', slug: 'watches' });

    const bagsRef = doc(collection(db, 'categories'));
    await setDoc(bagsRef, { id: bagsRef.id, name: 'Bags', slug: 'bags' });

    // 2. Create Products
    const p1Ref = doc(collection(db, 'products'));
    await setDoc(p1Ref, {
      id: p1Ref.id,
      name: 'Essential Watch No. 1',
      slug: 'essential-watch-no-1',
      description: 'A minimalist timepiece for the modern professional.',
      basePrice: 240.00,
      categoryId: watchesRef.id,
      attributes: { material: 'Stainless Steel', movement: 'Quartz' },
      createdAt: new Date().toISOString(),
    });

    // Add variants for p1
    await addDoc(collection(db, 'products', p1Ref.id, 'variants'), {
      sku: 'W1-BLK',
      name: 'Black / Silver',
      stock: 10,
      price: 240.00,
      attributes: { color: 'Black' }
    });

    await addDoc(collection(db, 'products', p1Ref.id, 'variants'), {
      sku: 'W1-SLV',
      name: 'Silver / White',
      stock: 5,
      price: 240.00,
      attributes: { color: 'Silver' }
    });

    const p2Ref = doc(collection(db, 'products'));
    await setDoc(p2Ref, {
      id: p2Ref.id,
      name: 'Archival Backpack',
      slug: 'archival-backpack',
      description: 'Durable and stylish, perfect for daily use.',
      basePrice: 180.00,
      categoryId: bagsRef.id,
      attributes: { material: 'Canvas', capacity: '20L' },
      createdAt: new Date().toISOString(),
    });

    await addDoc(collection(db, 'products', p2Ref.id, 'variants'), {
      sku: 'B1-GRY',
      name: 'Slate Gray',
      stock: 4,
      price: 180.00,
      attributes: { color: 'Gray' }
    });

    console.log('✅ Firestore Seed Complete');
    return true;
  } catch (error) {
    console.error('❌ Firestore Seed Failed:', error);
    return false;
  }
}
