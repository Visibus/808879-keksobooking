// модуль работы с формой объявления
'use strict';

(function () {

  // объект соответствия типа жилья и минимальной стоимости за ночь
  var typeHousingMinPrice = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };

  var data = window.data;
  var map = window.map;
  var units = window.units;
  var backend = window.backend;
  var message = window.message;
  // DOM-объект с формой заполнения объявления
  var adFormElement = document.querySelector('.ad-form');
  // кнопка "очистить"
  var adFormResetElement = document.querySelector('.ad-form__reset');
  // тип жилья
  var advertizeTypeElement = document.querySelector('#type');
  // стоимость
  var advertizePriceElement = document.querySelector('#price');
  // время заезда
  var advertizeTimeInElement = document.querySelector('#timein');
  // время выезда
  var advertizeTimeOutElement = document.querySelector('#timeout');
  // количество комнат
  var advertizeRoomNumberElement = document.querySelector('#room_number');
  // количество мест
  var advertizeCapacityElement = document.querySelector('#capacity');

  var advertizeWifiElement = document.querySelector('#feature-wifi');
  var advertizeDishwasherElement = document.querySelector('#feature-dishwasher');
  var advertizeParkingElement = document.querySelector('#feature-parking');
  var advertizeWasherElement = document.querySelector('#feature-washer');
  var advertizeElevatorElement = document.querySelector('#feature-elevator');
  var advertizeConditionerElement = document.querySelector('#feature-conditioner');

  // ф-ция callback, выполняемая при успешной загрузке формы на сервер
  var onSuccessSaveData = function () {
    // сообщение, что форма отправлена успешно
    message.showMessageSuccessSendForm();
    // делаем форму неактивной
    map.initForm();
  };

  // ф-ция callback, выполняемая при неуспешной загрузке формы на сервер
  var onErrorSaveData = function (errorMessage) {
    message.showMessageErrorSendForm(errorMessage);
  };

  // обработчик при изменении типа жилья
  var onAdvertizeInputTypeChange = function (evt) {
    advertizePriceElement.setAttribute('min', typeHousingMinPrice[evt.currentTarget.value]);
    advertizePriceElement.setAttribute('placeholder', typeHousingMinPrice[evt.currentTarget.value]);
  };

  // обработчик ошибок поля "стоимость жилья"
  var onAdvertizePriceInput = function (evt) {
    if (advertizePriceElement.validity.rangeUnderflow) {
      advertizePriceElement.setCustomValidity('Введенное значение меньше минимально допустимого : ' + evt.target.min);
    } else if (advertizePriceElement.validity.rangeOverflow) {
      advertizePriceElement.setCustomValidity('Введенное значение больше максимально допустимого : ' + evt.target.max);
    } else if (advertizePriceElement.validity.valueMissing) {
      advertizePriceElement.setCustomValidity('Обязательное поле');
    } else {
      advertizePriceElement.setCustomValidity('');
    }
  };

    // ф-ция синхронизации значений в полях "время заезда" и "время выезда"
  var synchronizeTimeInOut = function (elemTime, valTime) {
    for (var indTime = 0; indTime < elemTime.length; indTime++) {
      elemTime[indTime].selected = parseInt(elemTime[indTime].value, 10) === valTime ? true : false;
    }
  };

  // обработчик при изменении полей "время заезда" и "время выезда"
  var onAdvertizeTimeInOutChange = function (evt) {
    var timeInOut = parseInt(evt.currentTarget.value, 10);
    if (evt.currentTarget.name === 'timein') {
      synchronizeTimeInOut(advertizeTimeOutElement, timeInOut);
    }
    if (evt.currentTarget.name === 'timeout') {
      synchronizeTimeInOut(advertizeTimeInElement, timeInOut);
    }
  };

  // обработчик по изменению поля "кол-во комнат" -
  var onAdvertizeRoomNumberChange = function () {
    units.setRelationNumberRoomsCapacity();
  };

  // обработчик ошибок ввода в полях "кол-во мест" и "кол-во комнат"
  var onAdvertizeRoomNumberInput = function () {
    // объект соответствия поля "кол-во мест" полю "кол-во комнат"
    var capacityRoomNumber = {
      '0': ['100'], // не для гостей - 100 комнат
      '1': ['1', '2', '3'], // для 1 гостя возможно 1,2,3 комнаты
      '2': ['2', '3'], // для 2 гостей 2 или 3 комнаты
      '3': ['3'] // для 3 гостей 3 комнаты
    };

    // в массиве варианты комнат, которые доступны для введенного значения в поле "количество мест"
    var selectCapacity = capacityRoomNumber[advertizeCapacityElement.value];
    // признак валидности поля "кол-во комнат"
    var selectCapacityCorrect = !!~selectCapacity.indexOf(advertizeRoomNumberElement.value);

    if (!selectCapacityCorrect) {
      advertizeCapacityElement.setCustomValidity('Данное значение недопустимо. Выберите из списка корректное значение');
    } else {
      advertizeCapacityElement.setCustomValidity('');
    }
  };

  // обработчик изменения значения в поле checkbox в форме фильтрации меток объявлений по нажатию ENTER
  var onAdvertizeCheckBoxKeyDown = function (evt) {
    if (evt.keyCode === data.ENTER_KEYCODE) {
      if (evt.currentTarget.checked) {
        evt.currentTarget.checked = false;
      } else {
        evt.currentTarget.checked = true;
      }
      evt.preventDefault();
    }
  };

  advertizeTypeElement.addEventListener('change', onAdvertizeInputTypeChange);
  advertizeTimeInElement.addEventListener('change', onAdvertizeTimeInOutChange);
  advertizeTimeOutElement.addEventListener('change', onAdvertizeTimeInOutChange);
  advertizeRoomNumberElement.addEventListener('change', onAdvertizeRoomNumberChange);
  advertizeRoomNumberElement.addEventListener('input', onAdvertizeRoomNumberInput);
  advertizePriceElement.addEventListener('input', onAdvertizePriceInput);
  advertizeCapacityElement.addEventListener('input', onAdvertizeRoomNumberInput);

  advertizeWifiElement.addEventListener('keydown', onAdvertizeCheckBoxKeyDown);
  advertizeDishwasherElement.addEventListener('keydown', onAdvertizeCheckBoxKeyDown);
  advertizeParkingElement.addEventListener('keydown', onAdvertizeCheckBoxKeyDown);
  advertizeWasherElement.addEventListener('keydown', onAdvertizeCheckBoxKeyDown);
  advertizeElevatorElement.addEventListener('keydown', onAdvertizeCheckBoxKeyDown);
  advertizeConditionerElement.addEventListener('keydown', onAdvertizeCheckBoxKeyDown);

  // событие на нажатие кнопки "очистить"
  adFormResetElement.addEventListener('click', function (evt) {
    map.initForm();
    evt.preventDefault();
  });

  // событие на отправку формы
  adFormElement.addEventListener('submit', function (evt) {
    // вывод сообщения об успешной отправке формы
    backend.save(new FormData(adFormElement), onSuccessSaveData, onErrorSaveData);
    evt.preventDefault();
  });

})();
