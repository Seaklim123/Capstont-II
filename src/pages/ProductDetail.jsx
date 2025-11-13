import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Footer } from '../components/footer-component';
import { productApi } from '../services/api';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await productApi.getAll();
        // Filter out current product and get 4 related products
        const related = response.data
          .filter(p => p.id !== parseInt(id))
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (id) {
      fetchRelatedProducts();
    }
  }, [id]);

  const getProductImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    
    let path = imagePath;
    if (path.startsWith('/')) path = path.substring(1);
    if (path.startsWith('storage/')) return `http://127.0.0.1:8000/${path}`;
    if (!path.includes('/')) return `http://127.0.0.1:8000/storage/products/${path}`;
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getProductImageUrl(product.image || product.image_path),
        quantity: quantity
      });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Trigger event to update cart badge
    window.dispatchEvent(new Event('cartUpdated'));

    // Show success popup
    setShowSuccessPopup(true);

    // Hide popup after 2 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 2000);

    // Reset quantity to 1
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container" style={{padding: '60px 20px', textAlign: 'center'}}>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container" style={{padding: '60px 20px', textAlign: 'center'}}>
          <p>Product not found</p>
          <button onClick={() => navigate('/menu')} style={{marginTop: '20px', padding: '10px 20px'}}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const originalPrice = product.discount > 0 
    ? (parseFloat(product.price) / (1 - product.discount / 100)).toFixed(2)
    : null;
  const discountAmount = originalPrice 
    ? (parseFloat(originalPrice) - parseFloat(product.price)).toFixed(2)
    : null;

  return (
    <div className="product-detail-page">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <div className="success-icon">✓</div>
            <p className="success-message">Added to cart successfully!</p>
            <button className="view-cart-btn" onClick={() => navigate('/cart')}>
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Product Section */}
      <section className="product-section">
        <div className="container">
          <button className="back-btn" onClick={handleBack}>
            <span>←</span>
          </button>
          
          <div className="product-grid">
            <div className="product-image-container">
              <div className="product-image">
                {getProductImageUrl(product.image || product.image_path) ? (
                  <img 
                    src={getProductImageUrl(product.image || product.image_path)} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span style={{ display: getProductImageUrl(product.image || product.image_path) ? 'none' : 'block' }}>
                  {product.name}
                </span>
              </div>
            </div>

            <div className="product-info-container">
              <h1 className="product-name">{product.name}</h1>
              
              <div className="product-pricing">
                {originalPrice && (
                  <span className="original-price-badge">$ {originalPrice}</span>
                )}
                <div className="current-price">${parseFloat(product.price).toFixed(2)}</div>
                {discountAmount && (
                  <span className="discount-text">${discountAmount} OFF</span>
                )}
              </div>

              <div className="product-options">
                <div className="option-group">
                  <label className="option-label">Size</label>
                  <select className="option-select">
                    <option>Regular</option>
                    <option>Large</option>
                    <option>Extra Large</option>
                  </select>
                </div>

                <div className="option-group">
                  <label className="option-label">Add-ons</label>
                  <select className="option-select">
                    <option>None</option>
                    <option>Extra Sauce</option>
                    <option>Extra Cheese</option>
                  </select>
                </div>
              </div>

              <div className="quantity-selector">
                <button className="quantity-btn" onClick={handleDecrease}>−</button>
                <input type="number" className="quantity-input" value={quantity} readOnly />
                <button className="quantity-btn" onClick={handleIncrease}>+</button>
              </div>

              <button className="main-add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <div className="product-description">
                <h3 className="description-title">Description</h3>
                <p className="description-text">
                  {product.description || 'Lorem ipsum dolor sit amet consectetur. Senectus netus tincidunt tincidunt sed donec. Fermentum et aliquam metus.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Dishes Section */}
      <section className="related-dishes-section">
        <div className="container">
          <h2 className="related-title">Related Dishes</h2>
          
          <div className="related-dishes-grid">
            {relatedProducts.map(relatedProduct => {
              const originalPrice = relatedProduct.discount > 0 
                ? (parseFloat(relatedProduct.price) / (1 - relatedProduct.discount / 100)).toFixed(2)
                : null;
              const discountAmount = originalPrice 
                ? (parseFloat(originalPrice) - parseFloat(relatedProduct.price)).toFixed(2)
                : null;

              return (
                <div key={relatedProduct.id} className="related-dish-item">
                  <div className="dish-badges">
                    {relatedProduct.is_bestseller && <span className="badge best-seller">Best Seller</span>}
                    {relatedProduct.sold_count >= 50 && <span className="badge sold-badge">50+ Sold</span>}
                  </div>
                  <div className="dish-image">
                    {relatedProduct.image || relatedProduct.image_path ? (
                      <img 
                        src={getProductImageUrl(relatedProduct.image || relatedProduct.image_path)} 
                        alt={relatedProduct.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span>Menu Image</span>
                    )}
                  </div>
                  <div className="dish-info">
                    <h3 className="dish-name">{relatedProduct.name}</h3>
                    <div className="dish-bottom">
                      <div className="dish-price-info">
                        <span className="dish-price">${parseFloat(relatedProduct.price).toFixed(2)}</span>
                        {originalPrice && (
                          <>
                            <span className="original-price">${originalPrice}</span>
                            <span className="discount-badge">${discountAmount} OFF</span>
                          </>
                        )}
                      </div>
                      <button className="add-to-cart-btn" onClick={() => navigate(`/product/${relatedProduct.id}`)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-dots">
              {Array.from({ length: 5 }, (_, index) => (
                <span 
                  key={index}
                  className={`dot ${index === 0 ? 'active' : ''}`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
