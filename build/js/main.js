var wtdmPlayer = {
	ac: require('./audioControls.js'),

	mod: require('./modal.js'),

	init: function(){
		var self = this;

		// initializing object properties
		this.episodes = {};
		this.episodePage = document.getElementById('episode-page');
		this.nowPlayingId = '';

		// loading JSON database
		this.loadDB();
		window.addEventListener('JSON_load', function(){
			console.log(self.episodes);

			// Add an episode entry for every episode
			var episode;
			for(episode in self.episodes){
				var epiElement = self.newEpisodeEntry(self.episodes[episode]);
				document.getElementById('episode-list').appendChild(epiElement);
			}

			self.handleURL();
			document.getElementById('page-frame').style.display = 'block';
			document.getElementById('loading').style.display = 'none';
		});

		// initializing audio controls
		this.ac.init();
		document.body.appendChild(this.ac.ele);

		// initializing modal
		this.mod.init({
			name: 'Share',
			tabs: {
				Tab1: '<p>Copy and paste this link to share the episode at this time:</p><input></input>'
			},
			buttons: ['Close']
		});
		document.body.appendChild(this.mod.ele);
		this.mod.buttons.Close.addEventListener('click', function(){self.mod.toggle();});

		// initializing episode content
		this.episodeContent = this.newElement({
			name: 'div',
			id: 'episode-content',
			appendTo: this.episodePage
		});

		// handling pop states
		window.addEventListener('popstate', function(){
			self.handleURL();
		});

		// initializing navigation buttons
		document.getElementById('episode-nav-button-back').addEventListener('click', function(){
			self.goHome();
			history.pushState(null, 'WTDM Player', 'index.html');
		});
		document.getElementById('episode-nav-button-share').addEventListener('click', function(){
			var currentTime = Math.floor(self.ac.audio.currentTime);
			var queryString = '?id=' + self.nowPlayingId + '&t=' + currentTime;
			var currentUrl = self.utils.parseURL(window.location.href);
			var shareURL = currentUrl.protocol + '//' + currentUrl.host + currentUrl.pathname + queryString;
			var input = self.mod.tabs[0].querySelector('input');
			input.value = shareURL;
			self.mod.toggle();
		});
	},

	loadDB: function(){
		var self = this;
		var req = new XMLHttpRequest();
		req.open("GET", 'wtdm-db.json', true);
		req.addEventListener("load", function() {
			// load database
			var db = JSON.parse(req.responseText);

			// make database searchable by id
			for (var i = 0; i < db.episodes.length; i++) {
				var id = db.episodes[i].id;
				self.episodes[id] = db.episodes[i];
			}

			// dispatch finish event
			window.dispatchEvent(new Event('JSON_load'));
		});
		req.send(null);
	},

	newElement: function(config){
		if(config.name === undefined){
			throw new Error('New Element: element node needs name.');
		}
		else if(typeof(config.name) != 'string'){
			throw new Error('New Element: all parameters must be strings.');
		}
		else{
			var ele;
			if(config.name.toLowerCase() == 'svg')
				ele = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			else if(config.name.toLowerCase() == 'path')
				ele = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			else
				ele = document.createElement(config.name);

			if(typeof(config.name) != 'string')
				throw new Error('New Element: all parameters must be strings.');
			else if(config.id !== undefined)
				ele.id = config.id;

			if(typeof(config.name) != 'string')
				throw new Error('New Element: all parameters must be strings.');
			else if(config.className !== undefined)
				ele.className = config.className;

			if(config.appendTo !== undefined)
				config.appendTo.appendChild(ele);

			if(config.innerHTML !== undefined)
				ele.innerHTML = config.innerHTML;

			if(config.attrs !== undefined){
				if(config.name.toLowerCase() == 'svg' || config.name.toLowerCase() == 'path'){
					for(var attrNS in config.attrs){
						ele.setAttributeNS(null, attrNS, config.attrs[attrNS]);
					}
				}
				else{
					for(var attr in config.attrs){
						ele.setAttribute(attr, config.attrs[attr]);
					}
				}
			}

			return ele;
		}
	},

	newEpisodeEntry: function(config){
		var self = this;
		var ele = this.newElement({
			name: 'div',
			className: 'episode-data',
		});

		var img = this.newElement({
			name: 'img',
			appendTo: ele,
			attrs: {
				src: config.cover
			}
		});

		var title = this.newElement({
			name: 'h4',
			appendTo: ele,
			innerHTML: config.name
		});

		var description = this.newElement({
			name: 'p',
			appendTo: ele,
			innerHTML: config.description
		});

		ele.addEventListener('click', function(){
			self.goToEpisode(config.id);
			history.pushState(null, config.name, '?id=' + config.id);
		});

		return ele; 
	},

	goToEpisode: function(id){
		var self = this;
		this.episodePage.removeChild(this.episodeContent);
		var config = this.episodes[id];

		document.getElementById('episode-nav-title').innerHTML = 'WTDM / ' + config.name;
		
		this.episodeContent = this.newElement({
			name: 'div',
			id: 'episode-content',
			appendTo: this.episodePage
		});

		var episodeContentCover = this.newElement({
			name: 'div',
			id: 'episode-content-cover',
			attrs: {
				style: "background-image: url('"+config.cover+"')"
			},
			appendTo: this.episodeContent
		});

		if(this.nowPlayingId != id){
			var episodeContentPlay = this.newElement({
				name: 'div',
				id: 'episode-content-play',
				innerHTML: '<svg viewBox="0 0 15 16"><path d="M0,0 L7,3.74 7,12.28 0,16 M7,3.74 L15,8 15,8 7,12.28"></path></svg><p>Play Episode</p>',
				appendTo: episodeContentCover
			});

			// var episodeContentPlaySVG = this.newElement({
			// 	name: 'svg',
			// 	attrs: {
			// 		viewBox: '0 0 15 16'
			// 	},
			// 	innerHTML: '<path d="M0,0 L7,3.74 7,12.28 0,16 M7,3.74 L15,8 15,8 7,12.28"></path>',
			// 	appendTo: episodeContentPlay
			// });

			episodeContentPlay.addEventListener('click',function(){
				episodeContentPlay.style.display = 'none';
				self.ac.load(self.episodes[id]);
				self.ac.play();
				self.nowPlayingId = id;
			});
		}

		var episodeContentText = this.newElement({
			name: 'div',
			className: 'copy',
			id: 'episode-content-text',
			innerHTML: config.content,
			appendTo: this.episodeContent
		});

		document.getElementById('episode-page').style.transform = 'translate(0px,0px)';
		document.getElementById('home-page').style.transform = 'translate(-103%,0px)';
	},

	goHome: function(){
		document.getElementById('episode-page').style.transform = 'translate(103%,0px)';
		document.getElementById('home-page').style.transform = 'translate(0,0px)';
	},

	handleURL: function(){
		var url = this.utils.parseURL(window.location.href);

		var pageId = url.query.id;
		if(pageId !== undefined)
			this.goToEpisode(pageId);
		else
			this.goHome();

		var second = url.query.t;
		if(second !== undefined){
			this.ac.audio.currentTime = second;
		}
	},

	utils: {
		parseURL: function(url){
			var parser = document.createElement('a');
			parser.href = url;
			var query_string = {};
			var query = parser.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if (typeof query_string[pair[0]] === "undefined") {
					query_string[pair[0]] = decodeURIComponent(pair[1]);
				} else if (typeof query_string[pair[0]] === "string") {
					var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
					query_string[pair[0]] = arr;
				} else {
					query_string[pair[0]].push(decodeURIComponent(pair[1]));
				}
			} 
			return {
				'protocol':parser.protocol,
				'hostname':parser.hostname,
				'port':parser.port,
				'pathname':parser.pathname,
				'hash':parser.hash,
				'host':parser.host,
				'query':query_string
			};
		}
	}
};

wtdmPlayer.init();



// function getPageSize() {
// 	return {
// 		height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
// 		width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
// 	};
// }

// function setHeight(){
// 	var pages = document.getElementsByClassName('page');
// 	pageSize = getPageSize();
// 	for (var i = 0; i < pages.length; i++) {
// 		pages[i].style.width = pageSize.width + 'px';
// 		pages[i].style.height = (pageSize.height - 75) + 'px';
// 	}
// }

// window.onresize = setHeight;
// document.addEventListener("DOMContentLoaded", setHeight);