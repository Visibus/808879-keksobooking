// модуль генерации данных. Эксортируемое значение - массив с JS-объектами
'use strict';

(function () {
  window.data = {
    MIN_Y: 130,
    MAX_Y: 630,
    MIN_X: 0,
    MAX_X: 1130,
    aAvatar: ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png',
      'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'],
    aTitle: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец',
      'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    aType: ['palace', 'flat', 'house', 'bungalo'],
    aCheckin: ['12:00', '13:00', '14:00'],
    aCheckout: ['12:00', '13:00', '14:00'],
    aFeatures: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    aPhotos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    aAdvertize: [] // массив из объектов-объявлений (возвращаемое значение из модуля)
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

  // Генерируем массив объектов

  window.data.aAvatar = mixArray(window.data.aAvatar); // перемешали aAvatar
  window.data.aTitle = mixArray(window.data.aTitle); // перемешали aTitle

  for (var i = 0; i <= 7; i++) {
    var tempX = randomInt(window.data.MIN_X, window.data.MAX_X);
    var tempY = randomInt(window.data.MIN_Y, window.data.MAX_Y);
    var tempRooms = randomInt(1, 5); // случайное число от 1 до 5
    var tempGuests = tempRooms * randomInt(1, 3); // число гостей, определяется от количества комнат и случайного числа от 1 до 3
    window.data.aAdvertize.push({
      author: {
        avatar: window.data.aAvatar[i]
      },
      offer: {
        title: window.data.aTitle[i],
        address: tempX + ', ' + tempY,
        price: randomInt(1000, 1000000),
        type: randomElement(window.data.aType),
        rooms: tempRooms,
        guests: tempGuests,
        checkin: randomElement(window.data.aCheckin),
        checkout: randomElement(window.data.aCheckout),
        features: copyArray(window.data.aFeatures, randomInt(1, window.data.aFeatures.length)),
        description: '',
        photos: mixArray(window.data.aPhotos)
      },
      location: {
        x: tempX,
        y: tempY
      },
      id: i // добавлено дополнительное свойство (id объявления)
    }
    );
  }
})();
