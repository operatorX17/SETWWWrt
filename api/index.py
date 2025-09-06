from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime
import os
from typing import Optional, List

# Create FastAPI app
app = FastAPI(title="OG Armory Backend", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
@app.get("/api")
async def root():
    return {
        "message": "OG Armory Backend API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "platform": "Vercel"
    }

@app.get("/api/status")
async def get_status():
    """Get system status"""
    return {
        "status": "healthy", 
        "platform": "vercel",
        "timestamp": datetime.now().isoformat(),
        "environment": os.getenv('VERCEL_ENV', 'development')
    }

@app.post("/api/status")
async def create_status(request: Request):
    """Create status entry"""
    try:
        data = await request.json()
        return {
            "message": "Status received", 
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Product sync endpoint
@app.post("/api/sync-products")
async def sync_products():
    """Trigger product sync from Shopify"""
    try:
        return {
            "status": "success",
            "message": "Product sync initiated",
            "timestamp": datetime.now().isoformat(),
            "note": "This is a simplified version for Vercel deployment"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

# Vercel handler
handler = app