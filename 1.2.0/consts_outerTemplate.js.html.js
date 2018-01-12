tui.util.defineNamespace("fedoc.content", {});
fedoc.content["consts_outerTemplate.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>'use strict';\n\n/**\n * Outer template\n * @type {{internalNode: string, leafNode: string}}\n */\nmodule.exports = {\n    INTERNAL_NODE:\n        '&lt;li id=\"{{id}}\" class=\"{{nodeClass}} {{stateClass}}\">' +\n            '{{innerTemplate}}' +\n        '&lt;/li>',\n    LEAF_NODE:\n        '&lt;li id=\"{{id}}\" class=\"{{nodeClass}} {{leafClass}}\">' +\n            '{{innerTemplate}}' +\n        '&lt;/li>'\n};\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"