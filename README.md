# kintone モバイルAPI動作確認プラグイン

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/r3-yamauchi/kintone-202603-mobile-plugin)

これは kintone モバイル版の新しいAPI（2026年3月リリース予定）の動作を確認するためのサンプルプラグインです。
ボトムシート、確認ボトムシート、通知メッセージ、ローディング表示の4つの新APIをテストできます。

## 主な機能

- モバイル版レコード一覧画面にテストボタンを表示
- テキストエリアでカスタムメッセージを入力可能
- 4つの新しいモバイルAPIの動作確認:
  - **ボトムシート表示** (`kintone.mobile.createBottomSheet`)
  - **確認ボトムシート表示** (`kintone.mobile.showConfirmBottomSheet`)
  - **通知メッセージ表示** (`kintone.mobile.showNotification`)
  - **ローディング表示** (`kintone.mobile.showLoading`)

## 使用方法

1. プラグインをビルドしてインストールします
2. 対象アプリにプラグインを適用します
3. モバイル端末またはモバイル表示モードでkintoneアプリを開きます
4. レコード一覧画面の上部にテストUIが表示されます
5. テキストエリアにテスト用のメッセージを入力します（空欄の場合はデフォルトメッセージが使用されます）
6. 各ボタンをタップして、対応するモバイルAPIの動作を確認できます

### 各ボタンの動作

- **ボトムシートを表示**: カスタムコンテンツを含むボトムシートを表示します
- **確認ボトムシートを表示**: はい/いいえの確認ダイアログを表示し、選択結果をアラートで表示します
- **通知メッセージを表示**: 画面上部に通知メッセージを表示します
- **ローディングを表示**: ローディングインジケーターを3秒間表示します

## 対応画面

- モバイル版レコード一覧画面（`mobile.app.record.index.show`）

## API リファレンス

このプラグインで使用している kintone モバイル JavaScript API:

- [kintone.mobile.createBottomSheet()](https://cybozu.dev/ja/kintone/news/api-updates/2026-03/) - ボトムシートを作成
- [kintone.mobile.showConfirmBottomSheet()](https://cybozu.dev/ja/kintone/news/api-updates/2026-03/) - 確認ボトムシートを表示
- [kintone.mobile.showNotification()](https://cybozu.dev/ja/kintone/news/api-updates/2026-03/) - 通知メッセージを表示
- [kintone.mobile.showLoading()](https://cybozu.dev/ja/kintone/news/api-updates/2026-03/) - ローディングを表示

## ビルド方法

```bash
# 秘密鍵の生成（初回のみ）
npm run keygen

# プラグインのビルド
npm run build

# 開発モード（ファイル監視）
npm run develop

# プラグインのアップロード
npm run upload
```

ビルドされたプラグインは `dist/plugin.zip` に出力されます。

## 利用シーン

このサンプルプラグインは以下のような用途で参考になります:

- **新APIの動作確認**: 2026年3月リリースの新しいモバイルAPIの動作テスト
- **モバイルUI開発**: モバイル版プラグイン開発の学習
- **ユーザーフィードバック**: ボトムシートや通知を使ったUI/UX設計の検討
- **ローディング表示**: 非同期処理中のユーザーフィードバック実装の参考
- **API学習**: 新しいモバイルAPIの使用方法の学習

## 注意事項

- このプラグインはモバイル版専用です。PC版では動作しません。

## ライセンス

- 本プラグインは AGPL-3.0 ライセンスです。

**「kintone」はサイボウズ株式会社の登録商標です。**

ここに記載している内容は情報提供を目的としており、個別のサポートはできません。
設定内容についてのご質問やご自身の環境で動作しないといったお問い合わせをいただいても対応はできませんので、ご了承ください。
