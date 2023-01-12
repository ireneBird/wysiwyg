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

function debounce<T>(cb: (...args: T[]) => void, interval: number) {
  let lastTimeout: number | null = null;

  return (...args) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(() => {
      cb(...args);
    }, interval);
  };
}

export { renderElement, debounce };
