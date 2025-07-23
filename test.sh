#!/bin/bash

# Vitestテスト実行用シェルスクリプト
# pnpm環境前提
# 主要なテストコマンドをメニュー形式で簡単実行

set -e

function show_menu() {
  echo "=============================="
  echo " Vitest テスト実行メニュー"
  echo "=============================="
  echo "1) 全テスト実行 (pnpm vitest run)"
  echo "2) カバレッジ付き全テスト (pnpm vitest run --coverage)"
  echo "3) UIモード (pnpm vitest --ui)"
  echo "4) ウォッチモード (pnpm vitest --watch)"
  echo "5) componentsのみ (pnpm vitest run tests/components)"
  echo "6) APIのみ (pnpm vitest run tests/server/api)"
  echo "7) composablesのみ (pnpm vitest run tests/composables)"
  echo "8) storesのみ (pnpm vitest run tests/stores)"
  echo "9) カバレッジレポートをHTMLで開く (coverage/index.html)"
  echo "10) カバレッジ付き全テスト＋HTMLレポートを自動表示"
  echo "0) 終了"
  echo "=============================="
  echo -n "番号を選択してください: "
}

while true; do
  show_menu
  read -r choice
  case $choice in
    1)
      pnpm vitest run
      ;;
    2)
      pnpm vitest run --coverage
      ;;
    3)
      pnpm vitest --ui
      ;;
    4)
      pnpm vitest --watch
      ;;
    5)
      pnpm vitest run tests/components
      ;;
    6)
      pnpm vitest run tests/server/api
      ;;
    7)
      pnpm vitest run tests/composables
      ;;
    8)
      pnpm vitest run tests/stores
      ;;
    9)
      if [ -f coverage/index.html ]; then
        open coverage/index.html
      else
        echo "coverage/index.html が存在しません。まずカバレッジ付きテストを実行してください。"
      fi
      ;;
    10)
      pnpm vitest run --coverage && \
      if [ -f coverage/index.html ]; then
        open coverage/index.html
      else
        echo "coverage/index.html が存在しません。"
      fi
      ;;
    0)
      echo "終了します。"
      exit 0
      ;;
    *)
      echo "無効な選択です。もう一度入力してください。"
      ;;
  esac
  echo ""
done 