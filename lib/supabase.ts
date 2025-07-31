import { createClient } from '@supabase/supabase-js'
import { mockSupabase } from './mockDatabase'

// ========================================
// 1. 環境変数の取得
// ========================================
const config = useRuntimeConfig()
const supabaseUrl = config.supabaseUrl
const supabaseKey = config.supabaseKey

// ========================================
// 2. 環境判定と設定検証
// ========================================
const isDevelopment = process.env.NODE_ENV === 'development'

// 有効な認証情報があるかチェック
const hasValidCredentials = supabaseUrl && supabaseKey && 
  supabaseUrl !== 'https://demo-project.supabase.co' && 
  supabaseKey !== 'demo-key'

// ========================================
// 3. Supabaseクライアントの作成
// ========================================
// 実際のSupabaseを使用（モックは無効化）
export const supabase = createClient(
  supabaseUrl || 'https://demo-project.supabase.co',
  supabaseKey || 'demo-key'
)

// ========================================
// 4. 開発環境での設定確認ログ
// ========================================
if (isDevelopment) {
  console.log('🔍 Supabase Config:', {
    url: supabaseUrl ? 'set' : 'not set',
    key: supabaseKey ? 'set' : 'not set',
    hasValidCredentials,
    isDevelopment
  })
}

// ========================================
// 5. データベースの型定義
// ========================================
// Userテーブルの型定義
export interface User {
  id: number
  email: string
  password: string
  name?: string
  createdAt: string
}

// Clockテーブルの型定義
export interface Clock {
  id: number
  userId: number
  clockIn: string
  clockOut?: string
  createdAt: string
} 