import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // The cookies are already set by the backend redirect
                const { data } = await API.get('/users/current-user');
                setUser(data.data);
                navigate('/');
            } catch (error) {
                console.error("Auth success fetch user error:", error);
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate, setUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-text-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mb-4"></div>
            <p className="text-xl font-medium">Authenticating...</p>
        </div>
    );
};

export default AuthSuccess;
