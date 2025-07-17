# Nuxt Minimal Starter

# 出退勤管理アプリ（Nuxt3 + JWT認証）

## 概要
- Nuxt3 + TypeScript + Prisma + PostgreSQL による従業員の出退勤管理アプリです。
- 認証方式は**JWT（JSON Web Token）**を採用し、APIはすべてJWTによる認証・保護が必須です。
- クライアント側ではPiniaストア＋SessionStorageで認証状態・トークンを管理し、リロードやタブ再読み込みでも認証状態を維持します。
- APIリクエスト時は自動でAuthorizationヘッダーにJWTを付与します。
- サーバー側はJWTを検証し、認証ユーザーのみが自身のデータにアクセス可能です。
- 詳細な仕様・開発フロー・タスク管理は`APP_SPEC.md`に記載しています。

## 主な技術・設計方針
- Nuxt3（Composition API, <script setup>）
- TypeScript/Prisma/PostgreSQL
- Pinia（状態管理）
- Tailwind CSS（UI）
- JWT認証（jsonwebtoken）
- SessionStorageによる一時ストレージ
- APIは全てJWT認証必須
- APP_SPEC.mdで仕様・タスク・ルールを一元管理

---

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## テスト実行

本プロジェクトではVitestによる自動テスト・カバレッジ計測を簡単に実行できるシェルスクリプト `test.sh` を用意しています。

### 使い方

1. ルートディレクトリで以下を実行してください。

   ```bash
   ./test.sh
   ```

2. メニューが表示されるので、番号を入力するだけで各種テストやカバレッジ計測、レポート表示が可能です。

### メニュー例

```
==============================
 Vitest テスト実行メニュー
==============================
1) 全テスト実行 (pnpm vitest run)
2) カバレッジ付き全テスト (pnpm vitest run --coverage)
3) UIモード (pnpm vitest --ui)
4) ウォッチモード (pnpm vitest --watch)
5) componentsのみ (pnpm vitest run tests/components)
6) APIのみ (pnpm vitest run tests/server/api)
7) composablesのみ (pnpm vitest run tests/composables)
8) storesのみ (pnpm vitest run tests/stores)
9) カバレッジレポートをHTMLで開く (coverage/index.html)
0) 終了
==============================
番号を選択してください: 
```

- カバレッジレポート（HTML）は `2` で生成後、`9` でブラウザ表示できます。
- テスト実行時はpnpm環境が必要です。
