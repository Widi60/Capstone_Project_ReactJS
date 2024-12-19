import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import Modal from '../components/Modal';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => state.products.items);
    const cartItems = useSelector((state) => state.cart.items);
    const authToken = localStorage.getItem('authToken');

    const product = products.find((p) => p.id === parseInt(id));
    const cartProduct = cartItems.find((item) => item.id === product?.id);
    const remainingStock = product?.stock - (cartProduct ? cartProduct.quantity : 0);

    const [quantity, setQuantity] = useState(1);
    const [modal, setModal] = useState(null);

    const handleIncrement = () => {
        if (quantity < remainingStock) {
            setQuantity(quantity + 1);
        } else {
            setModal({
                message: 'Cannot exceed available stock.',
                color: 'red',
            });
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (!authToken) {
            navigate('/login'); 
            return;
        }

        if (quantity <= remainingStock) {
            // Check if the product already exists in the cart and update its quantity
            if (cartProduct && cartProduct.quantity + quantity <= remainingStock) {
                dispatch(addToCart({ ...product, quantity: cartProduct.quantity + quantity }));
                setModal({
                    message: 'Product has been successfully updated in your cart!',
                    color: 'green',
                });
            } else if (!cartProduct) {
                dispatch(addToCart({ ...product, quantity }));
                setModal({
                    message: 'Product has been successfully added to your cart!',
                    color: 'green',
                });
            } else {
                setModal({
                    message: 'Your cart already has the maximum quantity for this product.',
                    color: 'red',
                });
            }
        } else {
            setModal({
                message: 'The selected quantity exceeds the available stock.',
                color: 'red',
            });
        }
    };

    if (!product) {
        return <div className="container mt-5">Product not found.</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{product.title}</h1>

            {modal && (
                <Modal
                    message={modal.message}
                    color={modal.color}
                    onClose={() => setModal(null)}
                />
            )}

            <div className="row">
                <div className="col-md-6">
                    <img
                        src={product.image}
                        className="img-fluid"
                        alt={product.title}
                        style={{ height: '300px', objectFit: 'contain' }}
                    />
                </div>
                <div className="col-md-6">
                    <h4>Category: {product.category}</h4>
                    <p className="fw-bold">Price: ${product.price}</p>
                    <p>{product.description}</p> {/* Removed text-truncate class here */}

                    <div className="mb-3">
                        <label>Quantity</label>
                        <div className="d-flex align-items-center">
                            <button
                                className="btn btn-secondary me-2"
                                onClick={handleDecrement}
                                disabled={quantity === 1}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button
                                className="btn btn-secondary ms-2"
                                onClick={handleIncrement}
                                disabled={quantity === remainingStock}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-danger" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
