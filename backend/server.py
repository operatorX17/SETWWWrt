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
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import webhook handlers
from webhook_handlers import router as webhook_router

app = FastAPI(title="OG Armory Backend", version="1.0.0")

# CORS configuration
cors_origins = os.getenv("CORS_ORIGIN", "http://localhost:3010").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# MongoDB connection
try:
    MONGO_URL = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/pspk_store')
    DB_NAME = os.getenv('MONGODB_DB_NAME', 'pspk_store')
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db.status
    products_collection = db.products
    print(f"✅ Connected to MongoDB: {MONGO_URL}")
except Exception as e:
    print(f"❌ MongoDB connection failed: {str(e)}")
    db = None
    collection = None
    products_collection = None

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
# Import Shopify service
from shopify_service import shopify_service

@app.get("/api/shopify/health")
async def shopify_health():
    """Check Shopify API connectivity"""
    return shopify_service.health_check()

@app.post("/api/shopify/sync-products")
async def sync_products():
    """Sync all products from Shopify to MongoDB"""
    try:
        result = shopify_service.sync_all_products()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

@app.get("/api/products")
async def get_products(limit: int = 50, skip: int = 0):
    """Get products from MongoDB"""
    try:
        if not products_collection:
            raise HTTPException(status_code=500, detail="Database not connected")
            
        products = list(products_collection.find(
            {"sync_status": {"$ne": "deleted"}}
        ).skip(skip).limit(limit))
        
        # Convert ObjectId to string for JSON serialization
        for product in products:
            if '_id' in product:
                product['_id'] = str(product['_id'])
                
        total_count = products_collection.count_documents(
            {"sync_status": {"$ne": "deleted"}}
        )
        
        return {
            "products": products,
            "total": total_count,
            "limit": limit,
            "skip": skip
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get products: {str(e)}")

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    """Get a specific product by Shopify ID"""
    try:
        if not products_collection:
            raise HTTPException(status_code=500, detail="Database not connected")
            
        product = products_collection.find_one({"shopify_id": int(product_id)})
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        # Convert ObjectId to string
        if '_id' in product:
            product['_id'] = str(product['_id'])
            
        return product
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get product: {str(e)}")

@app.post("/api/shopify/products")
async def create_shopify_product(product_data: dict):
    """Create a new product in Shopify"""
    try:
        result = shopify_service.create_product(product_data)
        if result:
            return {"status": "success", "product": result}
        else:
            raise HTTPException(status_code=500, detail="Failed to create product")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")

@app.put("/api/shopify/products/{product_id}")
async def update_shopify_product(product_id: str, product_data: dict):
    """Update a product in Shopify"""
    try:
        result = shopify_service.update_product(product_id, product_data)
        if result:
            return {"status": "success", "product": result}
        else:
            raise HTTPException(status_code=500, detail="Failed to update product")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update product: {str(e)}")

@app.delete("/api/shopify/products/{product_id}")
async def delete_shopify_product(product_id: str):
    """Delete a product from Shopify"""
    try:
        result = shopify_service.delete_product(product_id)
        if result:
            return {"status": "success", "message": "Product deleted"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete product")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete product: {str(e)}")

@app.get("/api/storefront/products")
async def get_storefront_products(query: str = None):
    """Get products for frontend display using Storefront API"""
    try:
        result = shopify_service.get_storefront_products(query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get storefront products: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    log_level = os.getenv("LOG_LEVEL", "info")
    
    uvicorn.run(
        "server:app",
        host=host,
        port=port,
        reload=True,
        log_level=log_level
    )