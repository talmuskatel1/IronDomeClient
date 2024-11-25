import React, { useState } from 'react';
import { Box, Typography, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AuthPage, AuthPaper, AuthTextField, AuthButton } from '../styles/auth-styles';

const validationSchema = yup.object({
    username: yup
        .string()
        .required('Username is required'),
    password: yup
        .string()
        .required('Password is required'),
});

const Login = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setError('');
                
                const response = await fetch('http://localhost:3010/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                localStorage.setItem('token', data.access_token);
                navigate('/');
                
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Login failed');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <AuthPage>
            <AuthPaper>
                <Typography 
                    component="h1" 
                    variant="h4" 
                    sx={{ 
                        mb: 4,
                        fontWeight: 'bold',
                        color: '#1976D2'
                    }}
                >
                    Sign In
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <AuthTextField
                        fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        disabled={loading}
                    />

                    <AuthTextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        disabled={loading}
                    />

                    <AuthButton
                        type="submit"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </AuthButton>

                    <Box sx={{ textAlign: 'center' }}>
                        <Link 
                            href="/signup"
                            sx={{
                                color: '#1976D2',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Don't have an account? Sign Up
                        </Link>
                    </Box>
                </Box>
            </AuthPaper>
        </AuthPage>
    );
};

export default Login;