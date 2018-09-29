'use strict';

(function () {
  // количество мест
  var advertizeCapacityElement = document.querySelector('#capacity');
  // количество комнат
  var advertizeRoomNumberElement = document.querySelector('#room_number');

  // экспортируемая функция устанавливает disabled на некорретных вариантах поля "кол-во мест"
  window.units = {
    setRelationNumberRoomsCapacity: function () {
      var numberRooms = advertizeRoomNumberElement.value;
      // объект соответствия поля "кол-во комнат" полю "кол-во мест"
      var roomNumberCapacity = {
        '1': ['1'], // 1 комната для 1 гостя
        '2': ['1', '2'], // 2 комнаты для 1 или 2 гостей
        '3': ['1', '2', '3'], // 3 комнаты для 1,2,3 гостей
        '100': ['0'] // 100 не для гостей
      };
      // в массиве варианты количество мест , которые доступны для введенного значения в поле "количество комнат"
      var countGuests = roomNumberCapacity[numberRooms];

      for (var indRoom = 0; indRoom < advertizeCapacityElement.length; indRoom++) {
        for (var indGuest = 0; indGuest < countGuests.length; indGuest++) {
          if (~countGuests.indexOf(advertizeCapacityElement[indRoom].value)) {
            advertizeCapacityElement[indRoom].removeAttribute('disabled');
          } else {
            advertizeCapacityElement[indRoom].setAttribute('disabled', true);
          }
        }
      }
    }
  };
})();
