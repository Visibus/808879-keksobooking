'use strict';

(function () {
  window.map = {
  // экспортируемая ф-ция сброса формы в начальное состояние (п 1.5 ТЗ)
    initForm: function () {
      formActivate(false);
      // удаление меток
      deleteElementsMap(pinListElement, '.map__pin');
      // удаление объявлений
      deleteElementsMap(mapShowElement, '.map__card');

      adFormElement.reset();
      mapFiltersElement.reset();

      // пересчитываем координату
      addressCoordinatePinElement.value = defineCoordinatePin(mapPinMainElement);
      // назначаем обработчик на главную метку
      mapPinMainElement.addEventListener('mouseup', onMapMouseUp);

      // сразу запрещаем неправильные варианты кол-ва мест от выбранного кол-ва комнат
      units.setRelationNumberRoomsCapacity();

      for (var key in filterAdvertize) {
        if (filterAdvertize.hasOwnProperty(key)) {
          filterAdvertize[key][0] = '';
        }
      }

    }
  };

  // DOM-объект с блоком карты
  var mapShowElement = document.querySelector('.map');
  // DOM-объект с формой заполнения объявления
  var adFormElement = document.querySelector('.ad-form');
  // DOM-объект с формой фильтрации объявлений
  var mapFiltersElement = document.querySelector('.map__filters');
  // DOM-объект метки объявления
  var mapPinMainElement = document.querySelector('.map__pin--main');
  // элемент поля адреса в форме объявления
  var addressCoordinatePinElement = document.querySelector('#address');
  // блок, куда будут вставлены объекты (метки объявлений)
  var pinListElement = document.querySelector('.map__pins');
  // блок, перед которым нужно вставить объявление
  var cardListElement = document.querySelector('.map__filters-container');

  var aAdvertizes = window.data.aAdvertizes;
  var data = window.data;
  var renderPin = window.renderPin;
  var renderCard = window.renderCard;
  var units = window.units;
  var backend = window.backend;
  var message = window.message;
  var debounce = window.debounce;

  // ф-ция для определения координаты x блока метки
  var getMapX = function (x) {
    return x + data.WIDTH_PIN / 2;
  };

  // ф-ция для определения координаты y блока метки
  var getMapY = function (y) {
    return y + data.HEIGHT_PIN;
  };

  // функция определения координаты метки объявления
  var defineCoordinatePin = function (mapPinElement) {
    var xTmp = mapPinElement.style.left;
    var yTmp = mapPinElement.style.top;
    // если элемент является сгенерированной меткой объявления (наличие атрибута 'data-id')
    if (mapPinElement.hasAttribute('data-id')) {
      var x = getMapX(parseInt(xTmp, 10));
      var y = getMapY(parseInt(yTmp, 10));
    } else {
      x = parseInt(xTmp, 10) + data.WIDTH_PIN_MAIN / 2;
      y = parseInt(yTmp, 10) + data.HEIGHT_PIN_MAIN;
    }
    return Math.round(x) + ', ' + Math.round(y);
  };

  // ф-ция генерации меток объявлений
  var generatePins = function (countPins, mask) {
    var fragment = document.createDocumentFragment();
    for (var indPin = 0; indPin < countPins; indPin++) {
      if (aAdvertizes[indPin].rank === mask || aAdvertizes[indPin].rank === null) {
        fragment.appendChild(renderPin(aAdvertizes[indPin], onPinClick));
      }
    }
    pinListElement.appendChild(fragment);
  };

  // ф-ция загрузки карточек объявлений
  var loadCard = function (countAdvertizes, maskS) {
    var fragmentCard = document.createDocumentFragment();
    for (var indCard = 0; indCard < countAdvertizes; indCard++) {
      if (aAdvertizes[indCard].rank === maskS || aAdvertizes[indCard].rank === null) {
        var cardAdvertize = renderCard(aAdvertizes[indCard], onCardButtonCloseClick);
        fragmentCard.appendChild(cardAdvertize);
      }
    }
    mapShowElement.insertBefore(fragmentCard, cardListElement);
  };

  // функция показа формы карточки объявления
  var showCard = function (idPin) {
    var listCardsElement = document.querySelectorAll('.map__card');
    for (var indCard = 0; indCard < listCardsElement.length; indCard++) {
      var itemCardElement = listCardsElement[indCard];
      if (itemCardElement.getAttribute('data-id') === idPin) {
        itemCardElement.classList.remove('hidden');
      } else {
        itemCardElement.classList.add('hidden');
      }
    }
  };

  // функция, скрывающая форму карточки объявления
  var closeCard = function (idPin) {
    var listCardsElement = document.querySelectorAll('.map__card');
    for (var indCard = 0; indCard < listCardsElement.length; indCard++) {
      var itemCardElement = listCardsElement[indCard];
      if ((itemCardElement.getAttribute('data-id') === idPin) || (idPin === null)) {
        itemCardElement.classList.add('hidden');
      }
    }
  };

  // функция перевода формы в невактивное/активное состояние
  var formActivate = function (activate) {
    mapShowElement.classList.toggle('map--faded', !activate);
    adFormElement.classList.toggle('ad-form--disabled', !activate);
    mapFiltersElement.classList.toggle('ad-form--disabled', !activate);

    var childElement = adFormElement.querySelectorAll('fieldset');
    for (var i = 0; i < childElement.length; i++) {
      if (activate) {
        childElement[i].removeAttribute('disabled');
      } else {
        childElement[i].setAttribute('disabled', true);
      }
    }
  };

  // событие на нажатие метки объявления
  var onPinClick = function (evt) {
    if (evt.currentTarget.hasAttribute('data-id')) {
      showCard(evt.currentTarget.getAttribute('data-id'));
      addressCoordinatePinElement.value = defineCoordinatePin(evt.currentTarget);
    }
  };

  // событие на закрытие карточки объявления
  var onCardButtonCloseClick = function (evt) {
    if (evt.currentTarget.parentElement.hasAttribute('data-id')) {
      closeCard(evt.currentTarget.parentElement.getAttribute('data-id'));
    }
  };

  // событие на перетаскивание метки объявления
  var onMapMouseUp = function () {
    backend.load(onSuccessGetData, onErrorGetData); // загружаем данные с сервера и записываем в массив data.aAdvertize
    formActivate(true);
    units.setRelationNumberRoomsCapacity(); // сразу запрещаем неправильные варианты кол-ва мест от выбранного кол-ва комнат
    mapPinMainElement.removeEventListener('mouseup', onMapMouseUp); // отписываемся от события
  };

  // ф-ция удаления объектов в разметке
  var deleteElementsMap = function (elemParent, classElem) {
    var childElement = elemParent.querySelectorAll(classElem);
    for (var indElem = 0; indElem < childElement.length; indElem++) {
      if (childElement[indElem].hasAttribute('data-id')) {
        elemParent.removeChild(childElement[indElem]);
      }
    }
  };

  // ф-ция перетаскивания метки объявления
  mapPinMainElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var tmpY = mapPinMainElement.offsetTop - shift.y;
      var tmpX = mapPinMainElement.offsetLeft - shift.x;

      if (tmpY < data.MIN_Y) {
        tmpY = data.MIN_Y + 'px';
      } else if (tmpY > data.MAX_Y) {
        tmpY = data.MAX_Y + 'px';
      } else {
        tmpY = tmpY + 'px';
      }
      mapPinMainElement.style.top = tmpY;

      if (tmpX < data.MIN_X) {
        tmpX = data.MIN_X + 'px';
      } else if (tmpX > data.MAX_X) {
        tmpX = data.MAX_X + 'px';
      } else {
        tmpX = tmpX + 'px';
      }
      mapPinMainElement.style.left = tmpX;
      addressCoordinatePinElement.value = defineCoordinatePin(mapPinMainElement);

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (evtDr) {
          evtDr.preventDefault();
          mapPinMainElement.removeEventListener('click', onClickPreventDefault);
        };
        mapPinMainElement.addEventListener('click', onClickPreventDefault);
      }

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // ф-ция callback при успешной загрузке данных
  var onSuccessGetData = function (loadAdvertize) {
    aAdvertizes = [];
    for (var ii = 0; ii < loadAdvertize.length; ii++) {
      aAdvertizes.push(loadAdvertize[ii]);
      aAdvertizes[ii].id = ii;
      aAdvertizes[ii].rank = null;
    }
    updateFilter();
    generatePins(5); // загружаем 5 меток (ТЗ)
    loadCard(5); // загружаем все объявления
  };

  // ф-ция callback при неуспешной загрузке данных
  var onErrorGetData = function (errorMessage) {
    message.showMessageErrorSendForm('Ошибка! Объявления не были загружены ' + errorMessage);
  };

  // ф-ция подсчета ранга у текущего объекта-объявления
  var getRank = function (objCard) {
    var rank = 0;
    if ((objCard.offer.type === filterAdvertize['housing-type'][0]) && (filterAdvertize['housing-type'][0])) {
      rank += filterAdvertize['housing-type'][1];
    }

    switch (filterAdvertize['housing-price'][0]) {
      case 'middle':
        if (objCard.offer.price >= 10000 && objCard.offer.price <= 50000) {
          rank += filterAdvertize['housing-price'][1];
        }
        break;
      case 'low':
        if (objCard.offer.price < 10000) {
          rank += filterAdvertize['housing-price'][1];
        }
        break;
      case 'high':
        if (objCard.offer.price > 50000) {
          rank += filterAdvertize['housing-price'][1];
        }
        break;
    }
    if ((objCard.offer.rooms === parseInt(filterAdvertize['housing-rooms'][0], 10)) && (filterAdvertize['housing-rooms'][0])) {
      rank += filterAdvertize['housing-rooms'][1];
    }

    if ((objCard.offer.guests === parseInt(filterAdvertize['housing-guests'][0], 10)) && (filterAdvertize['housing-guests'][0])) {
      rank += filterAdvertize['housing-guests'][1];
    }

    if (~objCard.offer.features.indexOf(filterAdvertize['filter-wifi'][0]) && (filterAdvertize['filter-wifi'][0])) {
      rank += filterAdvertize['filter-wifi'][1];
    }

    if (~objCard.offer.features.indexOf(filterAdvertize['filter-dishwasher'][0]) && (filterAdvertize['filter-dishwasher'][0])) {
      rank += filterAdvertize['filter-dishwasher'][1];
    }

    if (~objCard.offer.features.indexOf(filterAdvertize['filter-parking'][0]) && (filterAdvertize['filter-parking'][0])) {
      rank += filterAdvertize['filter-parking'][1];
    }

    if (~objCard.offer.features.indexOf(filterAdvertize['filter-washer'][0]) && (filterAdvertize['filter-washer'][0])) {
      rank += filterAdvertize['filter-washer'][1];
    }

    if (~objCard.offer.features.indexOf(filterAdvertize['filter-elevator'][0]) && (filterAdvertize['filter-elevator'][0])) {
      rank += filterAdvertize['filter-elevator'][1];
    }

    if (~objCard.offer.features.indexOf(filterAdvertize['filter-conditioner'][0]) && (filterAdvertize['filter-conditioner'][0])) {
      rank += filterAdvertize['filter-conditioner'][1];
    }
    objCard.rank = rank;
    return rank;
  };

  // 512, 256, 128 и т.д. для битовой маски
  var filterAdvertize = {
    'housing-type': ['', 512],
    'housing-price': ['', 256],
    'housing-rooms': ['', 128],
    'housing-guests': ['', 64],
    'filter-wifi': ['', 32],
    'filter-dishwasher': ['', 16],
    'filter-parking': ['', 8],
    'filter-washer': ['', 4],
    'filter-elevator': ['', 2],
    'filter-conditioner': ['', 1]
  };

  var sumMask = function (filterAdv) {
    var mask = 0;
    for (var key in filterAdv) {
      if (filterAdv[key][0]) {
        mask += filterAdv[key][1];
      }
    }
    return mask;
  };

  // ф-ция определяющая порядок сортировки по 2-му критерию (свойство title у объекта-объявления)
  var compareNamesForSort = function (leftName, rightName) {
    if (leftName > rightName) {
      return 1;
    } else if (leftName < rightName) {
      return -1;
    } else {
      return 0;
    }
  };

  // ф-ция определяющая порядок сортировки по 1-му критерию (свойство rank у объекта-объявления)
  var compareAdvertizeForSort = function (left, right) {
    var rankDiff = getRank(right) - getRank(left);
    return rankDiff === 0 ? compareNamesForSort(left.offer.title, right.offer.title) : rankDiff;
  };

  // обработчик изменения значения в поле input в форме фильтрации меток объявлений
  var onHousingFilterChange = function (evt) {
    var valFilter = evt.currentTarget.value;
    filterAdvertize[evt.currentTarget.name][0] = '';
    if (valFilter !== 'any') {
      filterAdvertize[evt.currentTarget.name][0] = valFilter;
    }
    debounce(updateFilter);
  };

  // обработчик изменения значения в поле checkbox в форме фильтрации меток объявлений
  var onHousingFilterCheckBoxChange = function (evt) {
    var valFilter = evt.currentTarget.checked;
    var tempStr = evt.currentTarget.id;
    var valFilterForRelation = tempStr.substr(tempStr.indexOf('-') + 1, tempStr.length);
    filterAdvertize[evt.currentTarget.id][0] = '';
    if (valFilter) {
      filterAdvertize[evt.currentTarget.id][0] = valFilterForRelation;
    }
    debounce(updateFilter);
  };

  var updateFilter = function () {
    filterPin(aAdvertizes.sort(compareAdvertizeForSort));
  };

  var housingTypeElement = document.querySelector('#housing-type');
  var housingPriceElement = document.querySelector('#housing-price');
  var housingRoomsElement = document.querySelector('#housing-rooms');
  var housingGuestsElement = document.querySelector('#housing-guests');

  var filterWifiElement = document.querySelector('#filter-wifi');
  var filterDishwasherElement = document.querySelector('#filter-dishwasher');
  var filterParkingElement = document.querySelector('#filter-parking');
  var filterWasherElement = document.querySelector('#filter-washer');
  var filterElevatorElement = document.querySelector('#filter-elevator');
  var filterConditionerElement = document.querySelector('#filter-conditioner');

  housingTypeElement.addEventListener('change', onHousingFilterChange);
  housingPriceElement.addEventListener('change', onHousingFilterChange);
  housingRoomsElement.addEventListener('change', onHousingFilterChange);
  housingGuestsElement.addEventListener('change', onHousingFilterChange);
  filterWifiElement.addEventListener('change', onHousingFilterCheckBoxChange);
  filterDishwasherElement.addEventListener('change', onHousingFilterCheckBoxChange);
  filterParkingElement.addEventListener('change', onHousingFilterCheckBoxChange);
  filterWasherElement.addEventListener('change', onHousingFilterCheckBoxChange);
  filterElevatorElement.addEventListener('change', onHousingFilterCheckBoxChange);
  filterConditionerElement.addEventListener('change', onHousingFilterCheckBoxChange);

  // ф-ция загрузки меток и карточек объявлений при фильтрации
  var filterPin = function () {
    deleteElementsMap(pinListElement, '.map__pin');
    closeCard(null);
    var takeNumber = aAdvertizes.length > 5 ? 5 : aAdvertizes.length;
    var sMask = sumMask(filterAdvertize);
    generatePins(takeNumber, sMask);
    loadCard(takeNumber, sMask);
    aAdvertizes.forEach(function (adv) {
      adv.rank = 0;
    });
  };

  // сбрасываем форму в начальное неактивное состояние
  window.map.initForm();

})();


