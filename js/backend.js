'use strict';

(function () {
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var STATUS_SUCCESS = 200;
  var TIMEOUT_QUERY = 10000;

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = xhrCreate(onLoad, onError);
      xhr.open('GET', URL_GET);
      xhr.send();

    },
    save: function (data, onLoad, onError) {
      var xhr = xhrCreate(onLoad, onError);
      xhr.open('POST', URL_POST);
      xhr.send(data);

    }
  };
  var xhrCreate = function (onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_QUERY; // 10s
    return xhr;

  };
})();
