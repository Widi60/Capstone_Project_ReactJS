import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import logo1 from '../assets/images/logo1.png';
import logo2 from '../assets/images/logo2.png';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const cartItems = useSelector((state) => state.cart.items);
    const cartCount = cartItems.length;

    useEffect(() => {
        setAuthToken(localStorage.getItem('authToken'));
    }, []); 

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setAuthToken(null); 
        dispatch(clearCart()); 
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#2C3E50' }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src={logo1} alt="Logo 1" style={{ height: '40px', marginRight: '5px' }} />
                    <img src={logo2} alt="Logo 2" style={{ height: '40px' }} />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" style={{ color: 'white' }}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                to={authToken ? "/my-cart" : "/login"} 
                                style={{ color: 'white' }}
                            >
                                My Cart
                                {cartCount > 0 && (
                                    <span className="badge bg-danger">{cartCount}</span>
                                )}
                            </Link>
                        </li>
                        {authToken ? (
                            <li className="nav-item">
                                <button className="btn nav-link" onClick={handleLogout} style={{ color: 'white' }}>Logout</button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login" style={{ color: 'white' }}>Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
