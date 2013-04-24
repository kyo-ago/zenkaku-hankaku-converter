"use strict";

(function () {
	chrome.contextMenus.create({
		'id' : 'zenkaku',
		'title' : '全角へ変換する',
		'contexts' : ['editable']
	});
	chrome.contextMenus.create({
		'id' : 'hankaku',
		'title' : '半角へ変換する',
		'contexts' : ['editable']
	});
	var executeScript = {
		'zenkaku' : function () {
			var active = document.activeElement;
			if (!active) {
				return;
			}
			if (active.tabName !== 'textarea' && active.type !== 'text') {
				return;
			}
			if (!active.value) {
				return;
			}
			active.value = active.value.replace(/[\w -]/g, function(s) {
				return ({
					' ' : '　'
				})[s] || String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
			});
		},
		'hankaku' : function () {
			var active = document.activeElement;
			if (!active) {
				return;
			}
			if (active.tabName !== 'textarea' && active.type !== 'text') {
				return;
			}
			if (!active.value) {
				return;
			}
			active.value = active.value.replace(/[Ａ-Ｚａ-ｚ０-９＿　ー]/g, function(s) {
				return ({
					'　' : ' '
				})[s] || String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
			});
		}
	};
	chrome.contextMenus.onClicked.addListener(function (info, tab) {
		if (!tab) {
			return;
		}
		if (!executeScript[info.menuItemId]) {
			return;
		}
		chrome.tabs.executeScript(tab.id, {
			'code' : '( ' + executeScript[info.menuItemId] + ' )()'
		});
	});
})();
