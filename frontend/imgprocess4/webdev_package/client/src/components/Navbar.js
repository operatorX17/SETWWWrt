import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  CloudSync as SyncIcon,
  Upload as UploadIcon,
  Store as ShopifyIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [notificationCount] = useState(3); // This would come from a context/state

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Products', path: '/products', icon: <ProductsIcon /> },
    { label: 'Shopify Sync', path: '/shopify', icon: <ShopifyIcon /> },
    { label: 'Upload Manager', path: '/upload', icon: <UploadIcon /> },
    { label: 'Sync Manager', path: '/sync', icon: <SyncIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon /> }
  ];

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)'
      }}
    >
      <Toolbar>
        {/* Logo/Brand */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 0, 
            mr: 4,
            fontWeight: 700,
            background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          AI Store Manager
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 0.5,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  backgroundColor: isActivePath(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Spacer for mobile */}
        {isMobile && <Box sx={{ flexGrow: 1 }} />}

        {/* Notifications */}
        <IconButton 
          color="inherit" 
          sx={{ mr: 1 }}
          onClick={() => {/* Handle notifications */}}
        >
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={isActivePath(item.path)}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light + '20',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light + '30',
                  }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {item.icon}
                <Typography variant="body1">{item.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;