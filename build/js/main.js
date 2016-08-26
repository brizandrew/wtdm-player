var ac = require('./audioControls.js');

function getPageSize() {
	return {
		height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
		width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	};
}

function setHeight(){
	var pages = document.getElementsByClassName('page');
	pageSize = getPageSize();
	for (var i = 0; i < pages.length; i++) {
		pages[i].style.width = pageSize.width + 'px';
		pages[i].style.height = (pageSize.height - 75) + 'px';
	}
}

function getJSON(name){
	var req = new XMLHttpRequest();
	req.open("GET", name, true);
	req.addEventListener("load", function() {
		db = JSON.parse(req.responseText);
		window.dispatchEvent(new Event('JSON_load'));
	});
	req.send(null);
}

var db;
getJSON('wtdm-db.json');
window.addEventListener('JSON_load', function(){
	console.log(db);
});

ac._init();
console.log(ac.ele);

// window.onresize = setHeight;
// document.addEventListener("DOMContentLoaded", setHeight);