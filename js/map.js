'use strict';

var ESC_KEYCODE = 27;
var MIN_Y = 130;
var MAX_Y = 630;
var MIN_X = 0;
var MAX_X = 1130;

var aAvatar = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png',
  'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];
var aTitle = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец',
  'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var aType = ['palace', 'flat', 'house', 'bungalo'];
var aCheckin = ['12:00', '13:00', '14:00'];
var aCheckout = ['12:00', '13:00', '14:00'];
var aFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var aPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var typeHousing = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

// объект соответствия типа жилья и минимальной стоимости за ночь
var typeHousingMinPrice = {
  flat: 1000,
  bungalo: 0,
  house: 5000,
  palace: 10000
};

// DOM-объект с блоком карты
var mapShow = document.querySelector('.map');
// DOM-объект с формой заполнения объявления
var adForm = document.querySelector('.ad-form');
// DOM-объект с формой фильтрации объявлений
var mapFiltes = document.querySelector('.map__filters');
// DOM-объект метки объявлений
var mapPinMain = document.querySelector('.map__pin--main');
// элемент поля адреса в форме объявления
var addressCoordinatePin = document.querySelector('#address');
// блок, куда будут вставлены объекты (метки объявлений)
var pinListElement = document.querySelector('.map__pins');
// блок из шаблона, на основе которого будут добавлены метки объявлений
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
// блок, перед которым нужно вставить объявление
var cardListElement = document.querySelector('.map__filters-container');
// блок из шаблона, на основе которого будут добавлены карточки объявлений
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
// блок из шаблона, на основе которого будут выведено сообщение об успешной отправке формы
var templForm = document.querySelector('#success').content.querySelector('.success');
// блок, куда будет вставлен блок об успешной отправке формы
var elemForm = document.querySelector('main');
// блок с сообщением об успешном отправлении формы
var elemSuccess = document.querySelector('.success');
// блок из шаблона, на основе которого будут выведено сообщение об ошибке при отправке формы
// var templFormErr = document.querySelector('#error').content.querySelector('.error');
// блок с сообщением об успешном отправлении формы
// var elemError = document.querySelector('.error');
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

function compareRandom() {
  return Math.random() - 0.5;
}

// перемешивание массива с использованием сортировки случайным образом
function mixArray(arr) {
  return arr.sort(compareRandom);
}

// ф-ция генерации числа в диапазоне от min до max, включая min и max
function randomInt(min, max) {
  var rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return rand;
}

// функция генерации случайного элемента из заданного массива
function randomElement(array) {
  var rand = randomInt(0, array.length - 1);
  return array[rand];
}

// функция для копирования массива
function copyArray(array, aLength) {
  var arr = [];
  for (var i = 0; i < aLength; i++) {
    arr.push(array[i]);
  }
  return arr;
}

// ф-ция для определения координаты x блока метки
function getMapX(x) {
  return x + 50 / 2;
}

// ф-ция для определения координаты y блока метки
function getMapY(y) {
  return y + 70;
}

// функция создания DOM-элемента (метка объявлений) на основе JS-объекта
var renderPin = function (objPin) {
  var pinElement = pinTemplate.cloneNode(true);
  // в разметку элемента метки добавлен аттрибут data-id для связи элемента и JS-объекта
  pinElement.setAttribute('data-id', objPin.id);
  pinElement.setAttribute('style', 'left: ' + objPin.location.x + 'px; top: ' + objPin.location.y + 'px;');
  var pinElementImg = pinElement.querySelector('img');
  pinElementImg.setAttribute('src', objPin.author.avatar);
  pinElementImg.setAttribute('alt', 'заголовок объявления');
  pinElement.addEventListener('click', onPinClick);
  return pinElement;
};

// функция создания DOM-элемента (карточка объявления) на основе JS-объекта
var renderCard = function (objCard) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.classList.add('hidden'); // скрываем форму объявления
  // в разметку элемента карточки объявления добавлен аттрибут для привязки карточки объявления и метки объявления
  cardElement.setAttribute('data-id', objCard.id);
  cardElement.querySelector('.popup__title').textContent = objCard.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = objCard.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = objCard.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = typeHousing[objCard.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = objCard.offer.rooms + ' комнаты для ' +
  objCard.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + objCard.offer.checkin +
  ' выезд до ' + objCard.offer.checkout;

  // выбираем все child-объекты (элементы жилья)
  var childElement = cardElement.querySelector('.popup__features').querySelectorAll('li');
  for (var i = objCard.offer.features.length; i < aFeatures.length; i++) {
    // Удаляемый элемент
    cardElement.querySelector('.popup__features').removeChild(childElement[i]);
  }
  cardElement.querySelector('.popup__description').textContent = objCard.offer.description;

  // выбираем все child-объекты (фото жилья)
  childElement = cardElement.querySelector('.popup__photos');
  for (i = 0; i < aPhotos.length; i++) {
    if (i === 0) {
      childElement.querySelector('img').setAttribute('src', objCard.offer.photos[i]); // изменяем атрибут у элемента из шаблона
    } else {
      var newElement = childElement.querySelector('img').cloneNode(true); // добавляем новый элемент на основе шаблонного
      newElement.setAttribute('src', objCard.offer.photos[i]);
      childElement.appendChild(newElement);
    }
  }
  cardElement.querySelector('.popup__avatar').setAttribute('src', objCard.author.avatar);

  var cardForEvent = cardElement.querySelector('.popup__close');
  cardForEvent.addEventListener('click', onCardButtonCloseClick);

  return cardElement;

};

// функция определения координаты метки объявления
function defineCoordinatePin(elemMapPin) {
  var xTmp = elemMapPin.style.left;
  var yTmp = elemMapPin.style.top;
  // если элемент является сгенерированной меткой объявления (наличие атрибута 'data-id')
  if (elemMapPin.hasAttribute('data-id')) {
    var x = getMapX(parseInt(xTmp, 10));
    var y = getMapY(parseInt(yTmp, 10));
  } else {
    x = parseInt(xTmp, 10) + 65 / 2;
    y = parseInt(yTmp, 10) + 81;
  }
  return Math.round(x) + ', ' + Math.round(y);
}

// ф-ция генерации меток объявлений
function generatePins() {
  var fragment = document.createDocumentFragment();
  for (var indPin = 0; indPin < aAdvertize.length; indPin++) {
    fragment.appendChild(renderPin(aAdvertize[indPin]));
  }
  pinListElement.appendChild(fragment);
}

// ф-ция загрузки карточек объявлений
function loadCard() {
  // отрисовка DOM-объектов (карточка объявления) через DocumentFragment
  var fragmentCard = document.createDocumentFragment();
  for (var indCard = 0; indCard < aAdvertize.length; indCard++) {
    var cardAdvertize = renderCard(aAdvertize[indCard]);
    fragmentCard.appendChild(cardAdvertize);
  }
  mapShow.insertBefore(fragmentCard, cardListElement);
}

// функция показа формы карточки объявления
function showCard(idPin) {
  var listCards = document.querySelectorAll('.map__card');
  for (var indCard = 0; indCard < listCards.length; indCard++) {
    var itemCard = listCards[indCard];
    if (itemCard.getAttribute('data-id') === idPin) {
      itemCard.classList.remove('hidden');
    } else {
      itemCard.classList.add('hidden');
    }
  }
}

// функция, скрывающая форму карточки объявления
function closeCard(idPin) {

  var listCards = document.querySelectorAll('.map__card');
  for (var indCard = 0; indCard < listCards.length; indCard++) {
    var itemCard = listCards[indCard];
    if (itemCard.getAttribute('data-id') === idPin) {
      itemCard.classList.add('hidden');
    }
  }
}

// функция перевода формы в невактивное/активное состояние
function formActivate(activate) {

  mapShow.classList.toggle('map--faded', !activate);
  adForm.classList.toggle('ad-form--disabled', !activate);
  mapFiltes.classList.toggle('ad-form--disabled', !activate);

  var childElement = adForm.querySelectorAll('fieldset');
  for (var i = 0; i < childElement.length; i++) {
    if (activate) {
      childElement[i].removeAttribute('disabled');
    } else {
      childElement[i].setAttribute('disabled', true);
    }
  }
}

// событие на нажатие на метку объявления
var onPinClick = function (evt) {
  if (evt.currentTarget.hasAttribute('data-id')) {
    showCard(evt.currentTarget.getAttribute('data-id'));
    addressCoordinatePin.value = defineCoordinatePin(evt.currentTarget);
  }
};

// событие на закрытие карточки объявления
var onCardButtonCloseClick = function (evt) {
  if (evt.currentTarget.parentElement.hasAttribute('data-id')) {
    closeCard(evt.currentTarget.parentElement.getAttribute('data-id'));
  }
};

// событие на перетаскивание метки объявления
function onMapMouseUp() {
  formActivate(true);
  generatePins(); // загружаем все метки
  loadCard(); // загружаем все объявления
  relationNumberRoomsCapacity(); // сразу запрещаем неправильные варианты кол-ва мест от выбранного кол-ва комнат
  mapPinMain.removeEventListener('mouseup', onMapMouseUp); // отписываемся от события
}


advertizeType.addEventListener('change', onAdvertizeInputTypeChange);
advertizeTimeIn.addEventListener('change', onAdvertizeTimeInOutChange);
advertizeTimeOut.addEventListener('change', onAdvertizeTimeInOutChange);
advertizeRoomNumber.addEventListener('change', onAdvertizeRoomNumberChange);
advertizeRoomNumber.addEventListener('input', onAdvertizeRoomNumberInput);
advertizePrice.addEventListener('input', onAdvertizePriceInput);
advertizeCapacity.addEventListener('input', onAdvertizeRoomNumberInput);

// событие на отправку формы
adForm.addEventListener('submit', function (evt) {
  // вывод сообщения об успешной отправке формы
//  showMessage(elemForm, elemSuccess, templForm, '.success');
  showMessageSuccessSendForm();


  // делаем форму неактивной
  initForm();
  evt.preventDefault();
});

// событие на нажатие кнопки "очистить"
adFormReset.addEventListener('click', function (evt) {
  initForm();
  evt.preventDefault();
});

// ф-ция сброса формы в начальное состояние (п 1.5 ТЗ)
function initForm() {
  formActivate(false);
  // удаление меток
  deleteElementsMap(pinListElement, '.map__pin');
  // удаление объявлений
  deleteElementsMap(mapShow, '.map__card');

  adForm.reset();

  // пересчитываем координату
  addressCoordinatePin.value = defineCoordinatePin(mapPinMain);
  // назаначаем обработчик на главную метку
  mapPinMain.addEventListener('mouseup', onMapMouseUp);
  // сразу запрещаем неправильные варианты кол-ва мест от выбранного кол-ва комнат
  relationNumberRoomsCapacity();
}

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
  relationNumberRoomsCapacity();
}

// функция устанавливает disabled на некорретных вариантах поля "кол-во мест"
function relationNumberRoomsCapacity() {
  var numberRooms = advertizeRoomNumber.value;
  // объект соответствия поля "кол-во комнат" полю "кол-во мест"
  var roomNumberCapacity = {
    '1': ['1'], // 1 комната для 1 гостя
    '2': ['1', '2'], // 2 комнаты для 1 или 2 гостей
    '3': ['1', '2', '3'], // 3 комнаты для 1,2,3 гостей
    '100': ['0'] // 100 не для гостей
  };
  // в массиве варианты количество мест , которые доступны для введенного значения в поле "количество комнат"
  var countGuests = roomNumberCapacity[numberRooms];

  for (var indRoom = 0; indRoom < advertizeCapacity.length; indRoom++) {
    for (var indGuest = 0; indGuest < countGuests.length; indGuest++) {
      if (advertizeCapacity[indRoom].value === countGuests[indGuest]) {
        advertizeCapacity[indRoom].removeAttribute('disabled');
      } else {
        advertizeCapacity[indRoom].setAttribute('disabled', true);
      }
    }
  }
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

// ф-ция удаления объектов в разметке
function deleteElementsMap(elemParent, classElem) {
  var childElement = elemParent.querySelectorAll(classElem);
  for (var indElem = 0; indElem < childElement.length; indElem++) {
    if (childElement[indElem].hasAttribute('data-id')) {
      elemParent.removeChild(childElement[indElem]);
    }
  }
}

function showMessageSuccessSendForm() {
  elemForm.appendChild(templForm);
  elemSuccess = document.querySelector('.success');

  elemSuccess.addEventListener('click', function () {
    elemForm.removeChild(elemSuccess);
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      elemForm.removeChild(elemSuccess);
    }
  });
}

// Генерируем массив объектов
aAvatar = mixArray(aAvatar); // перемешали aAvatar
aTitle = mixArray(aTitle); // перемешали aTitle

var aAdvertize = []; // массив из объектов-объявлений

for (var i = 0; i <= 7; i++) {
  var tempX = randomInt(MIN_X, MAX_X);
  var tempY = randomInt(MIN_Y, MAX_Y);
  var tempRooms = randomInt(1, 5); // случайное число от 1 до 5
  var tempGuests = tempRooms * randomInt(1, 3); // число гостей, определяется от количества комнат и случайного числа от 1 до 3
  aAdvertize.push({
    author: {
      avatar: aAvatar[i]
    },
    offer: {
      title: aTitle[i],
      address: tempX + ', ' + tempY,
      price: randomInt(1000, 1000000),
      type: randomElement(aType),
      rooms: tempRooms,
      guests: tempGuests,
      checkin: randomElement(aCheckin),
      checkout: randomElement(aCheckout),
      features: copyArray(aFeatures, randomInt(1, aFeatures.length)),
      description: '',
      photos: mixArray(aPhotos)
    },
    location: {
      x: tempX,
      y: tempY
    },
    id: i // добавлено дополнительное свойство (id объявления)
  }
  );
}

// устанавливаем неактивный режим формы
formActivate(false);
addressCoordinatePin.value = defineCoordinatePin(mapPinMain);
mapPinMain.addEventListener('mouseup', onMapMouseUp);

mapPinMain.addEventListener('mousedown', function (evt) {
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

    var tmpY = mapPinMain.offsetTop - shift.y;
    var tmpX = mapPinMain.offsetLeft - shift.x;

    if (tmpY < MIN_Y) {
      tmpY = MIN_Y + 'px';
    } else if (tmpY > MAX_Y) {
      tmpY = MAX_Y + 'px';
    } else {
      tmpY = tmpY + 'px';
    }
    mapPinMain.style.top = tmpY;

    if (tmpX < MIN_X) {
      tmpX = MIN_X + 'px';
    } else if (tmpX > MAX_X) {
      tmpX = MAX_X + 'px';
    } else {
      tmpX = tmpX + 'px';
    }
    mapPinMain.style.left = tmpX;
    addressCoordinatePin.value = defineCoordinatePin(mapPinMain);

  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (dragged) {
      var onClickPreventDefault = function (evtDr) {
        evtDr.preventDefault();
        mapPinMain.removeEventListener('click', onClickPreventDefault);
      };
      mapPinMain.addEventListener('click', onClickPreventDefault);
    }

  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
