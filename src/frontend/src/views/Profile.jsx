import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';
import Button from '@mui/material/Button';
import axios from 'axios';
import MUItheme from '../styles/MUItheme';

export default function Profile() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/signin');
  };

  useEffect(() => {
    const header = { authorization: `Bearer ${token}` };
    const getData = async () => {
      axios
        .get('/api/1.0/users/', { headers: header })
        .then((response) => {
          if (response.status === 200) {
            setProfile(response.data.user);
          }
        })
        .catch((err) => {
          console.log(err.response.data);
          localStorage.removeItem('token');
          return err.response.data;
        });
    };
    getData();
  }, []);

  return (
    <ThemeProvider theme={MUItheme()}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
          }}
        >
          <Typography component="h2" variant="h5">
            {' '}
            Wealocme
            {' '}
          </Typography>
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ bgcolor: deepOrange[500], marginRight: '10px' }}>
              {profile.name.slice(0, 4)}
            </Avatar>
            <Typography component="h2" variant="h5">
              {profile.email}
            </Typography>
            <Button
              variant="outlined"
              sx={{ marginLeft: '10px' }}
              onClick={logout}
            >
              logout
              {' '}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
