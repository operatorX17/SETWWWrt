import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  CloudSync,
  Store,
  Refresh,
  Warning,
  CheckCircle,
  Error,
  Info
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: {
      total: 0,
      active: 0,
      draft: 0,
      with_images: 0
    },
    sync: {
      shopify_synced: 0,
      last_sync: null,
      auto_sync_enabled: false
    },
    ai_processing: {
      total_processed: 0,
      last_processed: null,
      processing_active: false
    }
  });
  const [alerts, setAlerts] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch product statistics
      const productResponse = await fetch('/api/products/stats');
      const productStats = await productResponse.json();

      // Fetch sync status
      const syncResponse = await fetch('/api/sync/status');
      const syncStats = await syncResponse.json();

      // Fetch Shopify sync status
      const shopifyResponse = await fetch('/api/shopify/sync-status');
      const shopifyStats = await shopifyResponse.json();

      // Fetch auto-sync status
      const autoSyncResponse = await fetch('/api/sync/auto/status');
      const autoSyncStats = await autoSyncResponse.json();

      setStats({
        products: {
          total: productStats.total || 0,
          active: productStats.by_status?.active || 0,
          draft: productStats.by_status?.draft || 0,
          with_images: syncStats.database?.products_with_images || 0
        },
        sync: {
          shopify_synced: syncStats.database?.synced_to_shopify || 0,
          last_sync: shopifyStats.last_sync_at,
          auto_sync_enabled: autoSyncStats.enabled || false
        },
        ai_processing: {
          total_processed: syncStats.ai_output?.productCount || 0,
          last_processed: syncStats.ai_output?.modified,
          processing_active: false // This would be determined by checking if the script is running
        }
      });

      // Generate alerts based on data
      const newAlerts = [];
      
      if (productStats.total === 0) {
        newAlerts.push({
          type: 'info',
          message: 'No products found. Start by syncing AI output or uploading product data.',
          action: () => navigate('/sync')
        });
      }
      
      if (syncStats.database?.image_sync_percentage < 50) {
        newAlerts.push({
          type: 'warning',
          message: `Only ${syncStats.database?.image_sync_percentage || 0}% of products have images. Consider uploading more images.`,
          action: () => navigate('/upload')
        });
      }
      
      if (syncStats.database?.shopify_sync_percentage < 30) {
        newAlerts.push({
          type: 'warning',
          message: `Only ${syncStats.database?.shopify_sync_percentage || 0}% of products are synced to Shopify.`,
          action: () => navigate('/shopify')
        });
      }
      
      if (!autoSyncStats.enabled) {
        newAlerts.push({
          type: 'info',
          message: 'Auto-sync is disabled. Enable it to automatically sync new AI-generated products.',
          action: () => navigate('/sync')
        });
      }

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setAlerts([{
        type: 'error',
        message: 'Failed to load dashboard data. Please check your connection and try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, subtitle, icon, color = 'primary', progress, action }) => (
    <Card sx={{ height: '100%', cursor: action ? 'pointer' : 'default' }} onClick={action}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }} 
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const getImageSyncPercentage = () => {
    if (stats.products.total === 0) return 0;
    return Math.round((stats.products.with_images / stats.products.total) * 100);
  };

  const getShopifySyncPercentage = () => {
    if (stats.products.total === 0) return 0;
    return Math.round((stats.sync.shopify_synced / stats.products.total) * 100);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={stats.sync.auto_sync_enabled ? 'Auto-sync ON' : 'Auto-sync OFF'}
            color={stats.sync.auto_sync_enabled ? 'success' : 'default'}
            icon={stats.sync.auto_sync_enabled ? <CheckCircle /> : <Warning />}
          />
          <Tooltip title="Refresh Dashboard">
            <IconButton onClick={fetchDashboardData} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {alerts.map((alert, index) => (
            <Alert 
              key={index}
              severity={alert.type}
              sx={{ mb: 1 }}
              action={
                alert.action && (
                  <Button color="inherit" size="small" onClick={alert.action}>
                    Fix
                  </Button>
                )
              }
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.products.total}
            subtitle={`${stats.products.active} active, ${stats.products.draft} draft`}
            icon={<Inventory />}
            color="primary"
            action={() => navigate('/products')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="AI Processed"
            value={stats.ai_processing.total_processed}
            subtitle={stats.ai_processing.last_processed ? 
              `Last: ${new Date(stats.ai_processing.last_processed).toLocaleDateString()}` : 
              'No processing detected'
            }
            icon={<TrendingUp />}
            color="success"
            action={() => navigate('/sync')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Image Sync"
            value={stats.products.with_images}
            subtitle={`${getImageSyncPercentage()}% of products have images`}
            icon={<CloudSync />}
            color="info"
            progress={getImageSyncPercentage()}
            action={() => navigate('/upload')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Shopify Sync"
            value={stats.sync.shopify_synced}
            subtitle={stats.sync.last_sync ? 
              `Last: ${new Date(stats.sync.last_sync).toLocaleDateString()}` : 
              'Never synced'
            }
            icon={<Store />}
            color="warning"
            progress={getShopifySyncPercentage()}
            action={() => navigate('/shopify')}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CloudSync />}
                onClick={() => navigate('/sync')}
                sx={{ py: 1.5 }}
              >
                Sync AI Output
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Store />}
                onClick={() => navigate('/shopify')}
                sx={{ py: 1.5 }}
              >
                Sync to Shopify
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Inventory />}
                onClick={() => navigate('/upload')}
                sx={{ py: 1.5 }}
              >
                Upload Images
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Inventory />}
                onClick={() => navigate('/products')}
                sx={{ py: 1.5 }}
              >
                Manage Products
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;