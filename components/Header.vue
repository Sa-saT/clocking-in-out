<template>
  <header class="bg-white shadow" role="banner">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="text-xl font-bold text-blue-700" aria-label="出退勤管理アプリ" tabindex="0">
        出退勤管理アプリ
      </div>
      <nav class="space-x-4" aria-label="メインナビゲーション">
        <NuxtLink to="/dashboard" class="hover:underline" :aria-current="$route.path === '/dashboard' ? 'page' : undefined">
          ダッシュボード
        </NuxtLink>
        <NuxtLink to="/admin/dashboard" class="hover:underline" :aria-current="$route.path === '/admin/dashboard' ? 'page' : undefined">
          管理者
        </NuxtLink>
      </nav>
      <div>
        <!-- 認証状態表示（例: ユーザー名 or ログイン/ログアウト）-->
        <slot name="auth" />
      </div>
    </div>
  </header>
</template> 