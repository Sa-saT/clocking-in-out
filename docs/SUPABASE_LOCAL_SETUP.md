# Supabase ローカル起動・確認手順

Supabase を**ローカル環境で動かす**ための手順書です。Nuxt アプリと連携して動作確認できます。

---

## この手順書の対象と Docker について

| 開発スタイル | Docker | 本手順書 |
|--------------|--------|----------|
| **Supabase をローカルで動かす**（`supabase start`） | **必須** | 対象 |
| **Supabase Cloud に接続する**（`pnpm dev` + `.env` で Cloud URL） | 不要 | 対象外 |

  
ローカルで Nuxt の起動確認をするだけなら、`.env` に Cloud の URL を設定し `pnpm dev` すれば十分です。

本手順書は、**Supabase 本体をローカルで動かしたい場合**（オフライン開発、Cloud を使わない検証など）向けです。  
その場合は Supabase CLI が Docker 上で DB・API を起動するため、**Docker のインストールが必須**となります。

---

## 目次
1. [supabase フォルダの役割](#1-supabase-フォルダの役割)
2. [前提条件](#2-前提条件)
3. [Supabase ローカル起動](#3-supabase-ローカル起動)
4. [データベーススキーマの投入](#4-データベーススキーマの投入)
5. [Nuxt アプリの環境変数設定](#5-nuxt-アプリの環境変数設定)
6. [動作確認](#6-動作確認)
7. [停止・トラブルシューティング](#7-停止トラブルシューティング)

---

## 1. supabase フォルダの役割

本プロジェクトの `supabase/` フォルダは、**Supabase CLI によるローカル開発**用の設定を格納しています。

### フォルダ構成

| ファイル・ディレクトリ | 役割 |
|------------------------|------|
| **config.toml** | Supabase CLI の設定ファイル。`supabase start` 実行時に参照され、ローカル Supabase のポート・サービス・認証設定などを定義する |
| **migrations/** | `supabase db push` や `supabase db reset` 時に適用されるマイグレーション SQL。※本アプリは `database/schema.sql` を正本としており、migrations の内容（users/clocks）はアプリ未使用 |
| **.gitignore** | Supabase CLI が生成する一時ファイル（`.branches`, `.temp` 等）を Git から除外する設定 |

### 補足

- **Cloud 運用時**: `supabase/` フォルダは不要。Supabase Cloud のダッシュボードと SQL Editor で手動実行する運用。
- **ローカル運用時**: `supabase/` フォルダが必須。`config.toml` がなければ `supabase start` は失敗する。
- **config.toml の主な設定**:
  - API: `http://127.0.0.1:54321`
  - DB: `localhost:54322`
  - Studio: `http://127.0.0.1:54323`
  - Auth の site_url: `http://127.0.0.1:3000`（Nuxt のデフォルトポート）

---

## 2. 前提条件

※ 本手順（Supabase ローカル起動）を実行する場合のみ必要です。

### 必須

- **Docker**（Docker Desktop / Rancher Desktop / Podman / OrbStack / colima のいずれか）  
  ※ `supabase start` は Docker コンテナで Supabase を起動するため必須
- **Node.js 20 以上**
- **Supabase CLI**

### Supabase CLI のインストール

```bash
# npm の場合
npm install -g supabase

# pnpm の場合
pnpm add -g supabase

# Homebrew（macOS）の場合
brew install supabase/tap/supabase
```

インストール確認:

```bash
supabase --version
```

---

## 3. Supabase ローカル起動

### 3-1. 起動コマンド

プロジェクトルートで実行:

```bash
supabase start
```

初回は Docker イメージのダウンロードで数分かかることがあります。

### 3-2. 起動後の出力

起動が完了すると、以下のようなローカル接続情報が表示されます:

```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: （表示される JWT シークレット）
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（長い文字列）
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（長い文字列）
```

**重要**: `API URL` と `anon key` をメモしてください。次のステップで使用します。

### 3-3. Supabase Studio の確認

ブラウザで `http://127.0.0.1:54323` にアクセスし、Supabase Studio が開くことを確認します。

---

## 4. データベーススキーマの投入

本アプリは `database/schema.sql` のスキーマ（`User` / `Clock` テーブル）を使用します。  
migrations の `users` / `clocks` はアプリ未使用のため、手動でスキーマを投入します。

### 4-1. SQL Editor で実行

1. Supabase Studio（`http://127.0.0.1:54323`）を開く
2. 左メニュー **SQL Editor** を選択
3. **New query** で新しいクエリを作成
4. 以下を貼り付けて **Run** を実行:

```sql
-- User テーブルの作成（SupabaseのcamelCase構造に合わせて）
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Clock" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
  "clockIn" TIMESTAMP NOT NULL,
  "clockOut" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_clock_user_id ON "Clock"("userId");
CREATE INDEX IF NOT EXISTS idx_clock_clock_in ON "Clock"("clockIn");

INSERT INTO "User" (email, password, name) VALUES 
('admin@example.com', '$2b$10$2O/q3t2UxDPpId9oE2bAruqW9y6PSINeOykO4GW38EdDtHf5sMDNC', '管理者'),
('user1@example.com', '$2b$10$0nUE4ZV3ODbi8E9iPH6OLuNzXSwvleDUta1R38DobFl3j78Ez7w26', '一般ユーザー')
ON CONFLICT (email) DO NOTHING;
```

### 4-2. RLS ポリシーの適用（任意）

本アプリは独自 JWT 認証のため、簡素化した RLS を使用します。  
必要に応じて `fix_rls_policies.sql` の内容を SQL Editor で実行してください。

---

## 5. Nuxt アプリの環境変数設定

ローカル Supabase に接続するため、`.env.local` を作成または編集します。

### 5-1. .env.local の作成

プロジェクトルートに `.env.local` を作成し、以下を設定:

```env
# ローカル Supabase（supabase start の出力から取得）
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="<supabase start で表示された anon key を貼り付け>"

# JWT 署名用（任意の文字列で可）
JWT_SECRET="your-local-jwt-secret-key"

NODE_ENV="development"
```

※ `SUPABASE_ANON_KEY` は `supabase start` 実行時に表示される `anon key` の値をそのまま使用します。

### 5-2. 環境変数の読み込み

Nuxt は `.env` の後に `.env.local` を読み込み、後者が優先されます。  
既存の `.env` に Cloud 用の値が入っていても、`.env.local` で上書きされます。

---

## 6. 動作確認

### 6-1. Nuxt アプリの起動

```bash
pnpm dev
```

### 6-2. 動作確認手順

1. ブラウザで `http://localhost:3000` を開く
2. ログイン画面で以下を試す:
   - **一般ユーザー**: `user1@example.com` / `userpass1`
   - **管理者**: `admin@example.com` / `admin123`
3. 出勤打刻・退勤打刻・履歴表示が正常に動作することを確認

---

## 7. 停止・トラブルシューティング

### ローカル Supabase の停止

```bash
supabase stop
```

### 完全リセット（DB も含めて初期化）

```bash
supabase stop
supabase start
```

その後、[4. データベーススキーマの投入](#4-データベーススキーマの投入) を再度実行してください。

### Docker が起動していない

`supabase start` は Docker コンテナを使用します。Docker Desktop 等が起動していることを確認してください。

### ポート競合

54321〜54327 番ポートが他プロセスで使用されていると起動に失敗します。  
該当プロセスを停止するか、`config.toml` でポートを変更してください。

### 接続エラー（Nuxt アプリから）

- `.env.local` の `SUPABASE_URL` が `http://127.0.0.1:54321` であること
- `SUPABASE_ANON_KEY` が `supabase start` の出力と一致していること
- Supabase が `supabase start` で起動中であることを確認

---

## 参照

- [Supabase CLI - Local Development](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Supabase CLI config](https://supabase.com/docs/guides/local-development/cli/config)
- `database/schema.sql` - アプリが使用する正本スキーマ
- `docs/SUPABASE_REBUILD_VERCEL_SETUP.md` - Cloud 運用・再構築手順

---

*最終更新: 2025年2月*
