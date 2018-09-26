// модуль вывода сообщений об успешной отправке на сервер или ошибке при отправке
'use strict';

(function () {
  var ESC_KEYCODE = 27;

  // блок из шаблона, на основе которого будут выведено сообщение об успешной отправке формы
  var templForm = document.querySelector('#success').content.querySelector('.success');
  // блок, куда будет вставлен блок об успешной отправке формы
  var elemForm = document.querySelector('main');
  // блок с сообщением об успешном отправлении формы
  var elemSuccess = document.querySelector('.success');
  // блок из шаблона, на основе которого будут выведено сообщение об ошибке при отправке формы
  var templFormErr = document.querySelector('#error').content.querySelector('.error');
  // блок с сообщением об успешном отправлении формы
  var elemError = document.querySelector('.error');

  function onShowMessageSuccesSendFormClose(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      var elemSucc = document.querySelector('.success');
      elemForm.removeChild(elemSucc);
      document.removeEventListener('keydown', onShowMessageSuccesSendFormClose);
    }
  }

  function onShowMessageErrorSendFormClose(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      var elemErr = document.querySelector('.error');
      elemForm.removeChild(elemErr);
      document.removeEventListener('keydown', onShowMessageErrorSendFormClose);
    }
  }

  window.message = {
    showMessageSuccessSendForm: function () {
      elemForm.appendChild(templForm);
      elemSuccess = document.querySelector('.success');

      elemSuccess.addEventListener('click', function () {
        elemForm.removeChild(elemSuccess);
      });

      document.addEventListener('keydown', onShowMessageSuccesSendFormClose);
    },
    showMessageErrorSendForm: function (errMess) {
      elemForm.appendChild(templFormErr);
      elemError = document.querySelector('.error');
      elemError.querySelector('.error__message').textContent = errMess;

      elemError.addEventListener('click', function () {
        elemForm.removeChild(elemError);
      });

      document.addEventListener('keydown', onShowMessageErrorSendFormClose);
    }
  };
})();
