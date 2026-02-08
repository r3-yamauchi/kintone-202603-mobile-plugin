# 2026年3月の kintone JavaScript API のモバイル版向け新機能(ボトムシート・メッセージ・ローディング)を試すサンプル

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/r3-yamauchi/kintone-202603-mobile-plugin)

これは 2026年3月8日にリリースされた kintone JavaScript API (モバイル版用) の動作確認を行えるサンプルプラグインです。
ボトムシート、確認ボトムシート、通知メッセージ、ローディング表示の4つの新APIをテストできます。

アップデート情報: https://jp.kintone.help/k/ja/update/main/2026-03 https://cybozu.dev/ja/kintone/news/api-updates/2026-03/

## 主な機能

- モバイル版レコード一覧画面にテストボタンを表示
- テキストエリアでカスタムメッセージを入力可能
- 4つのモバイルAPI用の動作確認ボタン:
  - **ボトムシート表示** ([kintone.mobile.createBottomSheet](https://cybozu.dev/ja/kintone/docs/js-api/kintone/create-bottomsheet/))
  - **確認ボトムシート表示** ([kintone.mobile.showConfirmBottomSheet](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-confirm-bottomsheet/))
  - **通知メッセージ表示** ([kintone.mobile.showNotification](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-notification/))
  - **ローディング表示** ([kintone.mobile.showLoading](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-loading/))

## 使用方法

1. プラグインをビルドしてインストールします
2. 対象アプリにプラグインを適用します
3. モバイル端末またはモバイル表示モードでkintoneアプリを開きます
4. レコード一覧画面の上部にテストUIが表示されます
5. テキストエリアにテスト用のメッセージを入力します（空欄の場合はデフォルトメッセージが使用されます）
6. 各ボタンをタップして、対応するモバイルAPIの動作を確認できます

### 各ボタンの動作

- **ボトムシートを表示**: [kintone.mobile.createBottomSheet(config)](https://cybozu.dev/ja/kintone/docs/js-api/kintone/create-bottomsheet/) を使って `title` と `body(Element)` を渡し、`show()` の結果文字列を表示します
- **確認ボトムシート（キャンセルあり）**: `showCancelButton: true` で表示し、戻り値（`OK`/`CANCEL`/`CLOSE`/`FUNCTION`）に応じた結果を表示します
- **確認ボトムシート（キャンセルなし）**: `showCancelButton: false` で表示し、戻り値（`OK`/`CLOSE`/`FUNCTION` など）に応じた結果を表示します
- **通知メッセージを表示**: [kintone.mobile.showNotification(type, message)](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-notification/) で `SUCCESS`/`INFO`/`ERROR` の3種類を順番に表示します
- **ローディングを表示**: [kintone.mobile.showLoading('VISIBLE')](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-loading/) で表示し、3秒後に [kintone.mobile.showLoading('HIDDEN')](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-loading/) で非表示にします

## 対応画面

- モバイル版レコード一覧画面（`mobile.app.record.index.show`）

## API リファレンス

このプラグインで使用している kintone JavaScript API（モバイル版）:

- [kintone.mobile.createBottomSheet()](https://cybozu.dev/ja/kintone/docs/js-api/kintone/create-bottomsheet/) - ボトムシートを作成
- [kintone.mobile.showConfirmBottomSheet()](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-confirm-bottomsheet/) - 確認ボトムシートを表示
- [kintone.mobile.showNotification()](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-notification/) - 通知メッセージを表示
- [kintone.mobile.showLoading()](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-loading/) - ローディングを表示

このプラグインで使用している kintone JavaScript API（PC版）:

- [kintone.createDialog()](https://cybozu.dev/ja/kintone/docs/js-api/kintone/create-dialog/) - ダイアログを作成
- [kintone.showConfirmDialog()](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-confirm-dialog/) - 確認ダイアログを表示
- [kintone.showNotification()](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-notification/) - 通知メッセージを表示
- [kintone.showLoading()](https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-loading/) - ローディングを表示

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

- **新APIの動作確認**: 2026年3月アップデートの新しいモバイルAPIの動作テスト
- **モバイルUI開発**: モバイル版プラグイン開発の学習
- **ユーザーフィードバック**: ボトムシートや通知を使ったUI/UX設計の検討
- **ローディング表示**: 非同期処理中のユーザーフィードバック実装の参考
- **API学習**: 新しいモバイルAPIの使用方法の学習

## ライセンス

- 本プラグインは AGPL-3.0 ライセンスです。

**「kintone」はサイボウズ株式会社の登録商標です。**

ここに記載している内容は情報提供を目的としており、個別のサポートはできません。
設定内容についてのご質問やご自身の環境で動作しないといったお問い合わせをいただいても対応はできませんので、ご了承ください。
