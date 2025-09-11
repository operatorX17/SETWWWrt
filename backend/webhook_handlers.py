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
from datetime import datetime
import logging
from shopify_service import shopify_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Shopify webhook secret for verification
WEBHOOK_SECRET = os.getenv('SHOPIFY_WEBHOOK_SECRET', 'your_webhook_secret_here')

def verify_webhook(data: bytes, signature: str) -> bool:
    """Verify Shopify webhook signature using service"""
    return shopify_service.verify_webhook(data, signature)

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
                logger.warning("Invalid webhook signature")
                raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        product_data = json.loads(body)
        
        # Store product in MongoDB via service
        shopify_service.products_collection.update_one(
            {'shopify_id': product_data['id']},
            {'$set': {
                **product_data,
                'webhook_received_at': datetime.utcnow(),
                'sync_status': 'webhook_created'
            }},
            upsert=True
        )
        
        # Process new product
        product_id = product_data.get('id')
        title = product_data.get('title')
        
        logger.info(f"Product created via webhook: {title} (ID: {product_id})")
        
        return {"status": "success", "message": f"Product {title} processed"}
        
    except Exception as e:
        logger.error(f"Product creation webhook failed: {str(e)}")
        return {"status": "error", "message": str(e)}

@router.post("/webhooks/products/update")
async def handle_product_update(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None)
):
    """Handle product update webhook"""
    try:
        body = await request.body()
        
        # Verify webhook (skip in development)
        if WEBHOOK_SECRET != 'your_webhook_secret_here':
            if not verify_webhook(body, x_shopify_hmac_sha256):
                logger.warning("Invalid webhook signature")
                raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        product_data = json.loads(body)
        
        # Update product in MongoDB via service
        shopify_service.products_collection.update_one(
            {'shopify_id': product_data['id']},
            {'$set': {
                **product_data,
                'webhook_received_at': datetime.utcnow(),
                'sync_status': 'webhook_updated'
            }}
        )
        
        product_id = product_data.get('id')
        title = product_data.get('title')
        
        logger.info(f"Product updated via webhook: {title} (ID: {product_id})")
        
        return {"status": "success", "message": f"Product {title} updated"}
        
    except Exception as e:
        logger.error(f"Product update webhook failed: {str(e)}")
        return {"status": "error", "message": str(e)}

@router.post("/webhooks/products/delete")
async def handle_product_delete(
    request: Request,
    x_shopify_hmac_sha256: Optional[str] = Header(None)
):
    """Handle product deletion webhook"""
    try:
        body = await request.body()
        
        # Verify webhook (skip in development)
        if WEBHOOK_SECRET != 'your_webhook_secret_here':
            if not verify_webhook(body, x_shopify_hmac_sha256):
                logger.warning("Invalid webhook signature")
                raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        product_data = json.loads(body)
        
        # Mark product as deleted in MongoDB
        shopify_service.products_collection.update_one(
            {'shopify_id': product_data['id']},
            {'$set': {
                'deleted_at': datetime.utcnow(),
                'webhook_received_at': datetime.utcnow(),
                'sync_status': 'webhook_deleted'
            }}
        )
        
        product_id = product_data.get('id')
        title = product_data.get('title')
        
        logger.info(f"Product deleted via webhook: {title} (ID: {product_id})")
        
        return {"status": "success", "message": f"Product {title} deleted"}
        
    except Exception as e:
        logger.error(f"Product deletion webhook failed: {str(e)}")
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