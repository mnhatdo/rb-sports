#!/bin/bash
# Quick GitHub Push Script

echo "🚀 R&B SPORTS - QUICK DEPLOY TO GITHUB"
echo ""
echo "Bạn cần làm 2 bước:"
echo ""
echo "1. Tạo repo mới trên GitHub:"
echo "   → Truy cập: https://github.com/new"
echo "   → Tên gợi ý: rb-sports hoặc redbull-sports"
echo "   → Chọn Public hoặc Private"
echo "   → KHÔNG tạo README (đã có sẵn)"
echo ""
read -p "2. Nhập URL repo GitHub (ví dụ: https://github.com/username/rb-sports.git): " REPO_URL
echo ""

if [ -z "$REPO_URL" ]; then
    echo "❌ Lỗi: URL không được để trống!"
    exit 1
fi

echo "📤 Đang push code lên GitHub..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
git branch -M main
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ PUSH THÀNH CÔNG!"
    echo ""
    echo "📋 Bước tiếp theo:"
    echo "1. Truy cập: https://render.com"
    echo "2. Đăng ký/Login bằng GitHub"
    echo "3. New Web Service → Chọn repo vừa push"
    echo "4. Config:"
    echo "   - Build: npm install"
    echo "   - Start: npm start"
    echo "   - Instance: Free"
    echo "5. Click Deploy!"
    echo ""
    echo "🎉 Chi tiết xem file DEPLOY_NOW.md"
else
    echo ""
    echo "❌ Lỗi khi push. Kiểm tra:"
    echo "- URL repo có đúng không?"
    echo "- Bạn đã đăng nhập Git chưa?"
    echo "- Chạy: git config --global user.name 'Your Name'"
    echo "- Chạy: git config --global user.email 'your@email.com'"
fi
