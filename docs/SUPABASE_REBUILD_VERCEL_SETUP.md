# Supabase 再構築 & Vercel 環境変数 セットアップ手順

90日間の非アクティブにより Supabase が一時停止/アーカイブされた場合の再構築手順です。  
**前提**: Supabase で「Create Project」は既に完了していること。

---

## 目次
1. [必要な環境変数一覧](#1-必要な環境変数一覧)
2. [Supabase ダッシュボードでの設定](#2-supabase-ダッシュボードでの設定)
3. [データベーススキーマの投入](#3-データベーススキーマの投入)
4. [RLS ポリシーの適用](#4-rls-ポリシーの適用)
5. [Vercel 環境変数の登録](#5-vercel-環境変数の登録)
6. [再デプロイと動作確認](#6-再デプロイと動作確認)
7. [トラブルシューティング](#7-トラブルシューティング)

---

## 1. 必要な環境変数一覧

本アプリが使用する環境変数（`nuxt.config.ts` / `lib/supabase.ts` 参照）:

| 変数名 | 取得元 | 用途 |
|--------|--------|------|
| `SUPABASE_URL` | Supabase プロジェクト設定 | Supabase API のエンドポイント |
| `SUPABASE_ANON_KEY` | Supabase プロジェクト設定（Publishable API Key） | Supabase クライアント認証（公開用） |
| `JWT_SECRET` | 任意生成 | アプリ独自の JWT 署名用（ログイン token 発行） |

※ `SUPABASE_SERVICE_ROLE_KEY` は `.env.example` にありますが、本アプリでは使用していません。`SUPABASE_ANON_KEY` のみで動作します。

---

## 2. Supabase ダッシュボードでの設定

### 2-1. プロジェクトURL と APIキーを取得

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. 再作成したプロジェクトを選択
3. 左メニュー **Project Settings**（歯車アイコン）→ **API** または **API Keys**
4. 以下をメモ（またはコピー）:
   - **Project URL** → `SUPABASE_URL` に使用
   - **Publishable API Key** → `SUPABASE_ANON_KEY` に使用

### 2-2. SQL Editor を開く

1. 左メニュー **SQL Editor** をクリック
2. **New query** で新しいクエリを作成

---

## 3. データベーススキーマの投入

アプリは `database/schema.sql` のスキーマ（`User` / `Clock` テーブル）を使用しています。

### 3-1. スキーマ SQL を実行

**SQL Editor** に以下を貼り付けて実行してください（`database/schema.sql` の内容）:

```sql
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
```

### 3-2. 実行結果の確認

- `Success. No rows returned` または `Success. X rows returned` と表示されれば OK
- テーブル一覧: 左メニュー **Table Editor** で `User` / `Clock` テーブルが存在することを確認

### 3-3. テストアカウントのパスワード

| アカウント | email | パスワード |
|------------|-------|------------|
| 管理者 | admin@example.com | admin123 |
| 一般ユーザー | user1@example.com | userpass1 |

---

## 4. RLS ポリシーの適用

本アプリは**独自 JWT 認証**を使っており、Supabase Auth の `auth.uid()` は使いません。  
そのため、`fix_rls_policies.sql` の簡素化された RLS ポリシーを使用します。

### 4-1. 既存ポリシー削除（初回のみスキップ可）

既に `supabase_rls_policies.sql` を適用済みの場合は、以下で既存ポリシーを削除します:

```sql
-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view own profile" ON "User";
DROP POLICY IF EXISTS "Users can update own profile" ON "User";
DROP POLICY IF EXISTS "Admins can view all users" ON "User";
DROP POLICY IF EXISTS "Admins can update all users" ON "User";
DROP POLICY IF EXISTS "Users can view own clock records" ON "Clock";
DROP POLICY IF EXISTS "Users can create own clock records" ON "Clock";
DROP POLICY IF EXISTS "Users can update own clock records" ON "Clock";
DROP POLICY IF EXISTS "Admins can view all clock records" ON "Clock";
DROP POLICY IF EXISTS "Admins can update all clock records" ON "Clock";
DROP POLICY IF EXISTS "Admins can create clock records for all users" ON "Clock";
```

### 4-2. RLS を有効化し、簡素化ポリシーを適用

```sql
-- RLSを有効化
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Clock" ENABLE ROW LEVEL SECURITY;

-- Userテーブルのポリシー（認証チェックはアプリケーション側で行う）
CREATE POLICY "Allow all users to read" ON "User"
  FOR SELECT USING (true);

CREATE POLICY "Allow all users to update" ON "User"
  FOR UPDATE USING (true);

-- Clockテーブルのポリシー
CREATE POLICY "Allow all users to read clocks" ON "Clock"
  FOR SELECT USING (true);

CREATE POLICY "Allow all users to create clocks" ON "Clock"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all users to update clocks" ON "Clock"
  FOR UPDATE USING (true);
```

SQL Editor で実行し、エラーが出ないことを確認してください。

---

## 5. Vercel 環境変数の登録

### 5-1. Vercel ダッシュボードを開く

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. 出退勤管理アプリのプロジェクトを選択

### 5-2. 環境変数を設定

1. プロジェクト画面で **Settings** タブをクリック
2. 左メニュー **Environment Variables** を選択
3. 以下の変数を追加（または既存を更新）:

| Name | Value | Environment |
|------|-------|--------------|
| `SUPABASE_URL` | Supabase の Project URL | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | Supabase の Publishable API Key | Production, Preview, Development |
| `JWT_SECRET` | 任意のランダム文字列（例: `openssl rand -base64 32` で生成） | Production, Preview, Development |

### 5-3. JWT_SECRET の生成（新規プロジェクトの場合）

既存の JWT_SECRET を覚えていない場合は、新規生成してください:

```bash
openssl rand -base64 32
```

※ 既存トークンは無効になります。本番ユーザーがいる場合は、全員ログインし直しが必要です。

### 5-4. 保存

- 各変数入力後 **Save** をクリック
- 全変数登録後、**Redeploy** の案内が出る場合は、**Redeploy** を実行

---

## 6. 再デプロイと動作確認

### 6-1. GitHub Actions 経由のデプロイ

- 本プロジェクトは Vercel と GitHub 連携のため、`main` への push で自動デプロイされます
- 環境変数を変更しただけの場合は、Vercel ダッシュボードから **Deployments** → 最新デプロイの **…** → **Redeploy** を実行

### 6-2. 手動で再デプロイする場合

1. Vercel プロジェクト → **Deployments**
2. 最新デプロイの **…** メニュー → **Redeploy**
3. 「Use existing Build Cache」のチェックを外して **Redeploy** を推奨

### 6-3. 動作確認

1. デプロイ後の URL にアクセス
2. ログイン画面で以下を試す:
   - **一般ユーザー**: `user1@example.com` / `userpass1`
   - **管理者**: `admin@example.com` / `admin123`
3. 出勤打刻・退勤打刻・履歴表示が問題なく動作することを確認

---

## 7. トラブルシューティング

### ログインできない

- **401 エラー**: メールアドレス・パスワードが正しいか確認（上記テストアカウント）
- **500 エラー**: Vercel の環境変数が正しく設定されているか確認
  - `SUPABASE_URL` / `SUPABASE_ANON_KEY` の前後にスペースが入っていないか
  - 値が Supabase の新しいプロジェクトのものか確認

### データベースエラー（relation "User" does not exist）

- `database/schema.sql` のスキーマが正しく実行されているか確認
- Table Editor で `User` / `Clock` テーブルが存在するか確認

### RLS によりアクセス拒否される

- `fix_rls_policies.sql` のポリシーが適用されているか確認
- Supabase SQL Editor で `SELECT * FROM "User"` が実行できるか確認（Publishable API Key で）

### Vercel のビルドは成功するがアプリが動かない

- 環境変数は **Production** に設定されているか確認
- Redeploy 時に **Use existing Build Cache** を外して再ビルド

---

## 参照ファイル（repomix 準拠）

- `database/schema.sql` - テーブル定義・テストデータ
- `fix_rls_policies.sql` - RLS ポリシー（簡素化版）
- `nuxt.config.ts` - `supabaseUrl`, `supabaseKey`, `jwtSecret` の参照
- `lib/supabase.ts` - Supabase クライアント初期化
- `.env.example` - 環境変数テンプレート

---

*最終更新: 2025年2月*
