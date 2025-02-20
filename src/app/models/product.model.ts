export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  categoryName?: string; 
  imageUrl?: string; // Propiedad opcional para la URL de la imagen
  image?: string;
  productCode?: string; // Nueva propiedad para la imagen codificada en base64
}
