export interface Product {

    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    images: ProductImage[];
    currentImageIndex?: number;
    showMore?: boolean;

}

export interface ProductImage {

    id: number;
    fileName: string;
    contentType: string;

}