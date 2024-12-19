import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, removeFromCart } from '../redux/slices/cartSlice';
import { updateProductStock } from '../redux/slices/productSlice';
import Modal from '../components/Modal';

const MyCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const products = useSelector((state) => state.products.items);

    const authToken = localStorage.getItem('authToken');
    const [updatedCartItems, setUpdatedCartItems] = useState(cartItems);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
        }
    }, [authToken, navigate]);

    useEffect(() => {
        setUpdatedCartItems(cartItems);
    }, [cartItems]);

    const handleQuantityChange = (itemId, newQuantity) => {
        const product = products.find((p) => p.id === itemId);

        if (newQuantity <= product.stock) {
            setUpdatedCartItems(
                updatedCartItems.map((item) =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } else {
            setModal({ message: 'Quantity exceeds available stock.', color: 'red' });
        }
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleCheckout = () => {
        if (updatedCartItems.length === 0) {
            setModal({ message: 'Your cart is empty. Please add items before checkout.', color: 'red' });
            return;
        }

        let isValid = true;

        updatedCartItems.forEach((item) => {
            const product = products.find((p) => p.id === item.id);
            if (item.quantity > product.stock) {
                isValid = false;
            }
        });

        if (!isValid) {
            setModal({
                message: 'Some items have quantity greater than available stock. Please adjust the quantity.',
                color: 'red',
            });
            return;
        }

        updatedCartItems.forEach((item) => {
            const productIndex = products.findIndex((p) => p.id === item.id);
            if (productIndex !== -1) {
                const updatedProduct = { ...products[productIndex] };
                if (item.quantity <= updatedProduct.stock) {
                    updatedProduct.stock -= item.quantity;
                    dispatch(
                        updateProductStock({ productId: updatedProduct.id, newStock: updatedProduct.stock })
                    );
                }
            }
        });

        dispatch(clearCart());
        setModal({ message: 'Checkout successful! Your order has been placed.', color: 'green' });
    };

    const handleModalClose = () => {
        setModal(null);
        navigate('/');
    };

    const totalPrice = updatedCartItems.reduce((total, item) => {
        const product = products.find((p) => p.id === item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    return (
        <div className="container mt-5">
            <h1 className="text-center">My Cart</h1>

            {modal && (
                <Modal
                    message={modal.message}
                    color={modal.color}
                    onClose={handleModalClose}
                />
            )}

            <div className="row">
                <div className="col-md-8">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty! You have not selected any items yet.</p>
                    ) : (
                        updatedCartItems.map((item) => {
                            const product = products.find((p) => p.id === item.id);
                            const isQuantityValid = item.quantity <= (product ? product.stock : 0);

                            return (
                                <div className="mb-4" key={item.id}>
                                    <div className="card position-relative">
                                        <button
                                            className="btn position-absolute top-0 end-0 m-2 p-0"
                                            style={{ background: 'transparent', border: 'none' }}
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            <i className="bi bi-trash text-danger fs-5"></i>
                                        </button>
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img
                                                    src={item.image}
                                                    className="card-img-top img-fluid"
                                                    alt={item.title}
                                                    style={{ height: '150px', objectFit: 'contain' }}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <h5 className="card-title">{item.title}</h5>
                                                    <p className="card-text fw-bold" style={{ color: 'red' }}>${item.price}</p>
                                                    <div className="d-flex align-items-center">
                                                        <button
                                                            className="btn btn-secondary me-2"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                            disabled={item.quantity === 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button
                                                            className="btn btn-secondary ms-2"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            disabled={item.quantity === product.stock}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    {!isQuantityValid && (
                                                        <span className="text-danger">Quantity exceeds available stock</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Order Summary</h5>
                            <hr />
                            <ul className="list-group mb-3">
                                {updatedCartItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {item.title}
                                        <span>${(item.quantity * item.price).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <h5 className="text-end" style={{ color: 'red' }}>Total: ${totalPrice.toFixed(2)}</h5>
                            <button className="btn btn-danger w-100 mt-3" onClick={handleCheckout}>
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCart;
