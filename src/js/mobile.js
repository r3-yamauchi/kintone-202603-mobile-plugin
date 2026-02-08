(function (PLUGIN_ID) {
  'use strict';

  /**
   * where: src/js/mobile.js
   * what: kintoneモバイル新APIの動作確認UIと実行ハンドラ
   * why: API仕様変更に追従し、引数・戻り値の契約違反を防ぐため
   */
  const CONFIRM_RESULT = {
    OK: 'OK',
    CANCEL: 'CANCEL',
    CLOSE: 'CLOSE',
    FUNCTION: 'FUNCTION'
  };
  const NOTIFICATION_TYPE = 'INFO';
  const ERROR_NOTIFICATION_TYPE = 'ERROR';
  const SUCCESS_NOTIFICATION_TYPE = 'SUCCESS';
  const LOADING_WAIT_MS = 3000;

  /**
   * 通知メッセージを表示
   */
  async function notify(type, message) {
    try {
      await kintone.mobile.showNotification(type, message);
    } catch (error) {
      console.error('showNotification の表示でエラーが発生しました:', error);
    }
  }

  /**
   * テキストエリアを作成
   */
  function createTextArea() {
    const textArea = document.createElement('textarea');
    textArea.id = 'mobile-api-test-textarea';
    textArea.placeholder = 'テスト用のメッセージを入力してください';
    textArea.rows = 3;
    textArea.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
    `;
    return textArea;
  }

  /**
   * ボタンコンテナを作成
   */
  function createButtonContainer() {
    const container = document.createElement('div');
    container.id = 'mobile-api-test-buttons';
    container.style.cssText = `
      padding: 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    // テキストエリアを作成
    const textArea = createTextArea();
    container.appendChild(textArea);

    // ボタン1: ボトムシートを表示
    const button1 = createButton('ボトムシートを表示', function () {
      const message = textArea.value || 'デフォルトメッセージ';
      testCreateBottomSheet(message);
    });

    // ボタン2: 確認ボトムシート（キャンセルあり）を表示
    const button2 = createButton('確認ボトムシート（キャンセルあり）', function () {
      const message = textArea.value || 'この操作を実行してもよろしいですか？';
      testShowConfirmBottomSheet(message, true);
    });

    // ボタン3: 確認ボトムシート（キャンセルなし）を表示
    const button3 = createButton('確認ボトムシート（キャンセルなし）', function () {
      const message = textArea.value || 'この操作を実行してもよろしいですか？';
      testShowConfirmBottomSheet(message, false);
    });

    // ボタン4: 通知メッセージを表示
    const button4 = createButton('通知メッセージを表示', function () {
      const message = textArea.value || 'これは通知メッセージのテストです';
      testShowNotification(message);
    });

    // ボタン5: ローディングを表示
    const button5 = createButton('ローディングを表示', function () {
      testShowLoading();
    });

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    container.appendChild(button4);
    container.appendChild(button5);

    return container;
  }

  /**
   * ボタン要素を作成
   */
  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      padding: 12px 16px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
    `;

    button.addEventListener('click', function () {
      // 非同期ハンドラのrejectを取りこぼさないため、Promiseとして吸収する
      Promise.resolve(onClick()).catch(function (error) {
        console.error('ボタン処理でエラーが発生しました:', error);
        notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
      });
    });

    // タップ時の視覚フィードバック
    button.addEventListener('touchstart', function () {
      this.style.backgroundColor = '#2980b9';
    });

    button.addEventListener('touchend', function () {
      this.style.backgroundColor = '#3498db';
    });

    return button;
  }

  /**
   * テスト1: ボトムシートを表示
   */
  async function testCreateBottomSheet(message) {
    try {
      console.log('createBottomSheet を呼び出します');

      // ボトムシートのコンテンツを作成
      const content = document.createElement('div');
      content.style.cssText = 'padding: 20px;';

      const title = document.createElement('h2');
      title.textContent = 'ボトムシートのテスト';
      title.style.cssText = 'margin: 0 0 16px 0; font-size: 18px;';

      const description = document.createElement('p');
      description.textContent = message;
      description.style.cssText = 'margin: 0 0 16px 0; color: #666;';

      const closeButton = document.createElement('button');
      closeButton.textContent = '閉じる';
      closeButton.style.cssText = `
        padding: 10px 20px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
      `;

      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(closeButton);

      // createBottomSheet は Promise でコントローラを返す
      const bottomSheet = await kintone.mobile.createBottomSheet({
        title: 'ボトムシートのテスト',
        body: content,
        showOkButton: true,
        okButtonText: 'OK',
        showCancelButton: false,
        showCloseButton: true
      });

      // 閉じるボタンのイベント
      closeButton.addEventListener('click', function () {
        bottomSheet.close();
      });

      // show() は閉じた理由を文字列で返す
      const result = await bottomSheet.show();
      await notify(SUCCESS_NOTIFICATION_TYPE, 'ボトムシート結果: ' + result);

      console.log('createBottomSheet の呼び出しに成功しました');
    } catch (error) {
      console.error('createBottomSheet でエラーが発生しました:', error);
      await notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
    }
  }

  /**
   * showConfirmBottomSheet 用設定を作成
   */
  function buildConfirmConfig(message, withCancelButton) {
    const config = {
      title: withCancelButton ? '確認（キャンセルあり）' : '確認（キャンセルなし）',
      body: message,
      showOkButton: true,
      okButtonText: 'はい',
      showCloseButton: true,
      showCancelButton: withCancelButton
    };
    if (withCancelButton) {
      config.cancelButtonText = 'いいえ';
    }
    return config;
  }

  /**
   * 確認ボトムシートの結果を通知
   */
  async function notifyConfirmResult(result) {
    if (result === CONFIRM_RESULT.OK) {
      console.log('ユーザーが「はい」を選択しました');
      await notify(SUCCESS_NOTIFICATION_TYPE, '「はい」が選択されました');
    } else if (result === CONFIRM_RESULT.CANCEL) {
      console.log('ユーザーが「いいえ」を選択しました');
      await notify(NOTIFICATION_TYPE, '「いいえ」が選択されました');
    } else if (result === CONFIRM_RESULT.CLOSE) {
      console.log('ユーザーが閉じる操作を選択しました');
      await notify(NOTIFICATION_TYPE, '閉じる操作が選択されました');
    } else if (result === CONFIRM_RESULT.FUNCTION) {
      console.log('プログラムからボトムシートが閉じられました');
      await notify(NOTIFICATION_TYPE, 'プログラムから閉じられました');
    } else {
      console.warn('未定義の結果を受け取りました:', result);
      await notify(ERROR_NOTIFICATION_TYPE, '不明な結果: ' + result);
    }
  }

  /**
   * テスト2: 確認ボトムシートを表示
   */
  async function testShowConfirmBottomSheet(message, withCancelButton) {
    try {
      console.log('showConfirmBottomSheet を呼び出します');

      const result = await kintone.mobile.showConfirmBottomSheet(
        buildConfirmConfig(message, withCancelButton)
      );
      await notifyConfirmResult(result);

      console.log('showConfirmBottomSheet の呼び出しに成功しました');
    } catch (error) {
      console.error('showConfirmBottomSheet でエラーが発生しました:', error);
      await notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
    }
  }

  /**
   * テスト3: 通知メッセージを表示
   */
  async function testShowNotification(message) {
    try {
      // https://cybozu.dev/ja/kintone/docs/js-api/kintone/show-notification/
      // メッセージは画面上部に表示された後、自動的に消えません。
      // メッセージは、kintone本体のものも含め、同時に1つしか表示できず、一番最後に呼び出したものだけが表示されます。
      console.log('showNotification を呼び出します');
      await kintone.mobile.showNotification(SUCCESS_NOTIFICATION_TYPE, '[SUCCESS] ' + message);
      await kintone.mobile.showNotification(ERROR_NOTIFICATION_TYPE, '[ERROR] ' + message);
      await kintone.mobile.showNotification(NOTIFICATION_TYPE, '[INFO] ' + message);

      console.log('showNotification の呼び出しに成功しました');
    } catch (error) {
      console.error('showNotification でエラーが発生しました:', error);
      await notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
    }
  }

  /**
   * テスト4: ローディングを表示
   */
  async function testShowLoading() {
    try {
      console.log('showLoading を呼び出します');

      // ローディングUIを表示
      await kintone.mobile.showLoading('VISIBLE');

      console.log('showLoading の呼び出しに成功しました');

      // 長時間処理を模した待機後にローディングを閉じる
      await new Promise(function (resolve) {
        setTimeout(resolve, LOADING_WAIT_MS);
      });
      await kintone.mobile.showLoading('HIDDEN');
      console.log('ローディングを閉じました');
      await notify(SUCCESS_NOTIFICATION_TYPE, 'ローディング表示のテストが完了しました');

    } catch (error) {
      console.error('showLoading でエラーが発生しました:', error);
      await notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
    }
  }

  /**
   * レコード一覧画面のイベントハンドラー
   */
  kintone.events.on('mobile.app.record.index.show', function (event) {
    console.log('モバイル版レコード一覧画面が表示されました');

    // 既存のボタンコンテナを削除（重複防止）
    const existingContainer = document.getElementById('mobile-api-test-buttons');
    if (existingContainer) {
      existingContainer.remove();
    }

    // ボタンコンテナを作成
    const buttonContainer = createButtonContainer();

    // レコード一覧の上部に挿入
    const indexElement = kintone.mobile.app.getHeaderSpaceElement();
    if (indexElement) {
      indexElement.appendChild(buttonContainer);
    } else {
      console.warn('ヘッダースペースが見つかりませんでした');
    }

    return event;
  });

})(kintone.$PLUGIN_ID);
