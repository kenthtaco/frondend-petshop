// cartitem.model.ts
export interface CartItem {
    product: {
      id: number;
      name: string;
      price: number;
      imageUrl?: string;  // URL de la imagen del producto
      image?: string;     // Imagen codificada en base64
    };
    quantity: number;
  }
  