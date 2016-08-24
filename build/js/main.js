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

// window.onresize = setHeight;
// document.addEventListener("DOMContentLoaded", setHeight);