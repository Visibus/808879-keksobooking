'use strict';

(function () {
  // блок из шаблона, на основе которого будут добавлены карточки объявлений
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var typeHousing = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  // функция создания DOM-элемента (карточка объявления) на основе JS-объекта
  window.renderCard = function (objCard, cb) {
    var cardElement = cardTemplate.cloneNode(true);
    var data = window.data;
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
    for (var i = 0; i < data.aFeatures.length; i++) {
    // Удаляемый элемент
      if (!~objCard.offer.features.indexOf(data.aFeatures[i])) {
        cardElement.querySelector('.popup__features').removeChild(childElement[i]);
      }
    }
    cardElement.querySelector('.popup__description').textContent = objCard.offer.description;

    // выбираем все child-объекты (фото жилья)
    childElement = cardElement.querySelector('.popup__photos');
    if (objCard.offer.photos.length > 0) {
      for (i = 0; i < objCard.offer.photos.length; i++) {
        if (i === 0) {
          childElement.querySelector('img').setAttribute('src', objCard.offer.photos[i]); // изменяем атрибут у элемента из шаблона
        } else {
          var newElement = childElement.querySelector('img').cloneNode(true); // добавляем новый элемент на основе шаблонного
          newElement.setAttribute('src', objCard.offer.photos[i]);
          childElement.appendChild(newElement);
        }
      }
    } else {
      cardElement.removeChild(childElement);
    }

    cardElement.querySelector('.popup__avatar').setAttribute('src', objCard.author.avatar);

    var cardForEvent = cardElement.querySelector('.popup__close');
    cardForEvent.addEventListener('click', cb);

    return cardElement;

  };


})();

