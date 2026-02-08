(function (PLUGIN_ID) {
  'use strict';

  /**
   * where: src/js/desktop.js
   * what: kintone PC版APIの動作確認UIと実行ハンドラ
   * why: モバイル版と同等の観点でPC版APIを試せるようにするため
   */
  const CONFIRM_RESULT = {
    OK: 'OK',
    CANCEL: 'CANCEL',
    CLOSE: 'CLOSE',
    FUNCTION: 'FUNCTION'
  };
  const NOTIFICATION_TYPE = 'INFO';
  const SUCCESS_NOTIFICATION_TYPE = 'SUCCESS';
  const ERROR_NOTIFICATION_TYPE = 'ERROR';
  const LOADING_WAIT_MS = 3000;
  const MOBILE_TRANSITION_BUTTON_ID = 'mobile-transition-button';

  function convertToMobileUrl(currentUrl) {
    return currentUrl.replace(/\/k\/(\d+)\//, '/k/m/$1/');
  }

  function createMobileTransitionButton() {
    const button = document.createElement('button');
    button.id = MOBILE_TRANSITION_BUTTON_ID;
    button.textContent = 'モバイル版へ移動';
    button.style.cssText = [
      'padding: 8px 16px',
      'background-color: #ffd700',
      'color: black',
      'border: none',
      'border-radius: 4px',
      'cursor: pointer',
      'font-size: 14px',
      'font-weight: bold',
      'margin: 10px',
      'transition: background-color 0.3s ease'
    ].join(';');
    button.addEventListener('mouseenter', function () {
      button.style.backgroundColor = '#f0c000';
    });
    button.addEventListener('mouseleave', function () {
      button.style.backgroundColor = '#ffd700';
    });
    button.addEventListener('click', function () {
      if (typeof window === 'undefined' || !window.location) {
        return;
      }
      window.location.href = convertToMobileUrl(window.location.href);
    });
    return button;
  }

  async function notify(type, message) {
    try {
      await kintone.showNotification(type, message);
    } catch (error) {
      console.error('showNotification の表示でエラーが発生しました:', error);
    }
  }

  function createTextArea() {
    const textArea = document.createElement('textarea');
    textArea.id = 'desktop-api-test-textarea';
    textArea.placeholder = 'テスト用のメッセージを入力してください';
    textArea.rows = 3;
    textArea.style.cssText = [
      'width: 100%',
      'padding: 8px',
      'border: 1px solid #ccc',
      'border-radius: 4px',
      'font-size: 14px',
      'resize: vertical',
      'box-sizing: border-box'
    ].join(';');
    return textArea;
  }

  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = [
      'padding: 12px 16px',
      'background-color: #1f7acc',
      'color: white',
      'border: none',
      'border-radius: 4px',
      'font-size: 14px',
      'font-weight: bold',
      'cursor: pointer',
      'transition: background-color 0.3s'
    ].join(';');

    button.addEventListener('click', function () {
      Promise.resolve(onClick()).catch(function (error) {
        console.error('ボタン処理でエラーが発生しました:', error);
        notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
      });
    });
    button.addEventListener('mouseenter', function () {
      this.style.backgroundColor = '#1866ac';
    });
    button.addEventListener('mouseleave', function () {
      this.style.backgroundColor = '#1f7acc';
    });
    return button;
  }

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

  async function notifyConfirmResult(result) {
    if (result === CONFIRM_RESULT.OK) {
      await notify(SUCCESS_NOTIFICATION_TYPE, '「はい」が選択されました');
      return;
    }
    if (result === CONFIRM_RESULT.CANCEL) {
      await notify(NOTIFICATION_TYPE, '「いいえ」が選択されました');
      return;
    }
    if (result === CONFIRM_RESULT.CLOSE) {
      await notify(NOTIFICATION_TYPE, '閉じる操作が選択されました');
      return;
    }
    if (result === CONFIRM_RESULT.FUNCTION) {
      await notify(NOTIFICATION_TYPE, 'プログラムから閉じられました');
      return;
    }
    await notify(ERROR_NOTIFICATION_TYPE, '不明な結果: ' + result);
  }

  async function testCreateDialog(message) {
    try {
      const content = document.createElement('div');
      content.style.cssText = 'padding: 20px;';
      const title = document.createElement('h2');
      title.textContent = 'ダイアログのテスト';
      title.style.cssText = 'margin: 0 0 16px 0; font-size: 18px;';
      const description = document.createElement('p');
      description.textContent = message;
      description.style.cssText = 'margin: 0 0 16px 0; color: #666;';
      const closeButton = document.createElement('button');
      closeButton.textContent = '閉じる';
      closeButton.style.cssText = [
        'padding: 10px 20px',
        'background-color: #e74c3c',
        'color: white',
        'border: none',
        'border-radius: 4px',
        'font-size: 14px',
        'cursor: pointer'
      ].join(';');

      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(closeButton);

      const dialog = await kintone.createDialog({
        title: 'ダイアログのテスト',
        body: content,
        showOkButton: true,
        okButtonText: 'OK',
        showCancelButton: false,
        showCloseButton: true
      });
      closeButton.addEventListener('click', function () {
        dialog.close();
      });
      const result = await dialog.show();
      await notify(SUCCESS_NOTIFICATION_TYPE, 'ダイアログ結果: ' + result);
    } catch (error) {
      await notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
    }
  }

  async function testShowConfirmDialog(message, withCancelButton) {
    try {
      const result = await kintone.showConfirmDialog(
        buildConfirmConfig(message, withCancelButton)
      );
      await notifyConfirmResult(result);
    } catch (error) {
      await notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
    }
  }

  async function testShowNotification(message) {
    try {
      await kintone.showNotification(SUCCESS_NOTIFICATION_TYPE, '[SUCCESS] ' + message);
      await kintone.showNotification(NOTIFICATION_TYPE, '[INFO] ' + message);
      await kintone.showNotification(ERROR_NOTIFICATION_TYPE, '[ERROR] ' + message);
    } catch (error) {
      await notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
    }
  }

  async function testShowLoading() {
    try {
      await kintone.showLoading('VISIBLE');
      await new Promise(function (resolve) {
        setTimeout(resolve, LOADING_WAIT_MS);
      });
      await kintone.showLoading('HIDDEN');
      await notify(SUCCESS_NOTIFICATION_TYPE, 'ローディング表示のテストが完了しました');
    } catch (error) {
      await notify(ERROR_NOTIFICATION_TYPE, 'エラー: ' + error.message);
    }
  }

  function createButtonContainer() {
    const container = document.createElement('div');
    container.id = 'desktop-api-test-buttons';
    container.style.cssText = [
      'padding: 16px',
      'background-color: #f8f8f8',
      'border: 1px solid #e0e0e0',
      'border-radius: 4px',
      'display: flex',
      'flex-direction: column',
      'gap: 12px',
      'max-width: 640px'
    ].join(';');

    const textArea = createTextArea();
    container.appendChild(textArea);

    const button1 = createButton('ダイアログを表示', function () {
      const message = textArea.value || 'デフォルトメッセージ';
      return testCreateDialog(message);
    });
    const button2 = createButton('確認ダイアログ（キャンセルあり）', function () {
      const message = textArea.value || 'この操作を実行してもよろしいですか？';
      return testShowConfirmDialog(message, true);
    });
    const button3 = createButton('確認ダイアログ（キャンセルなし）', function () {
      const message = textArea.value || 'この操作を実行してもよろしいですか？';
      return testShowConfirmDialog(message, false);
    });
    const button4 = createButton('通知メッセージを表示', function () {
      const message = textArea.value || 'これは通知メッセージのテストです';
      return testShowNotification(message);
    });
    const button5 = createButton('ローディングを表示', function () {
      return testShowLoading();
    });

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    container.appendChild(button4);
    container.appendChild(button5);
    return container;
  }

  kintone.events.on('app.record.index.show', function (event) {
    const existingContainer = document.getElementById('desktop-api-test-buttons');
    if (existingContainer) {
      existingContainer.remove();
    }
    const existingMobileButton = document.getElementById(MOBILE_TRANSITION_BUTTON_ID);
    if (existingMobileButton) {
      existingMobileButton.remove();
    }

    const headerElement = kintone.app.getHeaderSpaceElement();
    if (headerElement) {
      headerElement.appendChild(createButtonContainer());
    }
    if (kintone.app.getHeaderMenuSpaceElement) {
      const headerMenuElement = kintone.app.getHeaderMenuSpaceElement();
      if (headerMenuElement) {
        headerMenuElement.appendChild(createMobileTransitionButton());
      }
    }
    return event;
  });
})(kintone.$PLUGIN_ID);
