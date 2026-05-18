import { useState, useEffect } from "react";
import { getAllProducts, searchProducts } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import styles from "../styles/products.module.css";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First"   },
  { value: "price_asc",  label: "Price: Low–High" },
  { value: "price_desc", label: "Price: High–Low" },
  { value: "name_asc",   label: "Name: A–Z"       },
];

export default function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [keyword, setKeyword]     = useState("");
  const [category, setCategory]   = useState("");
  const [sort, setSort]           = useState("newest");
  const [page, setPage]           = useState(0);
  const [totalPages, setTotal]    = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isSearching) {
      doSearch(page);
    } else {
      fetchProducts(page);
    }
  }, [page, sort]);

  const fetchProducts = async (p = 0) => {
    setLoading(true); setError("");
    try {
      const res = await getAllProducts(p, PAGE_SIZE, sort);
      setProducts(res.data.content);
      setTotal(res.data.totalPages);
      setTotalItems(res.data.totalElements);
    } catch { setError("Failed to load products"); }
    finally { setLoading(false); }
  };

  const doSearch = async (p = 0) => {
    setLoading(true); setError("");
    try {
      const res = await searchProducts(keyword, category, p, PAGE_SIZE);
      setProducts(res.data.content);
      setTotal(res.data.totalPages);
      setTotalItems(res.data.totalElements);
    } catch { setError("Search failed"); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setPage(0);
    doSearch(0);
  };

  const handleReset = () => {
    setKeyword(""); setCategory(""); setSort("newest");
    setIsSearching(false); setPage(0);
    fetchProducts(0);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
  };

  // Derive unique categories from currently visible products
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          {!loading && (
            <p className={styles.resultCount}>
              {totalItems} product{totalItems !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Sort */}
        <select value={sort} onChange={handleSortChange} className={styles.select}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className={styles.searchBar}>
        <input type="text" placeholder="Search products..."
          value={keyword} onChange={e => setKeyword(e.target.value)}
          className={styles.searchInput} />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className={styles.select}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className={styles.searchBtn}>Search</button>
        <button type="button" onClick={handleReset} className={styles.resetBtn}>Reset</button>
      </form>

      {loading && <p className={styles.message}>Loading products...</p>}
      {error   && <p className={styles.error}>{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className={styles.message}>No products found.</p>
      )}

      {!loading && !error && (
        <>
          <div className={styles.grid}>
            {products.map(product => (
              <div key={product.productId} className={styles.card}
                onClick={() => navigate(`/products/${product.productId}`)}>
                <img src={product.imageUrl || "https://placehold.co/300x200"}
                  alt={product.name} className={styles.image} />
                <div className={styles.cardBody}>
                  <span className={styles.category}>{product.category}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.description}>
                    {product.description?.slice(0, 80)}
                    {product.description?.length > 80 ? "..." : ""}
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                    <span className={product.stock > 0 ? styles.stock : styles.outOfStock}>
                      {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pageBtn}
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}>
                ← Prev
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i}
                    className={`${styles.pageNum} ${i === page ? styles.pageActive : ""}`}
                    onClick={() => setPage(i)}>
                    {i + 1}
                  </button>
                ))}
              </div>

              <button className={styles.pageBtn}
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}