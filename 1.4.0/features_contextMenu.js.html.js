tui.util.defineNamespace("fedoc.content", {});
fedoc.content["features_contextMenu.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>'use strict';\nvar util = require('./../util');\n\nvar API_LIST = [\n    'changeContextMenu'\n];\nvar TuiContextMenu = tui &amp;&amp; tui.component &amp;&amp; tui.component.ContextMenu;\nvar styleKeys = ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect'];\nvar enableProp = util.testProp(styleKeys);\nvar bind = tui.util.bind;\n\n/**\n * Set ContextMenu feature on tree\n * @class ContextMenu\n * @constructor\n * @param {Tree} tree - Tree\n * @param {Object} options - Options\n *     @param {Array.&lt;Object>} options.menuData - Context menu data\n */\nvar ContextMenu = tui.util.defineClass(/** @lends ContextMenu.prototype */{/*eslint-disable*/\n    static: {\n        /**\n         * @static\n         * @memberOf ContextMenu\n         * @returns {Array.&lt;string>} API list of ContextMenu\n         */\n        getAPIList: function() {\n            return API_LIST.slice();\n        }\n    },\n    init: function(tree, options) { /*eslint-enable*/\n        options = options || {};\n\n        /**\n         * Tree data\n         * @type {Tree}\n         */\n        this.tree = tree;\n\n        /**\n         * Tree selector for context menu\n         */\n        this.treeSelector = '#' + this.tree.rootElement.id;\n\n        /**\n         * Id of floating layer in tree\n         * @type {string}\n         */\n        this.flId = this.tree.rootElement.id + '-fl';\n\n        /**\n         * Info of context menu in tree\n         * @type {Object}\n         */\n        this.menu = this._generateContextMenu();\n\n        /**\n         * Floating layer element\n         * @type {HTMLElement}\n         */\n        this.flElement = document.getElementById(this.flId);\n\n        /**\n         * Id of selected tree item\n         * @type {string}\n         */\n        this.selectedNodeId = null;\n\n        this.menu.register(this.treeSelector, bind(this._onSelect, this),\n                            options.menuData || {});\n\n        this.tree.on('contextmenu', this._onContextMenu, this);\n\n        this._preventTextSelection();\n\n        this._setAPIs();\n    },\n\n    /**\n     * Change current context-menu view\n     * @api\n     * @memberOf Tree.prototype\n     * @requires ContextMenu\n     * @param {Array.&lt;Object>} newMenuData - New context menu data\n     * @example\n     * tree.changeContextMenu([\n     *      {title: 'menu1'},\n     *      {title: 'menu2', disable: true},\n     *      {title: 'menu3', menu: [\n     *      \t{title: 'submenu1', disable: true},\n     *      \t{title: 'submenu2'}\n     *      ]}\n     * ]);\n     */\n    changeContextMenu: function(newMenuData) {\n        this.menu.unregister(this.treeSelector);\n        this.menu.register(this.treeSelector, bind(this._onSelect, this), newMenuData);\n    },\n\n    /**\n     * Disable ContextMenu feature\n     */\n    destroy: function() {\n        var tree = this.tree;\n\n        this.menu.destroy();\n\n        this._restoreTextSelection();\n        this._removeFloatingLayer();\n\n        tree.off(this);\n\n        tui.util.forEach(API_LIST, function(apiName) {\n            delete tree[apiName];\n        });\n    },\n\n    /**\n     * Create floating layer for context menu\n     * @private\n     */\n    _createFloatingLayer: function() {\n        this.flElement = document.createElement('div');\n        this.flElement.id = this.flId;\n\n        document.body.appendChild(this.flElement);\n    },\n\n    /**\n     * Remove floating layer for context menu\n     * @private\n     */\n    _removeFloatingLayer: function() {\n        document.body.removeChild(this.flElement);\n        this.flElement = null;\n    },\n\n    /**\n     * Generate context menu in tree\n     * @returns {TuiContextMenu} Instance of TuiContextMenu\n     * @private\n     */\n    _generateContextMenu: function() {\n        if (!this.flElement) {\n            this._createFloatingLayer();\n        }\n\n        return new TuiContextMenu(this.flElement);\n    },\n\n    /**\n     * Prevent text selection on selected tree item\n     * @private\n     */\n    _preventTextSelection: function() {\n        if (enableProp) {\n            this.tree.rootElement.style[enableProp] = 'none';\n        }\n    },\n\n    /**\n     * Restore text selection on selected tree item\n     * @private\n     */\n    _restoreTextSelection: function() {\n        if (enableProp) {\n            this.tree.rootElement.style[enableProp] = '';\n        }\n    },\n\n    /**\n     * Event handler on tree item\n     * @param {MouseEvent} e - Mouse event\n     * @private\n     */\n    _onContextMenu: function(e) {\n        var target = util.getTarget(e);\n\n        this.selectedNodeId = this.tree.getNodeIdFromElement(target);\n\n        /**\n         * @api\n         * @event Tree#beforeOpenContextMenu\n         * @param {string} nodeId - Current selected node id\n         * @example\n         * tree.on('beforeOpenContextMenu', function(nodeId) {\n         *     console.log('nodeId: ' + nodeId);\n         * });\n         */\n        this.tree.fire('beforeOpenContextMenu', this.selectedNodeId);\n    },\n\n    /**\n     * Event handler on context menu\n     * @param {MouseEvent} e - Mouse event\n     * @param {string} cmd - Options value of selected context menu (\"title\"|\"command\")\n     * @private\n     */\n    _onSelect: function(e, cmd) {\n        /**\n         * @api\n         * @event Tree#selectContextMenu\n         * @param {{cmd: string, nodeId: string}} treeEvent - Tree event\n         * @example\n         * tree.on('selectContextMenu', function(treeEvent) {\n         *     var cmd = treeEvent.cmd; // key of context menu's data\n         *     var nodeId = treeEvent.nodeId;\n         *\n         *     console.log(cmd, nodeId);\n         * });\n         */\n        this.tree.fire('selectContextMenu', {\n            cmd: cmd,\n            nodeId: this.selectedNodeId\n        });\n    },\n\n    /**\n     * Set API of ContextMenu feature\n     * @private\n     */\n    _setAPIs: function() {\n        var tree = this.tree;\n\n        tui.util.forEach(API_LIST, function(apiName) {\n            tree[apiName] = bind(this[apiName], this);\n        }, this);\n    }\n});\n\nmodule.exports = ContextMenu;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"