(function (PLUGIN_ID) {
  'use strict';

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

    // ボタン2: 確認ボトムシートを表示
    const button2 = createButton('確認ボトムシートを表示', function () {
      const message = textArea.value || 'この操作を実行してもよろしいですか？';
      testShowConfirmBottomSheet(message);
    });

    // ボタン3: 通知メッセージを表示
    const button3 = createButton('通知メッセージを表示', function () {
      const message = textArea.value || 'これは通知メッセージのテストです';
      testShowNotification(message);
    });

    // ボタン4: ローディングを表示
    const button4 = createButton('ローディングを表示', function () {
      testShowLoading();
    });

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    container.appendChild(button4);

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

    button.addEventListener('click', onClick);

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
  function testCreateBottomSheet(message) {
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

      // ボトムシートを作成
      const bottomSheet = kintone.mobile.createBottomSheet({
        content: content
      });

      // 閉じるボタンのイベント
      closeButton.addEventListener('click', function () {
        bottomSheet.close();
      });

      // ボトムシートを開く
      bottomSheet.open();

      console.log('createBottomSheet の呼び出しに成功しました');
    } catch (error) {
      console.error('createBottomSheet でエラーが発生しました:', error);
      alert('エラー: ' + error.message);
    }
  }

  /**
   * テスト2: 確認ボトムシートを表示
   */
  function testShowConfirmBottomSheet(message) {
    try {
      console.log('showConfirmBottomSheet を呼び出します');

      kintone.mobile.showConfirmBottomSheet({
        title: '確認',
        body: message,
        showOkButton: true,
        showCancelButton: true,
        okButtonText: 'はい',
        cancelButtonText: 'いいえ',
        showCloseButton: true
      }
      ).then(function (result) {
        if (result) {
          console.log('ユーザーが「はい」を選択しました');
          alert('「はい」が選択されました');
        } else {
          console.log('ユーザーが「いいえ」を選択しました');
          alert('「いいえ」が選択されました');
        }
      });

      console.log('showConfirmBottomSheet の呼び出しに成功しました');
    } catch (error) {
      console.error('showConfirmBottomSheet でエラーが発生しました:', error);
      alert('エラー: ' + error.message);
    }
  }

  /**
   * テスト3: 通知メッセージを表示
   */
  function testShowNotification(message) {
    try {
      console.log('showNotification を呼び出します');

      kintone.mobile.showNotification({
        message: message,
        type: 'INFO', // ERROR, SUCCESS, INFO
      });

      console.log('showNotification の呼び出しに成功しました');
    } catch (error) {
      console.error('showNotification でエラーが発生しました:', error);
      alert('エラー: ' + error.message);
    }
  }

  /**
   * テスト4: ローディングを表示
   */
  function testShowLoading() {
    try {
      console.log('showLoading を呼び出します');

      // ローディングUIを表示
      kintone.mobile.showLoading('VISIBLE');

      console.log('showLoading の呼び出しに成功しました');

      // 長時間の処理を実行
      setTimeout(() => {
        // ローディングUIを非表示
        kintone.mobile.showLoading('HIDDEN');
        console.log('ローディングを閉じました');
        alert('ローディング表示のテストが完了しました');
      }, 3000);

    } catch (error) {
      console.error('showLoading でエラーが発生しました:', error);
      alert('エラー: ' + error.message);
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
