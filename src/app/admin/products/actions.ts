'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile } from 'fs/promises';
import path from 'path';
import { NAV_CATEGORIES } from '@/config/categoriesConfig';

export async function createProductAction(formData: FormData) {
  const title = formData.get('title') as string;
  const price = parseFloat(formData.get('price') as string);
  const sku = formData.get('sku') as string;
  const categorySlug = formData.get('categorySlug') as string;
  
  const maxAmperage = formData.get('maxAmperage') as string;
  const workCycle = formData.get('workCycle') as string;
  const powerSupply = formData.get('powerSupply') as string;
  const weldingProcess = formData.get('weldingProcess') as string;
  const presentation = formData.get('presentation') as string;
  const dimensions = formData.get('dimensions') as string;

  // Buscar el nombre oficial de la categoría usando el slug recibido
  let categoryName = 'General';
  for (const group of NAV_CATEGORIES) {
    const sub = group.subcategories.find((s) => s.slug === categorySlug);
    if (sub) {
      categoryName = sub.name;
      break;
    }
  }

  // Garantizar que la categoría exista en la base de datos usando el slug como clave única
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: { name: categoryName },
    create: {
      name: categoryName,
      slug: categorySlug,
    },
  });

  // Procesamiento de imágenes múltiples
  const imageFiles = formData.getAll('imageFiles') as File[];
  const imageUrls: string[] = [];

  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      await writeFile(path.join(uploadDir, fileName), buffer);
      imageUrls.push(`/uploads/${fileName}`);
    }
  }

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

  await prisma.product.create({
    data: {
      title,
      slug,
      price,
      sku: sku || null,
      categoryId: category.id, // ID exacto de la categoría vinculada
      images: imageUrls,
      maxAmperage: maxAmperage || null,
      workCycle: workCycle || null,
      powerSupply: powerSupply || null,
      weldingProcess: weldingProcess || null,
      presentation: presentation || null,
      dimensions: dimensions || null,
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  redirect('/admin/products');
}

export async function deleteProductAction(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  redirect('/admin/products');
}