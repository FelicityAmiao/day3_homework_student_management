let createPanelByConfig = function(config, items) {
    return new Ext.Panel({ title: config.title, region: config.region, width: config.width, autoScroll: config.autoScroll || false, items: items });
}

Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';

    let contextmenu = new Ext.menu.Menu({
        id: 'theContextMenu',
        items: [{
            id: 'Add',
            text: 'Add',
        }],
        listeners: {
            itemclick: function(item) {
                let currNode = item.parentMenu.currNode;
                switch (item.id) {
                    case 'Add':
                        if (currNode.getDepth() == 0) {
                            addClassOrStudent(currNode, 'ClassX');
                        } else {
                            addClassOrStudent(currNode, 'StudentX');
                        }
                        break;
                }
            }
        }
    });

    let studentTreeCmp = new Ext.tree.TreePanel({
        id: 'studentTrepCmp',
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'school_data.txt'
        }),
        contextMenu: contextmenu,
        currNode: '',
        root: new Ext.tree.AsyncTreeNode({
            text: 'School',
            expandable: true,
            expanded: true,
            listeners: {
                click: function(node, e) {
                    node.getOwnerTree().currNode = node;
                },
                contextmenu: function(node, e) {
                    e.preventDefault();
                    node.select();
                    let ctxMenu = node.getOwnerTree().contextMenu;
                    ctxMenu.currNode = node;
                    ctxMenu.showAt(e.getXY());
                }
            }
        })
    });
    studentTreeCmp.expandAll();

    let addClassOrStudent = function(node, studentOrClassName) {
        switch (node.getDepth()) {
            case 0:
                node.appendChild(new Ext.tree.TreeNode({
                    text: studentOrClassName,
                    expandable: true,
                    expanded: true,
                    listeners: {
                        click: function(node, e) {
                            node.getOwnerTree().currNode = node;
                        },
                        contextmenu: function(node, e) {
                            e.preventDefault();
                            node.select();
                            node.getOwnerTree().currNode = node;
                            let ctxMenu = node.getOwnerTree().contextMenu;
                            ctxMenu.currNode = node;
                            ctxMenu.showAt(e.getXY());
                        }
                    }
                }));
                break;
            case 1:
                node.appendChild(new Ext.tree.TreeNode({
                    text: studentOrClassName,
                    listeners: {
                        click: function(node, e) {
                            node.getOwnerTree().currNode = node;
                        },
                        contextmenu: function(node, e) {
                            e.preventDefault();
                            node.select();
                            node.getOwnerTree().currNode = node;
                            let ctxMenu = node.getOwnerTree().contextMenu;
                            ctxMenu.currNode = node;
                            ctxMenu.showAt(e.getXY());
                        }
                    }
                }));
                break;
            case 2:
                node.parentNode.appendChild(new Ext.tree.TreeNode({
                    text: studentOrClassName,
                    listeners: {
                        click: function(node, e) {
                            node.getOwnerTree().currNode = node;
                        },
                        contextmenu: function(node, e) {
                            e.preventDefault();
                            node.select();
                            node.getOwnerTree().currNode = node;
                            let ctxMenu = node.getOwnerTree().contextMenu;
                            ctxMenu.currNode = node;
                            ctxMenu.showAt(e.getXY());
                        }
                    }
                }));
                break;
        }
    }

    let manageCmp = new Ext.form.FormPanel({
        items: [{
            xtype: 'fieldset',
            title: 'Add Student or Class',
            items: [{
                xtype: 'textfield',
                labelStyle: 'width: 200px;',
                width: 400,
                fieldLabel: 'Name of Class or Student',
                id: 'studentNameOrClassName',
                allowBlank: false,
                blankText: 'Please input class or student name first!'
            }, {
                xtype: 'button',
                text: 'add',
                listeners: {
                    click: function() {
                        if (Ext.getCmp('studentNameOrClassName').isValid()) {
                            let currNode = Ext.getCmp('studentTrepCmp').currNode;
                            if (currNode) {
                                addClassOrStudent(currNode, Ext.getCmp('studentNameOrClassName').getValue());
                            } else {
                                Ext.MessageBox.alert('Hint', 'Please select a class or student before add!');
                            }
                        } else {
                            Ext.MessageBox.alert('Hint', 'Please input class or student name first!');
                        }
                    }
                }
            }]
        }]
    });

    let treeEditor = new Ext.tree.TreeEditor(studentTreeCmp, { allowBlank: false });

    studentTreeCmp = createPanelByConfig({ region: 'west', width: 300, title: 'Student Info Panel', autoScroll: true }, [studentTreeCmp]);
    manageCmp = createPanelByConfig({ region: 'center', title: 'Student Management Panel' }, [manageCmp]);
    new Ext.Viewport({
        layout: 'border',
        items: [studentTreeCmp, manageCmp]
    });
});