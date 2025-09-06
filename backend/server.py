from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime
import os
from typing import Optional, List
import pymongo
from pymongo import MongoClient
import uvicorn

# Import webhook handlers
from webhook_handlers import router as webhook_router

app = FastAPI(title="OG Armory Backend", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
try:
    MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/')
    client = MongoClient(MONGO_URL)
    db = client.og_armory
    collection = db.status
    print(f"✅ Connected to MongoDB: {MONGO_URL}")
except Exception as e:
    print(f"❌ MongoDB connection failed: {str(e)}")
    db = None
    collection = None

# Include webhook routes
app.include_router(webhook_router, prefix="/api")

# Health check endpoint
@app.get("/api/")
async def root():
    return {
        "message": "OG Armory Backend API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "shopify_webhooks": "configured"
    }

@app.get("/api/status")
async def get_status():
    """Get system status"""
    try:
        if collection is not None:
            count = collection.count_documents({})
            latest = collection.find().sort("timestamp", -1).limit(1)
            latest_doc = list(latest)
            
            # Convert ObjectId to string for JSON serialization
            if latest_doc and '_id' in latest_doc[0]:
                latest_doc[0]['_id'] = str(latest_doc[0]['_id'])
            
            return {
                "status": "healthy", 
                "mongodb": "connected",
                "documents_count": count,
                "latest": latest_doc[0] if latest_doc else None,
                "shopify_integration": "active",
                "webhooks": "configured"
            }
        else:
            return {"status": "degraded", "mongodb": "disconnected"}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/api/status")
async def create_status(request: Request):
    """Create status entry"""
    try:
        data = await request.json()
        if collection is not None:
            data["timestamp"] = datetime.now()
            result = collection.insert_one(data)
            return {
                "message": "Status created", 
                "id": str(result.inserted_id),
                "timestamp": data["timestamp"].isoformat()
            }
        else:
            return {"error": "MongoDB not connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Product sync endpoint
@app.post("/api/sync-products")
async def sync_products():
    """Trigger product sync from Shopify"""
    try:
        # Import and run sync
        import sys
        sys.path.append('/app')
        from shopify_webhook_integration import ShopifyIntegration
        
        integration = ShopifyIntegration()
        products = integration.sync_products_to_json()
        
        return {
            "status": "success",
            "message": f"Synced {len(products)} products",
            "count": len(products),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )