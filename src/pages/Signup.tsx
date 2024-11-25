import React, { useState } from 'react';
import { Box, Typography, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AuthPage, AuthPaper, AuthTextField, AuthButton } from '../styles/auth-styles';

const validationSchema = yup.object({
    username: yup
        .string()
        .min(3, 'Username should be at least 3 characters')
        .required('Username is required'),
    password: yup
        .string()
        .min(6, 'Password should be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

const Signup = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setError('');
                
                const response = await fetch('http://localhost:3010/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Signup failed');
                }

                localStorage.setItem('token', data.access_token);
                navigate('/');
                
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Signup failed');
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
                    Sign Up
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

                    <AuthTextField
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        disabled={loading}
                    />

                    <AuthButton
                        type="submit"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </AuthButton>

                    <Box sx={{ textAlign: 'center' }}>
                        <Link 
                            href="/login"
                            sx={{
                                color: '#1976D2',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Already have an account? Sign In
                        </Link>
                    </Box>
                </Box>
            </AuthPaper>
        </AuthPage>
    );
};

export default Signup;