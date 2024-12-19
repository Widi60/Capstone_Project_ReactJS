import React, { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => state.products.items);
    const cartItems = useSelector((state) => state.cart.items);
    const status = useSelector((state) => state.products.status);
    const [modal, setModal] = useState(null);
    const authToken = localStorage.getItem('authToken');
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, status]);

    const handleAddToCart = (product) => {
        if (!authToken) {
            navigate('/login');
            return;
        }

        if (product.stock <= 0) {
            setModal({
                message: 'Sorry, this product is out of stock.',
                color: 'red',
            });
            return;
        }

        const existingCartItem = cartItems.find((item) => item.id === product.id);

        if (existingCartItem) {
            if (existingCartItem.quantity >= product.stock) {
                setModal({
                    message: 'You have already added the maximum available quantity for this product.',
                    color: 'red',
                });
                return;
            } else {
                dispatch(addToCart({ ...product, quantity: existingCartItem.quantity + 1 }));
            }
        } else {
            const quantity = 1;
            dispatch(addToCart({ ...product, quantity }));
        }

        setModal({
            message: 'Product has been successfully added to your cart!',
            color: 'green',
        });
    };

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            // If the search query is empty, show all products
            setFilteredProducts(products);
        } else {
            // Filter products based on search query
            const queryWords = searchQuery.toLowerCase().split(' ').filter(Boolean);
            const results = products.filter((product) =>
                queryWords.some((word) => product.title.toLowerCase().includes(word))
            );
            setFilteredProducts(results);
        }
        setShowResults(true);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Our Products</h1>

            {modal && (
                <Modal
                    message={modal.message}
                    color={modal.color}
                    onClose={() => setModal(null)}
                />
            )}

            <div className="mb-4 d-flex justify-content-center">
                <div className="input-group" style={{ maxWidth: '500px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="btn btn-danger"
                        onClick={handleSearch}
                    >
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>

            <div className="row">
                {status === 'loading' && <p>Loading products...</p>}
                {status === 'succeeded' &&
                    (showResults ? 
                        filteredProducts.map((product) => (
                            <div className="col-6 col-md-4 col-lg-3 mb-4" key={product.id}>
                                <div className="card h-100">
                                    <img
                                        src={product.image}
                                        className="card-img-top img-fluid"
                                        alt={product.title}
                                        style={{ height: '200px', objectFit: 'contain' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title text-truncate">{product.title}</h5>
                                        <p className="card-text text-muted text-truncate">{product.category}</p>
                                        <p className="card-text fw-bold">${product.price}</p>
                                        <p className="card-text">Stock: {product.stock}</p>
                                        <div className="d-flex justify-content-between">
                                            <Link to={`/product/${product.id}`} className="btn btn-secondary">
                                                Detail
                                            </Link>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) :
                        products.map((product) => (
                            <div className="col-6 col-md-4 col-lg-3 mb-4" key={product.id}>
                                <div className="card h-100">
                                    <img
                                        src={product.image}
                                        className="card-img-top img-fluid"
                                        alt={product.title}
                                        style={{ height: '200px', objectFit: 'contain' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title text-truncate">{product.title}</h5>
                                        <p className="card-text text-muted text-truncate">{product.category}</p>
                                        <p className="card-text fw-bold">${product.price}</p>
                                        <p className="card-text">Stock: {product.stock}</p>
                                        <div className="d-flex justify-content-between">
                                            <Link to={`/product/${product.id}`} className="btn btn-secondary">
                                                Detail
                                            </Link>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                {status === 'failed' && <p>Error fetching products.</p>}
            </div>
        </div>
    );
};

export default Home;
