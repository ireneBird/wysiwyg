function getRule(node, config) {
  const re = new RegExp(`(?:^|,)${node.tagName.toLowerCase()}(?:,|$)`);
  const rules = Object.keys(config);
  let rule = false;

  for (let i = 0; i < rules.length && !rule; i++) {
    if (re.test(rules[i])) {
      rule = config[rules[i]];
    }
  }

  return rule;
}

function isEmpty(node): boolean {
  let result = true;
  const re = /^\s*$/;
  let i;
  let child;

  if (node.hasChildNodes()) {
    for (i = 0; i < node.childNodes.length && result; i++) {
      child = node.childNodes[i];

      if (child.nodeType === 1) {
        result = isEmpty(child);
      } else if (child.nodeType === 3 && !re.test(child.nodeValue)) {
        result = false;
      }
    }
  }

  return result;
}

function checkStyles(node, config) {
  let re;

  if (typeof config === 'string' && node.style.length) {
    for (let i = node.style.length - 1; i >= 0; i--) {
      re = new RegExp(`(?:^|,)${node.style[i]}(?:,|$)`);

      if (!re.test(config)) {
        // eslint-disable-next-line no-param-reassign
        node.style[node.style[i]] = '';
      }
    }

    if (!node.style.cssText) {
      node.removeAttribute('style');
    }
  }
}

function checkClasses(node, config) {
  let re;

  if (typeof config === 'string' && node.classList.length) {
    for (let i = node.classList.length - 1; i >= 0; i--) {
      re = new RegExp(`(?:^|\\s)${node.classList[i]}(?:\\s|$)`);

      if (!re.test(config)) {
        node.classList.remove(node.classList[i]);
      }
    }

    if (!node.className) {
      node.removeAttribute('class');
    }
  }
}
function unpack(node) {
  const parent = node.parentNode;

  while (node.childNodes.length > 0) {
    parent.insertBefore(node.childNodes[0], node);
  }
}

function convert(node, convert_to) {
  const parent = node.parentNode;
  const converted = document.createElement(convert_to);

  if (node.style.cssText) {
    converted.style.cssText = node.style.cssText;
  }
  if (node.className) {
    converted.className = node.className;
  }

  while (node.childNodes.length > 0) {
    converted.appendChild(node.childNodes[0]);
  }

  parent.replaceChild(converted, node);
}

function doTasks(taskSet) {
  for (let i = 0; i < taskSet.length; i++) {
    switch (taskSet[i].task) {
      case 'remove':
        taskSet[i].node.parentNode.removeChild(taskSet[i].node);
        break;

      case 'convert':
        convert(taskSet[i].node, taskSet[i].convert_to);
        break;

      case 'process':
        taskSet[i].process(taskSet[i].node);
        break;

      case 'unpack':
        unpack(taskSet[i].node);
        break;
      default:
        return;
    }
  }
}

function processText(node) {
  // eslint-disable-next-line no-param-reassign
  node.nodeValue = node.nodeValue.replace(/\xa0/g, ' ');
}

function processNode(node, config, taskSet) {
  let rule;

  if (node.nodeType === 1) {
    // it's element
    rule = getRule(node, config);

    if (rule) {
      if (typeof rule.config === 'undefined') {
        process(node, config);
      } else {
        process(node, rule.config);
      }

      if (rule.no_empty && isEmpty(node)) {
        taskSet.push({
          task: 'remove',
          node,
        });
      } else {
        checkStyles(node, rule.valid_styles);
        checkClasses(node, rule.valid_classes);

        if (rule.convert_to) {
          taskSet.push({
            task: 'convert',
            node,
            convert_to: rule.convert_to,
          });
        } else if (node.id) {
          node.removeAttribute('id');
        }

        if (typeof rule.process === 'function') {
          taskSet.push({
            task: 'process',
            node,
            process: rule.process,
          });
        }
      }
    } else {
      process(node, config);

      if (node.hasChildNodes()) {
        taskSet.push({
          task: 'unpack',
          node,
        });
      }

      taskSet.push({
        task: 'remove',
        node,
      });
    }
  }

  if (node.nodeType === 2) {
    // it's text
    processText(node);
  }
}

export default function process(node: HTMLElement, config) {
  const taskSet = [];

  for (let i = 0; i < node.childNodes?.length; i++) {
    processNode(node.childNodes[i], config, taskSet);
  }

  doTasks(taskSet);
}
