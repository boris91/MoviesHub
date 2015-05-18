this["dom"] = (function () {
	"use strict";

	var $window = window,
		$document = $window.document,
		$dom = null,
		_docHead = $document.head,
		_docBody = $document.body,
		_tempNode = $document.createElement("tmp");

	if ("complete" !== $document.readyState) {
		$window.addEventListener("load", function window_onload_listener() {
			_docHead = _docHead || ($dom.head = $document.head);
			_docBody = _docBody || ($dom.body = $document.body);
			$window.removeEventListener("load", window_onload_listener);
		});
	}

	return $dom = {
		doc: $document,
		head: _docHead,
		body: _docBody,

		getAll: function dom_getAll(selector, targetNode) {
			return (targetNode || $document).querySelectorAll(selector);
		},
		getFirst: function dom_getFirst(selector, targetNode) {
			return (targetNode || $document).querySelector(selector);
		},

		create: function dom_create(tagName, properties, children, parentNode) {
			var node = $document.createElement(tagName),
				propName, i, childrenCount, childData;

			if (properties) {
				for (propName in properties) {
					node[propName] = properties[propName];
				}
			}

			if (children) {
				childrenCount = children.length;
				for (i = 0; i < childrenCount; i++) {
					childData = children[i];
					this.create(childData.tagName, childData.properties, childData.children, node);
				}
			}

			if (undefined !== parentNode) {
				parentNode.appendChild(node);
			}

			return node;
		},
		createFromOuterHtml: function dom_createFromString(nodeOuterHtml, parentNode) {
			var nodes = [],
				node, tempNodes, i;

			_tempNode.innerHTML = nodeOuterHtml;
			tempNodes = _tempNode.childNodes;

			if (parentNode) {
				for (i = 0; i < tempNodes.length; i++) {
					node = parentNode.appendChild(tempNodes[i]);
					nodes.push(node);
				}
			} else {
				for (i = 0; i < tempNodes.length; i++) {
					node = this.copy(tempNodes[i], null, true);
					nodes.push(node);
				}
			}

			_tempNode.innerHTML = "";

			return (1 === nodes.length) ? nodes[0] : nodes;
		},
		createFragment: function dom_createFragment(nodesData /* Array of objects: { tagName, properties, children } */, parentNode) {
			var docFragment = $document.createDocumentFragment(),
				nodesCount = nodesData.length,
				i, nodeData;

			for (i = 0; i < nodesCount; i++) {
				nodeData = nodesData[i];
				this.create(nodeData.tagName, nodeData.properties, nodeData.children, docFragment);
			}

			if (parentNode) {
				parentNode.appendChild(docFragment);
			}

			return docFragment;
		},

		copy: function dom_copy(node, parentNode, makeItShallow) {
			var nodeCopy = node.cloneNode(!makeItShallow);
			if (parentNode) {
				parentNode.appendChild(nodeCopy);
			}
			return nodeCopy;
		},

		empty: function dom_empty(node) {
			node.innerHTML = "";
		},

		remove: function (node) {
			var parentNode = node.parentNode;
			if (parentNode) {
				parentNode.removeChild(node);
			}
		}
	};
})();