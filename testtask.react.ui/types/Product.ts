export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

let products: Product[] = [
    { id: 1, name: "Laptop", price: 999.99, quantity: 10 },
    { id: 2, name: "Phone", price: 699.99, quantity: 15 },
    { id: 3, name: "Tablet", price: 399.99, quantity: 20 },
];

export const getProducts = async (): Promise<Product[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...products]), 500));
};

export const addProduct = async (product: Omit<Product, "id">): Promise<void> => {
    return new Promise((resolve) => {
        products.push({ id: Date.now(), ...product });
        setTimeout(resolve, 500);
    });
};

export const updateProduct = async (updatedProduct: Product): Promise<void> => {
    return new Promise((resolve) => {
        products = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
        setTimeout(resolve, 500);
    });
};

export const deleteProduct = async (id: number): Promise<void> => {
    return new Promise((resolve) => {
        products = products.filter((p) => p.id !== id);
        setTimeout(resolve, 500);
    });
};
