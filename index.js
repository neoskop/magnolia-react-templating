import JsxParser from "react-jsx-parser";
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

export let TEMPLATING_ERROR = /<!--.*ERROR MESSAGE STARTS HERE.*-->/;

export function render(components, root, callback) {
  if (!TEMPLATING_ERROR.test(root.innerHTML)) {
    ReactDOM.render(parse({ XmlComment, ...components }, root), root, () => {
      if (callback instanceof Function) {
        callback();
      }
    });
  }
}

function parse(components, root) {
  const jsx = escapeComments(extractJSX(root));

  return React.createElement(
    JsxParser,
    { components, jsx, disableFragments: true, renderInWrapper: false },
    null
  );
}

function extractJSX(root) {
  let jsx = "";

  if (root) {
    [...root.getElementsByTagName("script")].forEach(node => {
      jsx += node.innerHTML;
    });
  }

  return jsx
    .replace(/\n/g, "")
    .replace(/[\t ]+</g, "<")
    .replace(/>[\t ]+</g, "><")
    .replace(/>[\t ]+$/g, ">");
}

function escapeComments(jsx) {
  return jsx.replace(/<!--/g, "<XmlComment>").replace(/-->/g, "</XmlComment>");
}

function XmlComment({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    ReactDOM.unmountComponentAtNode(ref.current);
    ref.current.outerHTML = `<!--${children}-->`;
  });

  return React.createElement("div", { ref });
}
