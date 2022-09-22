"use strict";

const register = async () => {
    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        'id': 'zenkaku',
        'title': '全角へ変換する',
        'contexts': ['editable']
    });
    chrome.contextMenus.create({
        'id': 'hankaku',
        'title': '半角へ変換する',
        'contexts': ['editable']
    });
    chrome.contextMenus.create({
        'id': 'katakana',
        'title': 'カナへ変換する',
        'contexts': ['editable']
    });
};
chrome.runtime.onInstalled.addListener(register);
chrome.runtime.onStartup.addListener(register);

const executeScriptFunc = (menuItemId) => {
    const active = document.activeElement;
    if (!active) {
        return;
    }
    if (active.tabName !== 'textarea' && active.type !== 'text') {
        return;
    }
    if (!active.value) {
        return;
    }

    const exec = {
        'zenkaku': (value) =>
            value.replace(/[\w -]/g, (s) => ({
                ' ': '　'
            })[s] || String.fromCharCode(s.charCodeAt(0) + 0xFEE0))
        ,
        'hankaku': (value) =>
            value.replace(/[Ａ-Ｚａ-ｚ０-９＿　ー]/g, (s) =>
                ({
                    '　': ' '
                })[s] || String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
            )
        ,
        'katakana': (value) =>
            value.replace(
                /[ぁ-ん]/g, (s) =>
                    String.fromCharCode(s.charCodeAt(0) + 0x60)
            )
    };
    active.value = exec[menuItemId]?.(active.value);
};
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab) {
        return;
    }

    chrome.scripting.executeScript(
        {
            target: {tabId: tab.id},
            args: [info.menuItemId],
            func: executeScriptFunc,
        }
    );
});
