'use strict';

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
    y = parseInt(yTmp, 10) + 65 / 2;
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
//  debugger;
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

// Генерируем массив объектов
aAvatar = mixArray(aAvatar); // перемешали aAvatar
aTitle = mixArray(aTitle); // перемешали aTitle

var aAdvertize = []; // массив из объектов-объявлений

for (var i = 0; i <= 7; i++) {
  var tempX = randomInt(0, 1140);
  var tempY = randomInt(130, 630);
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

// событие на перетаскивание метки объявления
function onMapMouseUp() {
  formActivate(true);
  generatePins(); // загружаем все метки
  loadCard(); // загружаем все объявления
  mapPinMain.removeEventListener('mouseup', onMapMouseUp); // отписываемся от события
}

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

// устанавливаем неактивный режим формы
formActivate(false);

addressCoordinatePin.value = defineCoordinatePin(mapPinMain);

mapPinMain.addEventListener('mouseup', onMapMouseUp);
