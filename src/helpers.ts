function createElement<T>(template: string): T {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return <T>newElement.firstChild;
}

function renderElement<T extends Node>(
  parent: HTMLElement,
  template: string,
): T {
  const element = createElement<T>(template);
  parent.append(element);

  return element;
}

export { renderElement };
