var data = {
    addNodeCache: function (setting, node) {
        data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = node;
    },
    getNodeCacheId: function (tId) {
        return tId.substring(tId.lastIndexOf("_") + 1);
    },
    addAfterA: function (afterA) {
        _init.afterA.push(afterA);
    },
    addBeforeA: function (beforeA) {
        _init.beforeA.push(beforeA);
    },
    addInnerAfterA: function (innerAfterA) {
        _init.innerAfterA.push(innerAfterA);
    },
    addInnerBeforeA: function (innerBeforeA) {
        _init.innerBeforeA.push(innerBeforeA);
    },
    addInitBind: function (bindEvent) {
        _init.bind.push(bindEvent);
    },
    addInitUnBind: function (unbindEvent) {
        _init.unbind.push(unbindEvent);
    },
    addInitCache: function (initCache) {
        _init.caches.push(initCache);
    },
    addInitNode: function (initNode) {
        _init.nodes.push(initNode);
    },
    addInitProxy: function (initProxy, isFirst) {
        if (!!isFirst) {
            _init.proxys.splice(0, 0, initProxy);
        } else {
            _init.proxys.push(initProxy);
        }
    },
    addInitRoot: function (initRoot) {
        _init.roots.push(initRoot);
    },
    addNodesData: function (setting, parentNode, index, nodes) {
        var children = data.nodeChildren(setting, parentNode), params;
        if (!children) {
            children = data.nodeChildren(setting, parentNode, []);
            index = -1;
        } else if (index >= children.length) {
            index = -1;
        }

        if (children.length > 0 && index === 0) {
            children[0].isFirstNode = false;
            view.setNodeLineIcos(setting, children[0]);
        } else if (children.length > 0 && index < 0) {
            children[children.length - 1].isLastNode = false;
            view.setNodeLineIcos(setting, children[children.length - 1]);
        }
        data.nodeIsParent(setting, parentNode, true);

        if (index < 0) {
            data.nodeChildren(setting, parentNode, children.concat(nodes));
        } else {
            params = [index, 0].concat(nodes);
            children.splice.apply(children, params);
        }
    },
    addSelectedNode: function (setting, node) {
        var root = data.getRoot(setting);
        if (!data.isSelectedNode(setting, node)) {
            root.curSelectedList.push(node);
        }
    },
    addCreatedNode: function (setting, node) {
        if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
            var root = data.getRoot(setting);
            root.createdNodes.push(node);
        }
    },
    addZTreeTools: function (zTreeTools) {
        _init.zTreeTools.push(zTreeTools);
    },
    exSetting: function (s) {
        $.extend(true, _setting, s);
    },
    fixPIdKeyValue: function (setting, node) {
        if (setting.data.simpleData.enable) {
            node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPId;
        }
    },
    getAfterA: function (setting, node, array) {
        for (var i = 0, j = _init.afterA.length; i < j; i++) {
            _init.afterA[i].apply(this, arguments);
        }
    },
    getBeforeA: function (setting, node, array) {
        for (var i = 0, j = _init.beforeA.length; i < j; i++) {
            _init.beforeA[i].apply(this, arguments);
        }
    },
    getInnerAfterA: function (setting, node, array) {
        for (var i = 0, j = _init.innerAfterA.length; i < j; i++) {
            _init.innerAfterA[i].apply(this, arguments);
        }
    },
    getInnerBeforeA: function (setting, node, array) {
        for (var i = 0, j = _init.innerBeforeA.length; i < j; i++) {
            _init.innerBeforeA[i].apply(this, arguments);
        }
    },
    getCache: function (setting) {
        return caches[setting.treeId];
    },
    getNodeIndex: function (setting, node) {
        if (!node) return null;
        var p = node.parentTId ? node.getParentNode() : data.getRoot(setting),
            children = data.nodeChildren(setting, p);
        for (var i = 0, l = children.length - 1; i <= l; i++) {
            if (children[i] === node) {
                return i;
            }
        }
        return -1;
    },
    getNextNode: function (setting, node) {
        if (!node) return null;
        var p = node.parentTId ? node.getParentNode() : data.getRoot(setting),
            children = data.nodeChildren(setting, p);
        for (var i = 0, l = children.length - 1; i <= l; i++) {
            if (children[i] === node) {
                return (i == l ? null : children[i + 1]);
            }
        }
        return null;
    },
    getNodeByParam: function (setting, nodes, key, value) {
        if (!nodes || !key) return null;
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            if (node[key] == value) {
                return nodes[i];
            }
            var children = data.nodeChildren(setting, node);
            var tmp = data.getNodeByParam(setting, children, key, value);
            if (tmp) return tmp;
        }
        return null;
    },
    getNodeCache: function (setting, tId) {
        if (!tId) return null;
        var n = caches[setting.treeId].nodes[data.getNodeCacheId(tId)];
        return n ? n : null;
    },
    getNodePath: function (setting, node) {
        if (!node) return null;

        var path;
        if (node.parentTId) {
            path = node.getParentNode().getPath();
        } else {
            path = [];
        }

        if (path) {
            path.push(node);
        }

        return path;
    },
    getNodes: function (setting) {
        return data.nodeChildren(setting, data.getRoot(setting));
    },
    getNodesByParam: function (setting, nodes, key, value) {
        if (!nodes || !key) return [];
        var result = [];
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            if (node[key] == value) {
                result.push(node);
            }
            var children = data.nodeChildren(setting, node);
            result = result.concat(data.getNodesByParam(setting, children, key, value));
        }
        return result;
    },
    getNodesByParamFuzzy: function (setting, nodes, key, value) {
        if (!nodes || !key) return [];
        var result = [];
        value = value.toLowerCase();
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            if (typeof node[key] == "string" && nodes[i][key].toLowerCase().indexOf(value) > -1) {
                result.push(node);
            }
            var children = data.nodeChildren(setting, node);
            result = result.concat(data.getNodesByParamFuzzy(setting, children, key, value));
        }
        return result;
    },
    getNodesByFilter: function (setting, nodes, filter, isSingle, invokeParam) {
        if (!nodes) return (isSingle ? null : []);
        var result = isSingle ? null : [];
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            if ($.apply(filter, [node, invokeParam], false)) {
                if (isSingle) {
                    return node;
                }
                result.push(node);
            }
            var children = data.nodeChildren(setting, node);
            var tmpResult = data.getNodesByFilter(setting, children, filter, isSingle, invokeParam);
            if (isSingle && !!tmpResult) {
                return tmpResult;
            }
            result = isSingle ? tmpResult : result.concat(tmpResult);
        }
        return result;
    },
    getPreNode: function (setting, node) {
        if (!node) return null;
        var p = node.parentTId ? node.getParentNode() : data.getRoot(setting),
            children = data.nodeChildren(setting, p);
        for (var i = 0, l = children.length; i < l; i++) {
            if (children[i] === node) {
                return (i == 0 ? null : children[i - 1]);
            }
        }
        return null;
    },
    getRoot: function (setting) {
        return setting ? roots[setting.treeId] : null;
    },
    getRoots: function () {
        return roots;
    },
    getSetting: function (treeId) {
        return settings[treeId];
    },
    getSettings: function () {
        return settings;
    },
    getZTreeTools: function (treeId) {
        var r = this.getRoot(this.getSetting(treeId));
        return r ? r.treeTools : null;
    },
    initCache: function (setting) {
        for (var i = 0, j = _init.caches.length; i < j; i++) {
            _init.caches[i].apply(this, arguments);
        }
    },
    initNode: function (setting, level, node, parentNode, preNode, nextNode) {
        for (var i = 0, j = _init.nodes.length; i < j; i++) {
            _init.nodes[i].apply(this, arguments);
        }
    },
    initRoot: function (setting) {
        for (var i = 0, j = _init.roots.length; i < j; i++) {
            _init.roots[i].apply(this, arguments);
        }
    },
    isSelectedNode: function (setting, node) {
        var root = data.getRoot(setting);
        for (var i = 0, j = root.curSelectedList.length; i < j; i++) {
            if (node === root.curSelectedList[i]) return true;
        }
        return false;
    },
    nodeChildren: function (setting, node, newChildren) {
        if (!node) {
            return null;
        }
        var key = setting.data.key.children;
        if (typeof newChildren !== 'undefined') {
            node[key] = newChildren;
        }
        return node[key];
    },
    nodeIsParent: function (setting, node, newIsParent) {
        if (!node) {
            return false;
        }
        var key = setting.data.key.isParent;
        if (typeof newIsParent !== 'undefined') {
            if (typeof newIsParent === "string") {
                newIsParent = $.eqs(newIsParent, "true");
            }
            newIsParent = !!newIsParent;
            node[key] = newIsParent;
        }
        return node[key];
    },
    nodeName: function (setting, node, newName) {
        var key = setting.data.key.name;
        if (typeof newName !== 'undefined') {
            node[key] = newName;
        }
        return "" + node[key];
    },
    nodeTitle: function (setting, node) {
        var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
        return "" + node[t];
    },
    removeNodeCache: function (setting, node) {
        var children = data.nodeChildren(setting, node);
        if (children) {
            for (var i = 0, l = children.length; i < l; i++) {
                data.removeNodeCache(setting, children[i]);
            }
        }
        data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = null;
    },
    removeSelectedNode: function (setting, node) {
        var root = data.getRoot(setting);
        for (var i = 0, j = root.curSelectedList.length; i < j; i++) {
            if (node === root.curSelectedList[i] || !data.getNodeCache(setting, root.curSelectedList[i].tId)) {
                root.curSelectedList.splice(i, 1);
                setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, node]);
                i--;
                j--;
            }
        }
    },
    setCache: function (setting, cache) {
        caches[setting.treeId] = cache;
    },
    setRoot: function (setting, root) {
        roots[setting.treeId] = root;
    },
    setZTreeTools: function (setting, zTreeTools) {
        for (var i = 0, j = _init.zTreeTools.length; i < j; i++) {
            _init.zTreeTools[i].apply(this, arguments);
        }
    },
    transformToArrayFormat: function (setting, nodes) {
        if (!nodes) return [];
        var r = [];
        if ($.isArray(nodes)) {
            for (var i = 0, l = nodes.length; i < l; i++) {
                var node = nodes[i];
                _do(node);
            }
        } else {
            _do(nodes);
        }
        return r;

        function _do(_node) {
            r.push(_node);
            var children = data.nodeChildren(setting, _node);
            if (children) {
                r = r.concat(data.transformToArrayFormat(setting, children));
            }
        }
    },
    transformTozTreeFormat: function (setting, sNodes) {
        var i, l,
            key = setting.data.simpleData.idKey,
            parentKey = setting.data.simpleData.pIdKey;
        if (!key || key == "" || !sNodes) return [];

        if ($.isArray(sNodes)) {
            var r = [];
            var tmpMap = {};
            for (i = 0, l = sNodes.length; i < l; i++) {
                tmpMap[sNodes[i][key]] = sNodes[i];
            }
            for (i = 0, l = sNodes.length; i < l; i++) {
                var p = tmpMap[sNodes[i][parentKey]];
                if (p && sNodes[i][key] != sNodes[i][parentKey]) {
                    var children = data.nodeChildren(setting, p);
                    if (!children) {
                        children = data.nodeChildren(setting, p, []);
                    }
                    children.push(sNodes[i]);
                } else {
                    r.push(sNodes[i]);
                }
            }
            return r;
        } else {
            return [sNodes];
        }
    }
}

export default data