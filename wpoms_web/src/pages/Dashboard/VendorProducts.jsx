import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { toast } from 'sonner';
import './VendorProducts.css';

const VendorProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null); // tracks productId being added
  const [cartStatus, setCartStatus] = useState({}); // tracks which products are in cart

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warrantyFilter, setWarrantyFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('Newest First');

  // Dropdown options fetched from API
  const [categories, setCategories] = useState([]);
  const [warrantyTypes, setWarrantyTypes] = useState([]);

  // Fetch cart to know which products are already added
  const fetchCartStatus = useCallback(async () => {
    try {
      const cartData = await vendorService.getCart();
      let cartItems = [];
      if (Array.isArray(cartData)) {
        cartItems = cartData;
      } else if (cartData && cartData.items && Array.isArray(cartData.items)) {
        cartItems = cartData.items;
      } else if (cartData && cartData.cartItems && Array.isArray(cartData.cartItems)) {
        cartItems = cartData.cartItems;
      }

      // Create a map of product IDs that are in cart
      const cartStatusMap = {};
      cartItems.forEach(item => {
        const productId = item.productId || item.product?.productId;
        if (productId) {
          cartStatusMap[productId] = true;
        }
      });
      setCartStatus(cartStatusMap);
    } catch (err) {
      console.error('Failed to fetch cart status:', err);
    }
  }, []);

  // Fetch dropdown options on mount
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [cats, warTypes] = await Promise.all([
          vendorService.getCategories(),
          vendorService.getWarrantyTypes(),
        ]);
        setCategories(Array.isArray(cats) ? cats : []);
        setWarrantyTypes(Array.isArray(warTypes) ? warTypes : []);
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      }
    };
    fetchDropdowns();
    fetchCartStatus();
  }, [fetchCartStatus]);

  // Fetch products (with server-side filters)
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const filters = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (warrantyFilter) filters.warrantyType = warrantyFilter;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;

      const data = await vendorService.getAllProducts(filters);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      toast.error(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, warrantyFilter, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartStatus();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCartStatus]);

  // Client-side search & sort (on top of server filters)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Client-side search by name or manufacturer
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p =>
        (p.productName && p.productName.toLowerCase().includes(lowerSearch)) ||
        (p.name && p.name.toLowerCase().includes(lowerSearch)) ||
        (p.manufacturerName && p.manufacturerName.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort
    if (sortBy === 'Newest First') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [products, searchTerm, sortBy]);

  // Add to Cart via API - FIXED: passing productId and quantity separately
  const handleAddToCart = async (product) => {
    const productId = product.productId || product.id;
    try {
      setAddingToCart(productId);
      // ✅ CORRECT: pass productId and quantity as separate arguments
      await vendorService.addToCart(productId, 1);
      
      // Update cart status locally without refetching
      setCartStatus(prev => ({ ...prev, [productId]: true }));
      
      toast.success(`${product.productName || product.name} added to cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  // Navigate to cart page
  const handleGoToCart = () => {
    navigate('/vendor/cart');
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setWarrantyFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('Newest First');
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartStatus[productId] === true;
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header-wrapper">
        <h2 className="catalog-title">Product Catalog</h2>

        <div className="catalog-filters-section">
          <div className="search-bar">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Search product or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters-row">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => {
                if (!cat) return null;
                const val = typeof cat === 'object' ? (cat.categoryName || cat.name || cat.id || JSON.stringify(cat)) : String(cat);
                const label = typeof cat === 'object' ? (cat.categoryName || cat.name || JSON.stringify(cat)) : String(cat);
                return <option key={val || idx} value={val}>{label}</option>;
              })}
            </select>

            <select
              value={warrantyFilter}
              onChange={(e) => setWarrantyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Warranty Types</option>
              {warrantyTypes.map((wt, idx) => {
                if (!wt) return null;
                const val = typeof wt === 'object' ? (wt.warrantyName || wt.name || wt.type || wt.id || JSON.stringify(wt)) : String(wt);
                const label = typeof wt === 'object' ? (wt.warrantyName || wt.name || wt.type || JSON.stringify(wt)) : String(wt);
                return <option key={val || idx} value={val}>{label}</option>;
              })}
            </select>

            <div className="price-range">
              <input
                type="number"
                placeholder="₹ Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>–</span>
              <input
                type="number"
                placeholder="₹ Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <button className="btn-reset" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>

      <div className="catalog-results-header">
        <span className="results-count">
          Showing {filteredProducts.length} products
        </span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="Newest First">Newest First</option>
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
        </select>
      </div>

      {isLoading ? (
        <div className="catalog-loading">
          <span className="material-symbols-outlined loading-spinner">progress_activity</span>
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="product-card-grid">
          {filteredProducts.map((product) => {
            const productId = product.productId || product.id;
            const productName = product.productName || product.name || 'Unnamed Product';
            const productCategory = product.category;
            const productWarranty = product.warrantyType || product.warranty;
            const productPrice = product.price;
            const productDescription = product.description;
            const inCart = isInCart(productId);
            
            return (
              <div key={productId} className="product-card">
                <div className="product-card-content">
                  <h3 className="product-name">{productName}</h3>
                  <p className="manufacturer-name">{product.manufacturerName || 'Unknown Manufacturer'}</p>

                  {productDescription && (
                    <p className="product-description">{productDescription}</p>
                  )}

                  <div className="product-tags">
                    {productCategory && <span className="tag category-tag">{productCategory}</span>}
                    {productWarranty && <span className="tag warranty-tag">{productWarranty}</span>}
                  </div>

                  <div className="product-card-footer">
                    <span className="product-price">₹{productPrice?.toLocaleString()}</span>
                    
                    {inCart ? (
                      <button
                        className="btn-go-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGoToCart();
                        }}
                      >
                        <span className="material-symbols-outlined">shopping_cart</span>
                        Go to Cart
                      </button>
                    ) : (
                      <button
                        className="btn-add-cart"
                        disabled={addingToCart === productId}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        {addingToCart === productId ? 'Adding...' : 'Add to Cart'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="catalog-empty">
          <span className="material-symbols-outlined">inventory_2</span>
          <p>No products found matching your criteria.</p>
          <button className="btn-reset-large" onClick={handleReset}>Clear Filters</button>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;