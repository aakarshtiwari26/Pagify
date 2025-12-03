#!/bin/bash

echo "🚀 Starting Pagify Setup..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  No .env.local file found!"
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local with your actual credentials:"
    echo "   - MONGODB_URI (from MongoDB Atlas)"
    echo "   - OPENAI_API_KEY (from OpenAI Platform)"
    echo ""
    echo "📝 Opening .env.local for you to edit..."
    open .env.local || nano .env.local || vim .env.local
    echo ""
    read -p "Press Enter once you've added your credentials..."
fi

echo "✅ Environment file ready!"
echo ""
echo "🔧 Starting development server..."
echo ""

npm run dev
