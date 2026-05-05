import { addToCart } from "../api/cartApi";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productApi";
import styles from "../styles/productDetail.module.css";

export default function ProductDetailPage() {
  const { id } = useParams();        // reads the :id from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: parseInt(id), quantity });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to add to cart";
      alert(msg);
    }
  };

  if (loading) return <div className={styles.center}>Loading...</div>;
  if (error)   return <div className={styles.center}>{error}</div>;
  if (!product) return null;

  return (
    <div className={styles.page}>

      <button className={styles.back} onClick={() => navigate("/products")}>
        ← Back to Products
      </button>

      <div className={styles.container}>

        {/* Left — Image */}
        <div className={styles.imageBox}>
          <img
            src={product.imageUrl || "https://placehold.co/500x400"}
            alt={product.name}
            className={styles.image}
          />
        </div>

        {/* Right — Info */}
        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.price}</span>
            <span className={product.stock > 0 ? styles.inStock : styles.outStock}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className={styles.quantityRow}>
              <span className={styles.label}>Quantity</span>
              <div className={styles.quantityControl}>
                <button
                  className={styles.qBtn}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >−</button>
                <span className={styles.qValue}>{quantity}</span>
                <button
                  className={styles.qBtn}
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                >+</button>
              </div>
            </div>
          )}

          <button
            className={styles.cartBtn}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || added}
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}