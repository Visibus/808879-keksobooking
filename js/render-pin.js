'use strict';

(function () {
  // блок из шаблона, на основе которого будут добавлены метки объявлений
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // функция создания DOM-элемента (метка объявлений) на основе JS-объекта
  window.renderPin = function (objPin, cb) {
    var pinElement = pinTemplate.cloneNode(true);
    // в разметку элемента метки добавлен аттрибут data-id для связи элемента и JS-объекта
    pinElement.setAttribute('data-id', objPin.id);
    pinElement.setAttribute('style', 'left: ' + objPin.location.x + 'px; top: ' + objPin.location.y + 'px;');
    var pinElementImg = pinElement.querySelector('img');
    pinElementImg.setAttribute('src', objPin.author.avatar);
    pinElementImg.setAttribute('alt', 'заголовок объявления');
    pinElement.addEventListener('click', cb);
    return pinElement;
  };

})();

