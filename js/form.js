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

  // экспорт ф-ции ininForm из модуля map.js
  var map = window.map;
  // экспорт ф-ции relationNumberRoomsCapacity из модуля units.js
  var units = window.units;
  // экспорт из модуля backend.js
  var backend = window.backend;
  // DOM-объект с формой заполнения объявления
  var message = window.message;
  var adForm = document.querySelector('.ad-form');
  // кнопка "очистить"
  var adFormReset = document.querySelector('.ad-form__reset');
  // тип жилья
  var advertizeType = document.querySelector('#type');
  // стоимость
  var advertizePrice = document.querySelector('#price');
  // время заезда
  var advertizeTimeIn = document.querySelector('#timein');
  // время выезда
  var advertizeTimeOut = document.querySelector('#timeout');
  // количество комнат
  var advertizeRoomNumber = document.querySelector('#room_number');
  // количество мест
  var advertizeCapacity = document.querySelector('#capacity');

  advertizeType.addEventListener('change', onAdvertizeInputTypeChange);
  advertizeTimeIn.addEventListener('change', onAdvertizeTimeInOutChange);
  advertizeTimeOut.addEventListener('change', onAdvertizeTimeInOutChange);
  advertizeRoomNumber.addEventListener('change', onAdvertizeRoomNumberChange);
  advertizeRoomNumber.addEventListener('input', onAdvertizeRoomNumberInput);
  advertizePrice.addEventListener('input', onAdvertizePriceInput);
  advertizeCapacity.addEventListener('input', onAdvertizeRoomNumberInput);

  // событие на нажатие кнопки "очистить"
  adFormReset.addEventListener('click', function (evt) {
    map.initForm();
    evt.preventDefault();
  });

  // событие на отправку формы
  adForm.addEventListener('submit', function (evt) {
    // вывод сообщения об успешной отправке формы
  //  showMessage(elemForm, elemSuccess, templForm, '.success');
    // debugger;
    backend.save(new FormData(adForm), successHandler, errorHandler);
    evt.preventDefault();
  });

  // ф-ция коллбек, выполнемая при успешной загрузке формы на сервер
  var successHandler = function () {
    // сообщение, что форма отправлена успешно
    // showMess(elemForm, templForm, '.success');
    message.showMessageSuccessSendForm();
    // делаем форму неактивной
    map.initForm();
  };

  var errorHandler = function (errorMessage) {
  //    showMess(elemForm, templFormErr, '.error');
    message.showMessageErrorSendForm(errorMessage);
  };

  // обработчик при изменении типа жилья
  function onAdvertizeInputTypeChange(evt) {
    advertizePrice.setAttribute('min', typeHousingMinPrice[evt.currentTarget.value]);
    advertizePrice.setAttribute('placeholder', typeHousingMinPrice[evt.currentTarget.value]);
  }

  // обработчик ошибок поля "стоимость жилья"
  function onAdvertizePriceInput(evt) {
    if (advertizePrice.validity.rangeUnderflow) {
      advertizePrice.setCustomValidity('Введенное значение меньше минимально допустимого : ' + evt.target.min);
    } else if (advertizePrice.validity.rangeOverflow) {
      advertizePrice.setCustomValidity('Введенное значение больше максимально допустимого : ' + evt.target.max);
    } else if (advertizePrice.validity.valueMissing) {
      advertizePrice.setCustomValidity('Обязательное поле');
    } else {
      advertizePrice.setCustomValidity('');
    }
  }

  // обработчик при изменении полей "время заезда" и "время выезда"
  function onAdvertizeTimeInOutChange(evt) {
    var timeInOut = parseInt(evt.currentTarget.value, 10);
    if (evt.currentTarget.name === 'timein') {
      synchroTimeInOut(advertizeTimeOut, timeInOut);
    }
    if (evt.currentTarget.name === 'timeout') {
      synchroTimeInOut(advertizeTimeIn, timeInOut);
    }
  }

  // ф-ция синхронизации значений в полях "время заезда" и "время выезда"
  function synchroTimeInOut(elemTime, valTime) {
    for (var indTime = 0; indTime < elemTime.length; indTime++) {
      if (parseInt(elemTime[indTime].value, 10) === valTime) {
        elemTime[indTime].selected = true;
      } else {
        elemTime[indTime].selected = false;
      }
    }
  }

  // обработчик по изменению поля "кол-во комнат" -
  function onAdvertizeRoomNumberChange() {
    units.relationNumberRoomsCapacity();
  }

  // обработчик ошибок ввода в полях "кол-во мест" и "кол-во комнат"
  function onAdvertizeRoomNumberInput() {
    // объект соответствия поля "кол-во мест" полю "кол-во комнат"
    var capacityRoomNumber = {
      '0': ['100'], // не для гостей - 100 комнат
      '1': ['1', '2', '3'], // для 1 гостя возможно 1,2,3 комнаты
      '2': ['2', '3'], // для 2 гостей 2 или 3 комнаты
      '3': ['3'] // для 3 гостей 3 комнаты
    };

    // в массиве варианты комнат, которые доступны для введенного значения в поле "количество мест"
    var selectCapacity = capacityRoomNumber[advertizeCapacity.value];
    // признак валидности поля "кол-во комнат"
    var selectCapacityCorrect = !!~selectCapacity.indexOf(advertizeRoomNumber.value);

    if (!selectCapacityCorrect) {
      advertizeCapacity.setCustomValidity('Данное значение недопустимо. Выберите из списка корректное значение');
    } else {
      advertizeCapacity.setCustomValidity('');
    }
  }


})();
