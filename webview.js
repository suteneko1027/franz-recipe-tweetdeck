'use strict';

const { ipcRenderer } = require('electron');

// Tweetdeck redirect fix
ipcRenderer.on('redirect-url', (event, url) => {
  window.location.assign(url);
});

module.exports = Franz => {
  const getSettings = function (key) {
    const columnStorages = window.TD.storage.columnController.getAll();
    for (let i = 0; i < columnStorages.length; ++i) {
      const columnStorage = columnStorages[i];
      if (key == columnStorage.privateState.key) {
        return columnStorage.state.settings;
      }
    }
    return null;
  };

  const getMessages = function getMessages() {
    const columns = document.querySelectorAll(".column");

    let count = 0;
    for (let i = 0; i < columns.length; ++i) {
      const column = columns[i];
      const columnKey = column.getAttribute("data-column");
      const columnData = window.TD.controller.columnManager.get(columnKey);
      const settings = getSettings(columnKey);

      if (settings.has_notification) {
        const columnScroller = column.querySelector(".js-column-scroller");
        const scrollTop = columnScroller.scrollTop;
        if (scrollTop == 0) {
          columnScroller.scrollTop = 1;
        } else {
          if (column.classList.contains("is-new")) {
            if (!columnData || !columnData.numNewPushedChirps) {
              count += 1;
            } else {
              count += columnData.numNewPushedChirps;
            }
          }
        }
      }
    }
    Franz.setBadge(count);
  };
  Franz.loop(getMessages);
};
