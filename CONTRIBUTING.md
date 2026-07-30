# ブランチ運用ルール

このリポジトリは GitHub Pages で `main` ブランチの内容をそのまま本番公開しています。
`.github/workflows` などのビルド・ステージング環境は無いため、**`main` に push した内容が数分以内にそのまま本番サイトへ反映されます。**

そのため、事故防止のために以下の運用（GitHub Flow ベース）を基本とします。

## ブランチ構成

- **`main`** … 本番用。常に「今すぐ公開して問題ない状態」を保つ
- **作業ブランチ** … `main` から都度切って作業する
  - `feature/xxx` … 新機能・追加コンテンツ（例: `feature/gallery-photos`）
  - `fix/xxx` … 不具合修正（例: `fix/calendar-badge`）
  - `hotfix/xxx` … 本番で今すぐ直す必要がある緊急修正

## 基本の流れ

1. `main` から作業ブランチを作成する
   ```bash
   git switch main
   git pull
   git switch -c feature/xxx
   ```
2. 変更を行い、**ローカルでブラウザ確認**してから commit する
   ```bash
   python -m http.server 8080
   # http://localhost:8080 で動作確認
   ```
3. push して Pull Request を作成する（一人運用でもセルフレビュー用に PR を経由する）
4. 問題なければ `main` にマージする → 数分で本番サイトに反映される

## GAS（`gas/Code.gs`）を変更した場合の注意

`gas/Code.gs` は git と連動デプロイされません。`main` へのマージだけでは本番の Apps Script には反映されないため、マージ後に必ず以下を行ってください（詳細は [README.md](README.md#予約フォームgoogle-apps-script連携) 参照）。

1. Apps Script エディタにも同じ内容を貼り直す
2. 「デプロイを管理」→ **既存デプロイを更新**（新規デプロイはURLが変わるため不可）

## そのほかの原則

- `main` への直接 push は避け、作業ブランチ経由にする
- 本番で見た目に関わる変更（`index.html` / `styles.css` / `script.js`）は、マージ前に必ずローカルかブラウザで確認する
- マージ後は本番サイト（https://negishifarm.com）で実際に反映されているか目視確認する
- 作業が終わったブランチは削除してよい
