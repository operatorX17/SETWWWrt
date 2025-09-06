#!/bin/bash
echo "🔥 Clearing all caches and restarting OG Armory..."

# Clear React build cache
cd /app/frontend
rm -rf node_modules/.cache
rm -rf build
rm -rf .next

# Clear browser cache by adding cache buster
echo "// Cache cleared at $(date)" >> src/App.js

# Restart services
cd /app
sudo supervisorctl restart frontend
sudo supervisorctl restart backend

echo "✅ Cache cleared and services restarted!"