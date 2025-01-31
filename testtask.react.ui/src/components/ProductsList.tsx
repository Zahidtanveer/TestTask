import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../services/ProductService";
import "./ProductsList.css";
import { Product } from "../../types/Product";

Modal.setAppElement("#root"); // Set the app root for accessibility

const ProductsList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
        name: "",
        price: 0,
        quantity: 0,
    });

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        // Filter products based on search input
        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, products]);

    const loadProducts = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
    };

    const openModal = (product?: Product) => {
        if (product) {
            setCurrentProduct(product);
            setNewProduct(product);
        } else {
            setCurrentProduct(null);
            setNewProduct({ name: "", price: 0, quantity: 0 });
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = async () => {
        if (currentProduct) {
            await updateProduct(currentProduct.id, { ...currentProduct, ...newProduct });
        } else {
            await createProduct(newProduct);
        }
        closeModal();
        loadProducts();
    };

    const openDeleteModal = (product: Product) => {
        setCurrentProduct(product);
        setDeleteModalIsOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false);
    };

    const handleDelete = async () => {
        if (currentProduct) {
            await deleteProduct(currentProduct.id);
        }
        closeDeleteModal();
        loadProducts();
    };

    const columns = [
        { name: "ID", selector: (row: Product) => row.id, sortable: true },
        { name: "Name", selector: (row: Product) => row.name, sortable: true },
        { name: "Price", selector: (row: Product) => `$${row.price.toFixed(2)}`, sortable: true },
        { name: "Quantity", selector: (row: Product) => row.quantity, sortable: true },
        {
            name: "Actions",
            cell: (row: Product) => (
                <>
                    <button className="edit-btn" onClick={() => openModal(row)}>Edit</button>
                    <button className="delete-btn" onClick={() => openDeleteModal(row)}>Delete</button>
                </>
            ),
        },
    ];

    return (
        <div className="products-container">
            <h2>Manage Product List</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />

            <button className="add-btn" onClick={() => openModal()}>Add Product</button>

            <DataTable
                className="react-data-table"
                columns={columns}
                data={filteredProducts} // Show only filtered products
                progressPending={loading}
                pagination
                highlightOnHover
            />

            {/* Add/Edit Modal */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
                <h3>{currentProduct ? "Edit Product" : "Add Product"}</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={closeModal}>Cancel</button>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModalIsOpen} onRequestClose={closeDeleteModal} className="modal">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete "{currentProduct?.name}"?</p>
                <button className="delete-btn" onClick={handleDelete}>Yes, Delete</button>
                <button onClick={closeDeleteModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default ProductsList;
