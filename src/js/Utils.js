// custom query selector to select elements from the DOM
export const $ = query => {
  const elements = [...document.querySelectorAll(query)];

  return elements.length > 1 ? elements : elements[0];
};
// eg $('.container').style.background = 'red';

// get random cell position
export const getRandomCellPosition = max =>
  Math.floor(Math.random() * max);

// get cell position
export const getCellPosition = position =>
  $(`#cell-${position.x}${position.y}`);

// gets cell values
export const getCellValue = cell => ({
  position: {
    x: cell.x,
    y: cell.y
  },
  type: cell.type.toLowerCase(),
  name: cell.name,
  turn: cell.turn
});

// Render element to DOM
export const appendElementToDOM = (template, element) => {
  if (!element) return;

  element.appendChild(template);
};

// Create an element with an optional CSS class
export const createElement = (tag, className = '', data = '') => {
  const element = document.createElement(tag);

  if (data) {
    // eslint-disable-next-line no-undef
    const obj = Object.entries(data);
    obj.forEach(el => {
      element.setAttribute(`${el[0]}`, `${el[1]}`);
    });
  }

  if (className) {
    // eslint-disable-next-line no-undef
    const obj = Object.values(className);
    obj.forEach(el => {
      element.classList.add(el);
    });
  }

  return element;
};

// clear container element
export const clearContainer = container => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

// sets class on element
export const setClasses = (element, classes) => {
  element.setAttribute('class', classes.join(' '));
};

// set data set attribute
export const setDataset = (element, key, value) => {
  element.setAttribute(`data-${key}`, `${value}`);
};

// gets cell position cass
export const getCellPositionClass = position => {
  return `cell-${position.x}${position.y}`;
};

// create element tag
export const createElements = tag => {
  return document.createElement(tag);
};
