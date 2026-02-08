(function(PLUGIN_ID) {
  'use strict';

  /**
   * モバイル版URLへ変換する関数
   * @param {string} currentUrl - 現在のURL
   * @return {string} モバイル版のURL
   */
  function convertToMobileUrl(currentUrl) {
    // PC版のURLパターン: https://xxx.cybozu.com/k/{appId}/
    // モバイル版のURLパターン: https://xxx.cybozu.com/k/m/{appId}/
    return currentUrl.replace(/\/k\/(\d+)\//, '/k/m/$1/');
  }

  /**
   * モバイル版へ遷移ボタンを作成する関数
   * @return {HTMLElement} ボタン要素
   */
  function createMobileTransitionButton() {
    const button = document.createElement('button');
    button.id = 'mobile-transition-button';
    button.textContent = 'モバイル版へ移動';
    button.style.cssText = `
      padding: 8px 16px;
      background-color: #ffd700;
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      margin: 10px;
      transition: background-color 0.3s ease;
    `;

    // ホバー効果
    button.addEventListener('mouseenter', function() {
      button.style.backgroundColor = '#f0c000';
    });

    button.addEventListener('mouseleave', function() {
      button.style.backgroundColor = '#ffd700';
    });

    // クリックイベント
    button.addEventListener('click', function() {
      const currentUrl = window.location.href;
      const mobileUrl = convertToMobileUrl(currentUrl);

      // モバイル版URLへ遷移
      window.location.href = mobileUrl;
    });

    return button;
  }

  /**
   * レコード一覧画面表示時のイベントハンドラー
   */
  kintone.events.on('app.record.index.show', function(event) {
    // 既存のボタンを削除（重複防止）
    const existingButton = document.getElementById('mobile-transition-button');
    if (existingButton) {
      existingButton.remove();
    }

    // ヘッダーメニュースペースを取得（画面右上）
    const headerMenuSpace = kintone.app.getHeaderMenuSpaceElement();

    if (headerMenuSpace) {
      // ボタンを作成してヘッダーメニュースペースに追加
      const button = createMobileTransitionButton();
      headerMenuSpace.appendChild(button);
    }

    return event;
  });

})(kintone.$PLUGIN_ID);
