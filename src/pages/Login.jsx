import React, { useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        const demoCredentials = {
            username: "mor_2314",
            password: "83r5^_"
        };
    
        try {
            const response = await fetch('https://fakestoreapi.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(demoCredentials),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Login success:', data);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', demoCredentials.username);
                window.location.href = '/';
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('Error logging in');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="container mt-5">
            <h1 className="text-center">Login</h1>
            <p className="text-center">Login to your account to start shopping!</p>
            
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <form onSubmit={handleLogin} className="shadow p-4 border rounded">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-danger">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-danger w-100"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
