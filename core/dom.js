MH.modules.define("core.dom", null, function MH$modules$define_moduleGetter_dom () {
	"use strict";

	var _win = MH.win,
		_doc = _win.document,
		_docHead = _doc.head,
		_docBody = _doc.body,
		_tempNode = _doc.createElement("tmp"),
		MH$core$dom;

	if ("complete" !== _doc.readyState) {
		_win.addEventListener("load", function MH$win$onload$listener () {
			_docHead = _docHead || (MH$core$dom.head = _doc.head);
			_docBody = _docBody || (MH$core$dom.body = _doc.body);
			_win.removeEventListener("load", MH$win$onload$listener);
		});
	}

	MH$core$dom = {
		doc: _doc,
		head: _docHead,
		body: _docBody,

		getAll: function MH$core$dom$getAll (selector, targetNode) {
			return (targetNode || _doc).querySelectorAll(selector);
		},
		getFirst: function MH$core$dom$getFirst (selector, targetNode) {
			return (targetNode || _doc).querySelector(selector);
		},

		create: function MH$core$dom$create (tagName, properties, children, parentNode) {
			var node = _doc.createElement(tagName),
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
		createFromOuterHtml: function MH$core$dom$createFromString (nodeOuterHtml, parentNode) {
			var nodes, i;

			_tempNode.innerHTML = nodeOuterHtml;
			nodes = _tempNode.childNodes;

			if (parentNode) {
				for (i = 0; i < nodes.length; i++) {
					parentNode.appendChild(nodes[i]);
				}
			}

			_tempNode.innerHTML = "";

			return nodes;
		},
		createFragment: function MH$core$dom$createFragment (nodesData /* Array of objects: { tagName, properties, children } */, parentNode) {
			var docFragment = _doc.createDocumentFragment(),
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

		copy: function MH$core$dom$copy (node, parentNode, makeItShallow) {
			var nodeCopy = node.cloneNode(!makeItShallow);
			if (parentNode) {
				parentNode.appendChild(nodeCopy);
			}
			return nodeCopy;
		},

		empty: function MH$core$dom$empty (node) {
			node.innerHTML = "";
		},

		remove: function (node) {
			node.parentNode.removeChild(node);
		}
	};

	return MH$core$dom;
});