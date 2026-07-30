# CLAUDE.md

## プロジェクト概要

青森県のブルーベリー農園「根岸FARM」の公式サイト。HTML/CSS/JS の静的サイトで、GitHub Pages が `main` ブランチをそのまま本番公開している（ビルド・ステージング環境なし）。詳細構成は [README.md](README.md) を参照。

## ブランチ運用（必須）

`main` への push は数分以内にそのまま本番サイトへ反映される。そのため:

- **`main` に直接コミット・pushしない。** 必ず `main` から作業ブランチ（`feature/xxx` / `fix/xxx` / `hotfix/xxx`）を切って作業する
- ユーザーから明示的に「直接pushして」等の指示がない限り、変更は作業ブランチ上で行い、push・PR作成前にユーザーに確認する
- 詳しい運用ルールは [CONTRIBUTING.md](CONTRIBUTING.md) を参照

## GAS（`gas/Code.gs`）を変更した場合

git 連携でデプロイされない。`main` へマージしても本番の Apps Script には反映されないため、Apps Script エディタ側で「デプロイを管理」から既存デプロイを更新する手動作業が別途必要（[README.md](README.md#予約フォームgoogle-apps-script連携) 参照）。この作業はユーザー自身の手動操作になる旨を伝えること。
