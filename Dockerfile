# Use Node.js 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create .env file
ENV NEXT_PUBLIC_SUPABASE_URL=https://bdyxvwdtqogjerbjdtgb.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_secret_jdAHBH7CGvQN7WeDkF8VRA_57hGMdgS
ENV PORT=3001
ENV SECRET_KEY=AlphaEnginePasswordManager2026SecureKey

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
