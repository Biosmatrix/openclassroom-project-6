// custom query selector to select elements from the DOM
export const $ = (query) => {
  const elements = [...document.querySelectorAll(query)];

  return elements.length > 1 ? elements : elements[0];
};
// eg $('.container').style.background = 'red';

export const getRandomCellPosition = max => Math.floor(Math.random() * max);

export const getCellPosition = position => $(`#cell-${position.x}${position.y}`);

export const getCellValue = cell => ({
  position: {
    x: cell.x,
    y: cell.y,
  },
  type: cell.type,
  name: cell.name,
  turn: cell.turn,
});

// Render element to DOM
export const appendElementToDOM = (template, element) => {
  if (!element) return;

  element.appendChild(template);
};

// TODO code refactor to to use for of and for in loop
// Create an element with an optional CSS class
export const createElement = (tag, className = '', data = '') => {
  const element = document.createElement(tag);

  if (data) {
    // eslint-disable-next-line no-undef
    const obj = Object.entries(data);
    obj.forEach((el) => {
      element.setAttribute(`${el[0]}`, `${el[1]}`);
    });
  }

  if (className) {
    // eslint-disable-next-line no-undef
    const obj = Object.values(className);
    obj.forEach((el) => {
      element.classList.add(el);
    });
  }

  return element;
};
