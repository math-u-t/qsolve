# qsolve - 校内問題投稿型Webアプリケーション

![qsolve](https://img.shields.io/badge/Vue.js-3.4-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

校内限定の問題投稿・解答プラットフォーム。ユーザーは問題を投稿し、他のユーザーがそれに挑戦します。不正防止機構を備えたポイントシステムが特徴です。

## 📋 目次

- [プロジェクト概要](#プロジェクト概要)
- [主要機能](#主要機能)
- [技術スタック](#技術スタック)
- [セットアップ手順](#セットアップ手順)
- [ディレクトリ構造](#ディレクトリ構造)
- [コンポーネント一覧](#コンポーネント一覧)
- [ポイント計算ロジック](#ポイント計算ロジック)
- [不正防止機構](#不正防止機構)
- [データフロー](#データフロー)
- [開発ガイド](#開発ガイド)
- [今後の拡張案](#今後の拡張案)

## 🎯 プロジェクト概要

qsolveは、学校内での知識共有と学習を促進するプラットフォームです。生徒たちは自分の得意分野で問題を作成し、他の生徒がそれに挑戦します。ポイントシステムにより、問題投稿者と解答者の両方にインセンティブが与えられます。

### 特徴

- **2つのモード**: 短期チャレンジ（スピード重視）と挑戦型（難問向け）
- **公平性**: ランダムサンプリングによる初期バイアスの排除
- **不正防止**: 連投制限、ポイント上限、異常パターン検出
- **ユーザーフレンドリー**: レスポンシブデザイン、ダークモード対応
- **完全クライアントサイド**: LocalStorageによるデータ永続化（バックエンド不要）

## 🚀 主要機能

### 1. 問題投稿システム

#### 短期チャレンジモード
- **特徴**: スピード重視、時間制限あり
- **制限時間**: デフォルト1時間（カスタマイズ可能）
- **ポイント計算**: 解答時間に応じて変動（早いほど高得点）
- **適用例**: 計算問題、暗記クイズ

#### 挑戦型モード
- **特徴**: 難問向け、ポイント累積
- **時間制限**: なし（正解者が出るまで継続）
- **ポイント計算**: 時間経過と挑戦者数に応じて増加（最大500pt）
- **適用例**: 数学オリンピック級問題、複雑な論理パズル

### 2. ランダムサンプリング機構

新規問題は最初の3-5名にのみ表示され、サンプル期間終了後に全ユーザーに公開されます。

**メリット**:
- 投稿者の仲間グループによる即座の解答を防止
- 公平な難易度評価
- 健全な競争環境の維持

### 3. ポイントシステム

#### (A) 短期チャレンジモード

```javascript
基本ポイント = 100
時間経過係数 = max(0.5, 1 - (経過時間 / 制限時間))
解答者ポイント = 基本ポイント × 時間経過係数 × 1.5
投稿者ボーナス = 基本ポイント × 0.3（正解者が出た場合）
投稿者固定ポイント = 50（誰も解けなかった場合）
```

**例**: 1時間制限の問題を30分で解いた場合
```
時間経過係数 = max(0.5, 1 - (1800 / 3600)) = 0.5
解答者ポイント = 100 × 0.5 × 1.5 = 75pt
投稿者ボーナス = 100 × 0.3 = 30pt
```

#### (B) 挑戦型モード

```javascript
累積ポイント = 50 + (経過時間（時間単位） × 10) + (挑戦者数 × 5)
最大累積ポイント = 500
解答者ポイント = 累積ポイント × 0.7
投稿者ボーナス = 累積ポイント × 0.2
サンプル協力者ボーナス = 累積ポイント × 0.1 / サンプル人数
```

**例**: 5時間経過、10人挑戦、累積200pt
```
解答者ポイント = 200 × 0.7 = 140pt
投稿者ボーナス = 200 × 0.2 = 40pt
サンプル協力者ボーナス = 200 × 0.1 / 5 = 4pt（各人）
```

### 4. 不正防止機構

#### (a) 投稿制限
- **連投制限**: 1日最大5問
- **目的**: スパム投稿や質の低い問題の抑制

#### (b) ポイント上限
- **1日最大**: 1000ポイント
- **目的**: 異常なポイント獲得の防止

#### (c) ランダムサンプリング
- **対象除外**: 投稿者と頻繁に相互解答するユーザー
- **目的**: 仲間グループによる不正防止

#### (d) 異常パターン検出
- **検出項目**:
  - 即座の正解（5秒未満）
  - 特定ユーザー間の頻繁な相互解答
- **対応**: 警告表示、統計記録

## 💻 技術スタック

### コアフレームワーク
- **Vue 3**: Composition API使用
- **TypeScript**: 型安全な開発
- **Vite**: 高速な開発サーバーとビルド

### 状態管理とルーティング
- **Pinia**: 軽量で直感的な状態管理
- **Vue Router**: SPA routing

### UI・スタイリング
- **CSS Variables**: テーマ切り替え
- **CSS Grid / Flexbox**: レスポンシブレイアウト
- **Google Material Icons**: アイコンライブラリ
- **CSS Animations**: スムーズな UX

### 追加ライブラリ
- **marked**: Markdown パース
- **canvas-confetti**: Confetti エフェクト
- **@vueuse/core**: Vue composables utilities

## 🛠️ セットアップ手順

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd qsolve

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

### 開発サーバー
開発サーバーは `http://localhost:3000` で起動します。

## 📂 ディレクトリ構造

```
qsolve/
├── public/
│   └── vite.svg                 # ファビコン
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── global.css       # グローバルスタイル、CSS変数
│   ├── components/
│   │   ├── common/              # 共通コンポーネント
│   │   │   ├── ProblemCard.vue  # 問題カード
│   │   │   ├── UserAvatar.vue   # ユーザーアバター
│   │   │   ├── Timer.vue        # タイマーコンポーネント
│   │   │   └── StatCard.vue     # 統計カード
│   │   └── layout/              # レイアウトコンポーネント
│   │       ├── AppHeader.vue    # ヘッダー
│   │       └── AppFooter.vue    # フッター
│   ├── views/                   # ページコンポーネント
│   │   ├── HomePage.vue         # ホーム
│   │   ├── DashboardPage.vue    # ダッシュボード
│   │   ├── PostProblem.vue      # 問題投稿
│   │   ├── ProblemDetail.vue    # 問題詳細・解答
│   │   ├── RankingPage.vue      # ランキング
│   │   ├── ProfilePage.vue      # プロフィール
│   │   ├── SettingsPage.vue     # 設定
│   │   └── SearchPage.vue       # 検索
│   ├── stores/                  # Pinia ストア
│   │   ├── users.ts             # ユーザー管理
│   │   ├── problems.ts          # 問題管理
│   │   ├── answers.ts           # 解答管理
│   │   └── settings.ts          # 設定管理
│   ├── router/
│   │   └── index.ts             # ルーティング設定
│   ├── types/
│   │   └── index.ts             # TypeScript型定義
│   ├── utils/
│   │   └── mockData.ts          # モックデータ生成
│   ├── App.vue                  # ルートコンポーネント
│   └── main.ts                  # エントリーポイント
├── index.html                   # HTML テンプレート
├── vite.config.ts               # Vite 設定
├── tsconfig.json                # TypeScript 設定
├── package.json                 # 依存関係
└── README.md                    # このファイル
```

## 🧩 コンポーネント一覧と責務

### レイアウトコンポーネント

#### `AppHeader.vue`
- **責務**: グローバルナビゲーション、テーマ切り替え、ユーザー情報表示
- **主要機能**:
  - ページ間ナビゲーション
  - ライト/ダークモード切り替え
  - 現在のユーザー情報表示
  - レスポンシブメニュー

#### `AppFooter.vue`
- **責務**: サイト情報、リンク、著作権表示
- **主要機能**:
  - サイトマップリンク
  - SNSリンク
  - 著作権情報

### 共通コンポーネント

#### `ProblemCard.vue`
- **責務**: 問題情報のカード表示
- **Props**: `problem: Problem`
- **主要機能**:
  - 問題タイトル、モード、ステータス表示
  - ポイント表示
  - 投稿者情報
  - クリックで詳細ページへ遷移

#### `UserAvatar.vue`
- **責務**: ユーザーアバター画像表示
- **Props**: `src: string, alt: string, size?: 'sm' | 'md' | 'lg' | 'xl'`
- **主要機能**:
  - サイズ可変のアバター表示
  - 円形デザイン

#### `Timer.vue`
- **責務**: カウントダウンタイマー表示
- **Props**: `startTime: Date, duration: number`
- **主要機能**:
  - リアルタイムカウントダウン
  - プログレスバー表示
  - 残り時間警告（20%未満）

#### `StatCard.vue`
- **責務**: 統計情報のカード表示
- **Props**: `icon: string, label: string, value: string | number, trend?: number, color?: string`
- **主要機能**:
  - アイコン付き統計表示
  - トレンド表示（増減）

### ページコンポーネント

#### `HomePage.vue`
- **責務**: ランディングページ
- **主要セクション**:
  - ヒーローセクション
  - 統計サマリー
  - 機能紹介
  - 最新問題
  - CTA（Call to Action）

#### `DashboardPage.vue`
- **責務**: 問題一覧と検索・フィルタリング
- **主要機能**:
  - 問題検索
  - モード別フィルター
  - ステータス別フィルター
  - 問題カードグリッド表示

#### `PostProblem.vue`
- **責務**: 新規問題投稿
- **主要機能**:
  - モード選択
  - 問題情報入力（タイトル、問題文、正解）
  - Markdown対応
  - バリデーション
  - 投稿処理

#### `ProblemDetail.vue`
- **責務**: 問題詳細表示と解答
- **主要機能**:
  - 問題内容表示（Markdown レンダリング）
  - タイマー表示（短期チャレンジモード）
  - 解答フォーム
  - 解答判定
  - ポイント獲得アニメーション

#### `RankingPage.vue`
- **責務**: ユーザーランキング表示
- **主要機能**:
  - トップ3表彰台表示
  - ランキングテーブル
  - メダル表示

#### `ProfilePage.vue`
- **責務**: ユーザープロフィール表示
- **主要機能**:
  - ユーザー情報表示
  - 統計情報
  - 投稿した問題一覧

#### `SettingsPage.vue`
- **責務**: アプリケーション設定
- **主要機能**:
  - テーマ切り替え
  - 通知設定

#### `SearchPage.vue`
- **責務**: 問題検索
- **主要機能**:
  - キーワード検索
  - リアルタイム検索結果表示

## 💡 ポイント計算ロジック詳細

### 実装場所
`src/stores/answers.ts` の `calculatePoints()` 関数

### 短期チャレンジモード詳細

```typescript
function calculateSpeedPoints(problem: Problem, timeSpent: number): number {
  const basePoints = 100
  const timeRatio = Math.max(0.5, 1 - (timeSpent / problem.timeLimit!))
  const solverPoints = Math.floor(basePoints * timeRatio * 1.5)

  return solverPoints
}
```

**解析**:
- `timeRatio`: 残り時間の割合（最小0.5）
- 早く解くほど高ポイント、最低でも基本の75%保証
- 投稿者は正解者出現時に30pt獲得

### 挑戦型モード詳細

```typescript
function calculateChallengePoints(problem: Problem): number {
  const hoursSinceCreation = (Date.now() - problem.createdAt.getTime()) / (1000 * 60 * 60)
  const accumulated = Math.min(
    50 + (hoursSinceCreation * 10) + (problem.attemptCount * 5),
    500
  )

  const solverPoints = Math.floor(accumulated * 0.7)
  const authorBonus = Math.floor(accumulated * 0.2)
  const samplingBonus = Math.floor(accumulated * 0.1 / problem.samplingUsers.length)

  return { solverPoints, authorBonus, samplingBonus }
}
```

**解析**:
- 時間経過: 1時間ごとに+10pt
- 挑戦者数: 1人ごとに+5pt
- 最大500ptで頭打ち
- 解答者70%、投稿者20%、サンプル協力者10%で分配

## 🛡️ 不正防止機構の説明

### 1. 連投制限（Rate Limiting）

**実装場所**: `src/stores/users.ts`

```typescript
// ユーザーごとに todayPostCount を管理
const canPostToday = (userId: string): boolean => {
  const user = users.value.get(userId)
  return user ? user.todayPostCount < 5 : false
}
```

**リセット**: 日次バッチ処理で `resetDailyCounters()` 実行

### 2. ポイント上限

**実装場所**: `src/stores/users.ts`

```typescript
const addPoints = (userId: string, points: number) => {
  const user = users.value.get(userId)
  if (!user) return

  // 1日1000ptまで
  if (user.todayPoints + points > 1000) {
    console.warn('Daily point limit reached')
    return false
  }

  user.totalPoints += points
  user.todayPoints += points
  return true
}
```

### 3. ランダムサンプリング

**実装場所**: `src/stores/problems.ts`

```typescript
const selectRandomSamplingUsers = (authorId: string, count: number): string[] => {
  const allUserIds = Array.from(usersStore.users.values())
    .map(u => u.id)
    .filter(id => id !== authorId) // 投稿者除外

  // シャッフルしてランダム選択
  const shuffled = allUserIds.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
```

**サンプル期間**: デフォルト1時間（`samplingEndTime`）

### 4. 異常パターン検出

**実装場所**: `src/stores/answers.ts`

```typescript
// 5秒未満の正解を検出
if (isCorrect && timeSpent < 5) {
  console.warn('Suspicious pattern detected: Too fast answer')
  // 今後の拡張: fraudDetection ストアに記録
}
```

**今後の拡張**:
- 特定ユーザー間の相互解答頻度分析
- 異常スコアの算出
- 管理者通知機能

## 📊 データフロー図

### 問題投稿フロー

```
User (PostProblem.vue)
  ↓ submitProblem()
ProblemsStore
  ↓ createProblem()
  ├─ ランダムサンプリング選択
  ├─ 問題データ作成
  ↓ incrementPostCount()
UsersStore
  └─ 投稿カウント更新
  ↓
LocalStorage
```

### 解答フロー

```
User (ProblemDetail.vue)
  ↓ submitAnswer()
AnswersStore
  ↓ checkAnswer()
  ├─ 正解判定
  ├─ ポイント計算
  ↓ addPoints()
UsersStore
  ├─ 解答者にポイント付与
  ├─ 投稿者にボーナス付与
  └─ サンプル協力者にボーナス付与
  ↓ solveProblem()
ProblemsStore
  └─ 問題ステータス更新
  ↓
LocalStorage
```

### データ永続化

```
Pinia Store
  ↓ saveToLocalStorage()
LocalStorage
  ├─ qsolve-users
  ├─ qsolve-problems
  ├─ qsolve-answers
  ├─ qsolve-point-history
  └─ qsolve-settings
```

## 🎨 デザインシステム

### カラーパレット

#### ライトモード
```css
--bg-primary: #FFFFFF
--bg-secondary: #F5F5F5
--color-primary: #2196F3
--color-accent: #FF9800
--text-primary: #212121
--text-secondary: #757575
```

#### ダークモード
```css
--bg-primary: #121212
--bg-secondary: #1E1E1E
--color-primary: #64B5F6
--color-accent: #FFB74D
--text-primary: #FFFFFF
--text-secondary: #B0B0B0
```

### レスポンシブブレークポイント

- **モバイル**: 320px～767px
- **タブレット**: 768px～1023px
- **デスクトップ**: 1024px以上

### アニメーション

```css
/* ページ遷移 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 250ms ease;
}

/* ホバーエフェクト */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

/* Confetti（正解時） */
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
})
```

## 🔧 開発ガイド

### 新しいページを追加

1. `src/views/` に新しいVueファイルを作成
2. `src/router/index.ts` にルートを追加

```typescript
{
  path: '/new-page',
  name: 'newPage',
  component: () => import('@/views/NewPage.vue')
}
```

### 新しいストアを追加

1. `src/stores/` に新しいTSファイルを作成
2. `defineStore` を使用してストアを定義

```typescript
import { defineStore } from 'pinia'

export const useNewStore = defineStore('new', () => {
  // state, getters, actions
})
```

### TypeScript型を追加

`src/types/index.ts` に型定義を追加

```typescript
export interface NewType {
  id: string
  name: string
}
```

### スタイルのカスタマイズ

`src/assets/styles/global.css` でCSS変数を変更

```css
:root {
  --color-primary: #your-color;
}
```

## 🚀 今後の拡張案

### バックエンド連携

**優先度: 高**

- **REST API / GraphQL**:
  - Express.js + MongoDB
  - NestJS + PostgreSQL
  - Supabase（簡易実装）

- **認証システム**:
  - JWT
  - OAuth 2.0（Google、GitHub）
  - 学校メールアドレス認証

- **リアルタイム機能**:
  - WebSocket（Socket.io）
  - Server-Sent Events
  - 解答状況のリアルタイム更新

### 機能拡張

**優先度: 中**

- **画像アップロード**:
  - 問題文への画像添付
  - Cloudinary / AWS S3連携

- **コメント・議論機能**:
  - 問題へのコメント
  - 解説の投稿
  - いいね機能

- **チーム機能**:
  - チーム作成
  - チーム対抗戦
  - 共同解答

- **バッジシステム**:
  - 達成バッジ（初回投稿、連続解答など）
  - レアバッジ
  - プロフィール表示

### UI/UX改善

**優先度: 中**

- **グラフ・チャート**:
  - ポイント推移グラフ
  - 正解率の可視化
  - カテゴリ別統計

- **通知システム**:
  - ブラウザ通知
  - プッシュ通知（PWA）

- **プログレッシブウェブアプリ（PWA）**:
  - オフライン対応
  - アプリインストール
  - バックグラウンド同期

### セキュリティ強化

**優先度: 高**

- **CSRF保護**
- **XSS対策**（現在はVueの自動エスケープのみ）
- **Rate Limiting（API）**
- **入力サニタイゼーション強化**

### パフォーマンス最適化

**優先度: 低**

- **仮想スクロール**: 大量データ表示
- **画像遅延読み込み**: Lazy loading
- **コード分割**: Dynamic imports
- **Service Worker**: キャッシング戦略

## 📝 ライセンス

MIT License

## 👥 開発者

qsolve development team

---

**質問やフィードバックがあれば、Issueを作成してください！**
