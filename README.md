# KoeYomi (声読み) - テキスト音声読み上げリーダー

文字を自然な音声で読み上げる高機能テキストスピーチリーダー。
Web Speech API によるゼロ遅延・完全クライアント完結の音声合成と、文単位のハイライト・息継ぎ制御・読み替え辞書を備えています。

## GitHub Pages への公開方法

本プロジェクトは GitHub Pages に即座に対応するよう設定済みです（相対パス `./` 設定済み）。

### 方法1: GitHub Actions による自動デプロイ（推奨）
1. 本リポジトリを GitHub にプッシュします。
2. GitHub のリポジトリページを開き、**「Settings」** → **「Pages」** に移動します。
3. **「Build and deployment」** の **「Source」** を **「GitHub Actions」** に選択します。
4. `main` ブランチにプッシュされると、自動的に `.github/workflows/deploy.yml` が実行され、GitHub Pages に公開されます。

### 方法2: `gh-pages` コマンドによる手動デプロイ
1. ターミナルで以下のコマンドを実行します：
   ```bash
   npm run deploy
   ```
2. 自動的にビルドが行われ、`gh-pages` ブランチに成果物が公開されます。
3. GitHub の **「Settings」** → **「Pages」** で、Branch を `gh-pages` に指定して保存します。

---

## 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# 型チェック
npm run lint
```
