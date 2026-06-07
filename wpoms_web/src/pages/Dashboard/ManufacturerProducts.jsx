import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { productService } from '../../services/productService';
// import './ManufacturerProducts.css';
import { toast } from 'sonner';
import ProductDetailsModal from './ProductDetails';

const productSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Minimum 3 characters required"),

  category: z.string()
    .trim()
    .min(1, "Category is required"),

  price: z.string()
    .min(1, "Price is required")
    .refine((val) => {
      const num = parseFloat(val.replace(/[^0-9.]/g, ""));
      return !isNaN(num) && num > 0;
    }, "Invalid price"),

  quantity: z.coerce.number()
    .int("Quantity must be an integer")
    .min(0, "Invalid quantity"),

  warranty: z.string().min(1, "Warranty is required"),

  description: z.string()
    .trim()
    .min(5, "Description is required")
    .max(500, "Max 500 characters"),
});

const ManufacturerProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusToggleProduct, setStatusToggleProduct] = useState(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [warrantyTypes, setWarrantyTypes] = useState([]);

  const [newProduct, setNewProduct] = useState({
    id: "",
    name: '',
    category: '',
    price: '',
    quantity: 0,
    warranty: '',
    description: '',
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAllProducts();
      let allProducts = data.map((p) => {
        return {
          name: p.productName,
          category: p.category,
          price: String(p.price),
          quantity: Number(p.stockQuantity ?? 0),
          warranty: p.warrantyType,
          description: p.description,
          id: p.productId,
          is_active: p.isActive !== undefined ? p.isActive : true
        }
      });
      // Sort by product ID ascending
      allProducts.sort((a, b) => {
        const idA = typeof a.id === 'number' ? a.id : parseInt(a.id, 10) || 0;
        const idB = typeof b.id === 'number' ? b.id : parseInt(b.id, 10) || 0;
        return idA - idB;
      });
      
      setProducts(allProducts || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [cats, warTypes] = await Promise.all([
        productService.getCategories(),
        productService.getWarrantyTypes()
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setWarrantyTypes(Array.isArray(warTypes) ? warTypes : []);
    } catch (err) {
      console.error('Failed to load dropdown data', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDropdownData();
  }, []);

  // Filtered products based on status filter
  const filteredProducts = products.filter((p) => {
    if (statusFilter === 'active') return p.is_active === true;
    if (statusFilter === 'inactive') return p.is_active === false;
    return true;
  });

  const openEditModal = (product) => {
    setEditProduct({ ...product });
    setErrors({});
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
    setErrors({});
    toast.info('Edit cancelled');
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditProduct((current) => ({ ...current, [name]: value }));
  };

  const handleEditStatusChange = (event) => {
    const val = event.target.value === 'true';
    setEditProduct((current) => ({ ...current, is_active: val }));
  };

  const handleUpdateClick = () => {
    const result = productSchema.safeParse(editProduct);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    setShowConfirm(true);
    setPendingUpdate(editProduct);
  };

  const confirmUpdate = async () => {
    try {
      await productService.updateProduct(pendingUpdate.id, pendingUpdate);
      setProducts(products.map((p) => p.id === pendingUpdate.id ? pendingUpdate : p));

      setShowConfirm(false);
      setEditModalOpen(false);
      setEditProduct(null);
      setPendingUpdate(null);
      toast.success('Product updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update product');
    }
  };

  const cancelUpdate = () => {
    setShowConfirm(false);
    setPendingUpdate(null);
  };

  // Status toggle handlers - FIXED: Now uses updateProduct with all fields
  const handleStatusBadgeClick = (e, product) => {
    e.stopPropagation();
    setStatusToggleProduct(product);
    setShowStatusConfirm(true);
  };

  const confirmStatusToggle = async () => {
    if (!statusToggleProduct) return;
    
    // Create updated product object with ALL fields
    const updatedProduct = {
      ...statusToggleProduct,
      is_active: !statusToggleProduct.is_active
    };
    
    try {
      await productService.updateProduct(statusToggleProduct.id, updatedProduct);
      setProducts(products.map((p) =>
        p.id === statusToggleProduct.id ? updatedProduct : p
      ));
      toast.success(`Product ${updatedProduct.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error(err.message || 'Failed to update product status');
    } finally {
      setShowStatusConfirm(false);
      setStatusToggleProduct(null);
    }
  };

  const cancelStatusToggle = () => {
    setShowStatusConfirm(false);
    setStatusToggleProduct(null);
  };

  const openAddModal = () => {
    setErrors({});
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setNewProduct({ name: '', category: '', price: '', quantity: 0, warranty: '', description: '' });
    setErrors({});
  };

  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((current) => ({ ...current, [name]: value }));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    const result = productSchema.safeParse(newProduct);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    try {
      await productService.addProduct(newProduct);
      fetchProducts();
      setErrors({});
      closeAddModal();
      toast.success('Product added successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to add product');
    }
  };

  return (
    <div className="product-page">
      <div className="product-page-header">
        <div>
          <h2>Product Catalog</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Status Filter */}
          <div className="status-filter-group">
            <button
              className={`status-filter-btn${statusFilter === 'all' ? ' status-filter-active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`status-filter-btn${statusFilter === 'active' ? ' status-filter-active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button
              className={`status-filter-btn${statusFilter === 'inactive' ? ' status-filter-active' : ''}`}
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive
            </button>
          </div>
          <button className="btn-add-product" onClick={openAddModal}>
            <span className="material-symbols-outlined">add</span>
            Add New Product
          </button>
        </div>
      </div>

      <div className="product-table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Warranty Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => { setSelectedProduct(product); setDetailsModalOpen(true); }}
                  style={{ cursor: 'pointer' }}
                  className="clickable-row"
                >
                  <td className="product-id">{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>{product.warranty}</td>
                  <td>
                    <span
                      className={`product-status-badge ${product.is_active ? 'product-status-active' : 'product-status-inactive'}`}
                      onClick={(e) => handleStatusBadgeClick(e, product)}
                      title={`Click to ${product.is_active ? 'deactivate' : 'activate'}`}
                    >
                      <span className="product-status-dot"></span>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => { e.stopPropagation(); openEditModal(product); }}
                      title="Edit"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-row">
                  {statusFilter !== 'all'
                    ? `No ${statusFilter} products found.`
                    : 'No products have been added yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editProduct && (
        <div className="product-modal-overlay" role="dialog" aria-modal="true" onClick={closeEditModal}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <div className="product-modal-header">
              <div>
                <p className="modal-subtitle">Update Product</p>
                <h2>Edit Product Details</h2>
              </div>
              <button className="modal-close-button" type="button" onClick={closeEditModal} aria-label="Close modal">
                ×
              </button>
            </div>
            <form className="product-form" onSubmit={(e) => { e.preventDefault(); handleUpdateClick(); }}>
              <div className="product-grid">
                <label className="product-field">
                  <span>Product Name</span>
                  <input type="text" name="name" value={editProduct.name} onChange={handleEditChange} />
                  {errors.name && <span className="field-error">{errors.name[0]}</span>}
                </label>
                <label className="product-field">
                  <span>Category</span>
                  <select name="category" value={editProduct.category} onChange={handleEditChange} className="product-status-select">
                    <option value="">Select Category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="field-error">{errors.category[0]}</span>}
                </label>
              </div>
              <div className="product-grid">
                <label className="product-field">
                  <span>Price</span>
                  <input type="text" name="price" value={editProduct.price} onChange={handleEditChange} />
                  {errors.price && <span className="field-error">{errors.price[0]}</span>}
                </label>
                <label className="product-field">
                  <span>Quantity</span>
                  <input type="number" name="quantity" value={editProduct.quantity} onChange={handleEditChange} min="0" />
                  {errors.quantity && <span className="field-error">{errors.quantity[0]}</span>}
                </label>
              </div>
              <div className="product-grid">
                <label className="product-field">
                  <span>Warranty Type</span>
                  <select name="warranty" value={editProduct.warranty} onChange={handleEditChange} className="product-status-select">
                    <option value="">Select Warranty Type</option>
                    {warrantyTypes.map((wt, i) => (
                      <option key={i} value={wt.warrantyType}>
                        {wt.warrantyType}
                      </option>
                    ))}
                  </select>
                  {errors.warranty && <span className="field-error">{errors.warranty[0]}</span>}
                </label>
                <label className="product-field">
                  <span>Status</span>
                  <select
                    name="is_active"
                    value={String(editProduct.is_active)}
                    onChange={handleEditStatusChange}
                    className="product-status-select"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </label>
              </div>
              <label className="product-field product-field-full">
                <span>Product Description</span>
                <textarea name="description" value={editProduct.description} onChange={handleEditChange} rows={4} />
                {errors.description && <span className="field-error">{errors.description[0]}</span>}
              </label>
              <div className="modal-actions">
                <button className="modal-button modal-button-secondary" type="button" onClick={closeEditModal}>Cancel</button>
                <button className="modal-button modal-button-primary" type="submit">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-overlay" on Click={cancelUpdate}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure?</h3>
            <p>Do you want to update this product?</p>
            <div className="confirm-actions">
              <button className="confirm-btn cancel-btn" onClick={cancelUpdate}>No</button>
              <button className="confirm-btn confirm-btn-primary" onClick={confirmUpdate}>Yes, Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Toggle Confirmation Modal */}
      {showStatusConfirm && statusToggleProduct && (
        <div className="confirm-overlay" onClick={cancelStatusToggle}>
          <div className="confirm-dialog status-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="status-confirm-icon-wrapper">
              <span className="material-symbols-outlined status-confirm-icon">
                {statusToggleProduct.is_active ? 'toggle_off' : 'toggle_on'}
              </span>
            </div>
            <h3>Change Product Status</h3>
            <p>
              Are you sure you want to {statusToggleProduct.is_active ? 'deactivate' : 'activate'}{' '}
              <strong>{statusToggleProduct.name}</strong>?
            </p>
            <div className="confirm-actions">
              <button className="confirm-btn cancel-btn" onClick={cancelStatusToggle}>Cancel</button>
              <button
                className={`confirm-btn ${statusToggleProduct.is_active ? 'confirm-btn-danger' : 'confirm-btn-primary'}`}
                onClick={confirmStatusToggle}
              >
                {statusToggleProduct.is_active ? 'Yes, Deactivate' : 'Yes, Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="product-modal-overlay" role="dialog" aria-modal="true" onClick={closeAddModal}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <div className="product-modal-header">
              <div>
                <p className="modal-subtitle"></p>
                <h2>Add Products</h2>
              </div>
              <button className="modal-close-button" type="button" onClick={closeAddModal} aria-label="Close modal">
                ×
              </button>
            </div>
            <form className="product-form" onSubmit={handleAddSubmit}>
              <div className="product-grid">
                <label className="product-field">
                  <span>Product Name</span>
                  <input type="text" name="name" value={newProduct.name} onChange={handleAddChange} />
                  {errors.name && <span className="field-error">{errors.name[0]}</span>}
                </label>
                <label className="product-field">
                  <span>Category</span>
                  <select name="category" value={newProduct.category} onChange={handleAddChange} className="product-status-select">
                    <option value="">Select Category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="field-error">{errors.category[0]}</span>}
                </label>
              </div>
              <div className="product-grid-three">
                <label className="product-field">
                  <span>Price</span>
                  <input type="text" name="price" value={newProduct.price} onChange={handleAddChange} />
                  {errors.price && <span className="field-error">{errors.price[0]}</span>}
                </label>
                <label className="product-field">
                  <span>Quantity</span>
                  <input type="number" name="quantity" value={newProduct.quantity} onChange={handleAddChange} min="0" />
                  {errors.quantity && <span className="field-error">{errors.quantity[0]}</span>}
                </label>
                <label className="product-field">
                  <span>Warranty Type</span>
                  <select name="warranty" value={newProduct.warranty} onChange={handleAddChange} className="product-status-select">
                    <option value="">Select Warranty Type</option>
                    {warrantyTypes.map((wt, i) => (
                      <option key={i} value={wt.warrantyType}>
                        {wt.warrantyType}
                      </option>
                    ))}
                  </select>
                  {errors.warranty && <span className="field-error">{errors.warranty[0]}</span>}
                </label>
              </div>
              <label className="product-field product-field-full">
                <span>Product Description</span>
                <textarea name="description" value={newProduct.description} onChange={handleAddChange} rows={5} />
                {errors.description && <span className="field-error">{errors.description[0]}</span>}
              </label>
              <div className="modal-actions">
                <button className="modal-button modal-button-secondary" type="button" onClick={closeAddModal}>Cancel</button>
                <button className="modal-button modal-button-primary" type="submit">Add to Catalog</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailsModalOpen && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => { setDetailsModalOpen(false); setSelectedProduct(null); }}
          onEdit={(product) => { openEditModal(product); }}
        />
      )}

    </div>
  );
};

export default ManufacturerProducts;