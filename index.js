import React from "react";
import ReactDOM from "react-dom";
import JsxParser from "react-jsx-parser";

export let TEMPLATING_ERROR = /<!--.*ERROR MESSAGE STARTS HERE.*-->/;

/**
 * @param {{[key: string]: React.ElementType}} components
 * @param {Element} root
 * @param {() => void} [callback]
 * @returns {void}
 */
export function render(components, root, callback) {
  if (!TEMPLATING_ERROR.test(root.innerHTML)) {
    const restoreCallback = () => {
      restoreComments(root);
      if (callback instanceof Function) {
        callback();
      }
    };
    ReactDOM.render(parse(components, root), root, restoreCallback);
  }
}

function parse(components, root) {
  return parseJSX(components, escapeComments(extractJSX(root)));
}

function parseJSX(components, jsx) {
  return React.createElement(
    JsxParser,
    { components, jsx, disableFragments: true, renderInWrapper: false },
    null
  );
}

function escapeComments(jsx) {
  return jsx.replace(/<!--/g, "&lt;!--").replace(/-->/g, "--&gt;");
}

function extractJSX(root) {
  let jsx = "";
  if (root) {
    [...root.getElementsByTagName("script")].forEach((node) => {
      jsx += node.innerHTML;
    });
  }
  return jsx
    .replace(/\n/g, "")
    .replace(/[\t ]+\</g, "<")
    .replace(/\>[\t ]+\</g, "><")
    .replace(/\>[\t ]+$/g, ">");
}

function restoreComments(root) {
  if (root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (
        node.nodeValue &&
        node.nodeValue.includes("<!--") &&
        node.nodeValue.includes("-->")
      ) {
        const comments = node.nodeValue.trim().split(/<!--(.*?)-->/m);
        const nextSibling = node.nextSibling;
        comments.forEach((comment) => {
          if (comment.trim().length > 0) {
            const commentObject = document.createComment(comment);
            node.parentNode.insertBefore(commentObject, nextSibling);
            node.nodeValue = null;
          }
        });
      }
    }
  }
}
