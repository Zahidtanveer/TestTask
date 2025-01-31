import axios from "axios";
import { Product } from "../types/Product";


const API_URL = "https://localhost:7251/api/products";

export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await axios.post(API_URL, product);
    return response.data;
};

export const updateProduct = async (id: number, product: Product): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, product);
};

export const deleteProduct = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};


