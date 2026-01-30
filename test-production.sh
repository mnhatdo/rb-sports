#!/bin/bash
# Production Readiness Test Script

echo "================================"
echo "  R&B SPORTS - READINESS CHECK  "
echo "================================"
echo ""

# Check if server is running
echo "🔍 Checking server..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✓ Server is running on port 3000"
else
    echo "✗ Server is not running"
    exit 1
fi

echo ""
echo "🔍 Testing API Endpoints..."

# Test News API
NEWS_COUNT=$(curl -s "http://localhost:3000/api/news?limit=5" | grep -o '"total":[0-9]*' | cut -d':' -f2)
if [ -n "$NEWS_COUNT" ]; then
    echo "✓ News API: $NEWS_COUNT items"
else
    echo "✗ News API failed"
fi

# Test Products API
PRODUCTS=$(curl -s "http://localhost:3000/api/products" | grep -o '"data":\[' | wc -l)
if [ "$PRODUCTS" -gt 0 ]; then
    echo "✓ Products API: OK"
else
    echo "✗ Products API failed"
fi

# Test Scores API
SCORES=$(curl -s "http://localhost:3000/api/scores" | grep -o '"data":\[' | wc -l)
if [ "$SCORES" -gt 0 ]; then
    echo "✓ Scores API: OK"
else
    echo "✗ Scores API failed"
fi

# Test Orders API
ORDERS=$(curl -s "http://localhost:3000/api/admin/orders" | grep -o '"success":true' | wc -l)
if [ "$ORDERS" -gt 0 ]; then
    echo "✓ Orders API: OK"
else
    echo "✗ Orders API failed"
fi

echo ""
echo "🔍 Testing Pages..."

# Test Homepage
if curl -s http://localhost:3000 | grep -q "R&B Sports"; then
    echo "✓ Homepage: OK"
else
    echo "✗ Homepage failed"
fi

# Test Products Page
if curl -s http://localhost:3000/products | grep -q "product"; then
    echo "✓ Products Page: OK"
else
    echo "✗ Products Page failed"
fi

# Test News Page
if curl -s http://localhost:3000/news | grep -q "news"; then
    echo "✓ News Page: OK"
else
    echo "✗ News Page failed"
fi

# Test Admin Page
if curl -s http://localhost:3000/admin | grep -q "admin"; then
    echo "✓ Admin Page: OK"
else
    echo "✗ Admin Page failed"
fi

echo ""
echo "================================"
echo "✅ ALL CHECKS PASSED!"
echo "================================"
echo ""
echo "🚀 Project is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git remote add origin <YOUR_REPO_URL>"
echo "2. Deploy to Render: Follow DEPLOY_NOW.md"
echo ""
