// модуль вывода сообщений об успешной отправке на сервер или ошибке при отправке
'use strict';

(function () {
  // блок из шаблона, на основе которого будут выведено сообщение об успешной отправке формы
  var templFormElement = document.querySelector('#success').content.querySelector('.success');
  // блок, куда будет вставлен блок об успешной отправке формы
  var formElement = document.querySelector('main');
  // блок с сообщением об успешном отправлении формы
  var successElement = document.querySelector('.success');
  // блок из шаблона, на основе которого будут выведено сообщение об ошибке при отправке формы
  var templFormErrElement = document.querySelector('#error').content.querySelector('.error');
  // блок с сообщением о неуспешном отправлении формы
  var errorElement = document.querySelector('.error');

  var data = window.data;

  var closeShowMessageSuccess = function () {
    var succElement = document.querySelector('.success');
    if (succElement) {
      formElement.removeChild(succElement);
    }
    document.removeEventListener('keydown', onShowMessageSuccesSendFormClose);
  };

  var closeShowMessageError = function () {
    var errElement = document.querySelector('.error');
    if (errElement) {
      formElement.removeChild(errElement);
    }
    document.removeEventListener('keydown', onShowMessageErrorSendFormClose);
  };

  // обработчик на закрытие формы при успешном запросе GET/POST на сервер
  var onShowMessageSuccesSendFormClose = function (evt) {
    if (evt.keyCode === data.ESC_KEYCODE) {
      closeShowMessageSuccess();
    }
  };

  // обработчик на закрытие формы при неуспешном запросе GET/POST на сервер
  var onShowMessageErrorSendFormClose = function (evt) {
    if (evt.keyCode === data.ESC_KEYCODE) {
      closeShowMessageError();
    }
  };

  window.message = {
    showMessageSuccessSendForm: function () {
      formElement.appendChild(templFormElement);
      successElement = document.querySelector('.success');
      successElement.addEventListener('click', function () {
        closeShowMessageSuccess();
      });
      document.addEventListener('keydown', onShowMessageSuccesSendFormClose);
    },

    showMessageErrorSendForm: function (errMess) {
      formElement.appendChild(templFormErrElement);
      errorElement = document.querySelector('.error');
      errorElement.querySelector('.error__message').textContent = errMess;
      errorElement.addEventListener('click', function () {
        closeShowMessageError();
      });
      document.addEventListener('keydown', onShowMessageErrorSendFormClose);
    }
  };
})();
