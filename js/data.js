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

})();
