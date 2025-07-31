-- User テーブルの作成（SupabaseのcamelCase構造に合わせて）
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Clock テーブルの作成（SupabaseのcamelCase構造に合わせて）
CREATE TABLE IF NOT EXISTS "Clock" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
  "clockIn" TIMESTAMP NOT NULL,
  "clockOut" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_clock_user_id ON "Clock"("userId");
CREATE INDEX IF NOT EXISTS idx_clock_clock_in ON "Clock"("clockIn");

-- テストデータの投入（bcryptハッシュされたパスワード）
INSERT INTO "User" (email, password, name) VALUES 
('admin@example.com', '$2b$10$2O/q3t2UxDPpId9oE2bAruqW9y6PSINeOykO4GW38EdDtHf5sMDNC', '管理者'),
('user1@example.com', '$2b$10$0nUE4ZV3ODbi8E9iPH6OLuNzXSwvleDUta1R38DobFl3j78Ez7w26', '一般ユーザー')
ON CONFLICT (email) DO NOTHING; 