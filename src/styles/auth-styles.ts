import { styled } from '@mui/material/styles';
import { Paper, TextField, Button } from '@mui/material';

export const AuthPage = styled('div')({
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a237e',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'auto'
});

export const AuthPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    maxWidth: '400px',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    margin: theme.spacing(2)
}));

export const AuthTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
            borderColor: '#1976D2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1976D2',
        },
    },
}));

export const AuthButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    background: '#1976D2',
    color: 'white',
    '&:hover': {
        background: '#1565C0',
    },
    height: '48px',
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '16px',
}));