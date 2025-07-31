-- users テーブルの作成
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- clocks テーブルの作成
CREATE TABLE IF NOT EXISTS clocks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  clock_in TIMESTAMP NOT NULL,
  clock_out TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_clocks_user_id ON clocks(user_id);
CREATE INDEX IF NOT EXISTS idx_clocks_clock_in ON clocks(clock_in);

-- テストデータの投入
INSERT INTO users (email, password, name) VALUES 
('admin@example.com', 'admin123', '管理者'),
('user@example.com', 'user123', '一般ユーザー')
ON CONFLICT (email) DO NOTHING; 