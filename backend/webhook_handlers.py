#!/usr/bin/env python3
"""
Shopify Webhook Handlers for FastAPI Backend
Handles real-time updates from Shopify
"""

from fastapi import APIRouter, Request, HTTPException, Header
import json
import hashlib
import hmac
import base64
import os
from typing import Optional

router = APIRouter()

# Shopify webhook secret for verification
WEBHOOK_SECRET = os.getenv('SHOPIFY_WEBHOOK_SECRET', 'your_webhook_secret_here')

def verify_webhook(data: bytes, signature: str) -> bool:
    """Verify Shopify webhook signature"""
    if not signature:
        return False
    
    try:
        digest = hmac.new(
            WEBHOOK_SECRET.encode('utf-8'),
            data,
            digestmod=hashlib.sha256
        ).digest()
        
        computed_signature = base64.b64encode(digest).decode()
        return hmac.compare_digest(computed_signature, signature)
    except Exception:
        return False

@router.post("/webhooks/products/create")
async def handle_product_create(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None)
):
    """Handle product creation webhook"""
    try:
        body = await request.body()
        
        # Verify webhook (skip in development)
        if WEBHOOK_SECRET != 'your_webhook_secret_here':
            if not verify_webhook(body, x_shopify_hmac_sha256):
                raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        product_data = json.loads(body)
        
        # Process new product
        product_id = product_data.get('id')
        title = product_data.get('title')
        
        print(f"🆕 New product created: {title} (ID: {product_id})")
        
        # Here you can:
        # 1. Update your local product cache
        # 2. Trigger product sync
        # 3. Send notifications
        # 4. Update MongoDB
        
        return {"status": "success", "message": f"Product {title} processed"}
        
    except Exception as e:
        print(f"❌ Error processing product create webhook: {str(e)}")
        return {"status": "error", "message": str(e)}

@router.post("/webhooks/products/update")
async def handle_product_update(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None)
):
    """Handle product update webhook"""
    try:
        body = await request.body()
        product_data = json.loads(body)
        
        product_id = product_data.get('id')
        title = product_data.get('title')
        
        print(f"🔄 Product updated: {title} (ID: {product_id})")
        
        return {"status": "success", "message": f"Product {title} updated"}
        
    except Exception as e:
        print(f"❌ Error processing product update webhook: {str(e)}")
        return {"status": "error", "message": str(e)}

@router.post("/webhooks/products/delete")
async def handle_product_delete(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None)
):
    """Handle product deletion webhook"""
    try:
        body = await request.body()
        product_data = json.loads(body)
        
        product_id = product_data.get('id')
        title = product_data.get('title')
        
        print(f"🗑️ Product deleted: {title} (ID: {product_id})")
        
        return {"status": "success", "message": f"Product {title} deleted"}
        
    except Exception as e:
        print(f"❌ Error processing product delete webhook: {str(e)}")
        return {"status": "error", "message": str(e)}

@router.post("/webhooks/orders/create")
async def handle_order_create(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None)
):
    """Handle new order webhook"""
    try:
        body = await request.body()
        order_data = json.loads(body)
        
        order_id = order_data.get('id')
        total_price = order_data.get('total_price')
        customer_email = order_data.get('email')
        
        print(f"🛒 New order: #{order_id} - ₹{total_price} - {customer_email}")
        
        # Process order:
        # 1. Send confirmation emails
        # 2. Update inventory
        # 3. Trigger fulfillment
        # 4. Analytics tracking
        
        return {"status": "success", "message": f"Order #{order_id} processed"}
        
    except Exception as e:
        print(f"❌ Error processing order webhook: {str(e)}")
        return {"status": "error", "message": str(e)}

@router.post("/webhooks/inventory/update")
async def handle_inventory_update(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None)
):
    """Handle inventory update webhook"""
    try:
        body = await request.body()
        inventory_data = json.loads(body)
        
        inventory_item_id = inventory_data.get('inventory_item_id')
        available = inventory_data.get('available')
        
        print(f"📦 Inventory updated: Item {inventory_item_id} - Available: {available}")
        
        return {"status": "success", "message": "Inventory updated"}
        
    except Exception as e:
        print(f"❌ Error processing inventory webhook: {str(e)}")
        return {"status": "error", "message": str(e)}