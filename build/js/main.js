var wtdmPlayer = {
	ac: require('./audioControls.js'),
	rv: require('./responsiveVideo.js'),
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

		// initializing responsive video
		this.rv.init();

		// handling pop states
		window.addEventListener('popstate', function(){
			self.handleURL();
		});

		// initializing navigation buttons
		document.getElementById('home-nav-button-about').addEventListener('click',function(){self.toggleAbout();});
		document.getElementById('episode-nav-button-back').addEventListener('click', function(){
			history.pushState(null, null, 'index.html');
			self.goHome();
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

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
				if (xmlhttp.status == 200) {
					var db = JSON.parse(xmlhttp.responseText);
					
					// make database searchable by id
					for (var i = 0; i < db.length; i++) {
						var id = db[i].pageId;
						self.episodes[id] = db[i];
						self.episodes[id].id = id;
					}
					
					// dispatch finish event
					window.dispatchEvent(new Event('JSON_load'));
				}
				else if (xmlhttp.status == 400) {
					throw new Error('load.php: GET request returned error 400.');
				}
				else {
					throw new Error('load.php: GET request returned error.');
				}
			}
		};
		xmlhttp.open("GET", 'load.php', true);
		xmlhttp.send();
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
			history.pushState(null, null, '?id=' + config.id);
			self.goToEpisode(config.id);
		});

		return ele; 
	},

	goToEpisode: function(id){
		var self = this;
		this.episodePage.removeChild(this.episodeContent);
		var config = this.episodes[id];

		document.getElementById('episode-nav-title').innerHTML = config.name;
		
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

			episodeContentPlay.addEventListener('click',function(){
				episodeContentPlay.style.display = 'none';
				self.ac.load(self.episodes[id]);
				self.ac.play();
				self.nowPlayingId = id;
			});
		}

		var episodeContentMore = this.newElement({
			name: 'div',
			id: 'episode-content-more',
			innerHTML: '<svg version="1.1" viewBox="0 0 24 11"><polyline stroke="rgb(30, 115, 190)" stroke-width="3" fill="transparent" points="1 9, 12 3, 23 9"></polyline></svg><p>READ</p>',
			appendTo: episodeContentCover
		});

		var content = window.atob(config.content);
		var episodeContentText = this.newElement({
			name: 'div',
			className: 'copy',
			id: 'episode-content-text',
			innerHTML: content,
			appendTo: this.episodeContent
		});

		// hack to fix weird bug where clientWidth isn't ready immediately
		setTimeout(function(){self.rv.resize();},1);

		document.getElementById('episode-page').style.transform = 'translate(0px,0px)';
		document.getElementById('home-page').style.transform = 'translate(-103%,0px)';
		document.getElementsByTagName('title')[0].innerHTML = 'WTDM | ' + config.name;
	},

	goHome: function(){
		document.getElementById('episode-page').style.transform = 'translate(103%,0px)';
		document.getElementById('home-page').style.transform = 'translate(0,0px)';
		document.getElementsByTagName('title')[0].innerHTML = 'WTDM';
	},

	handleURL: function(){
		var url = this.utils.parseURL(window.location.href);
		var pageId = url.query.id;
		var second = url.query.t;
		
		if(second !== undefined){
			this.ac.load(this.episodes[pageId]);
			this.nowPlayingId = pageId;
			this.ac.audio.currentTime = second;
		}

		if(pageId !== undefined)
			this.goToEpisode(pageId);
		else
			this.goHome();
	},

	toggleAbout: function(){
		var button = document.getElementById('home-nav-button-about');
		var about = document.getElementById('home-about-container');
		var infoIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 281.89 281.89"><path class="cls-1" d="M263.42,162.61a140.95,140.95,0,1,0,140.94,141A141,141,0,0,0,263.42,162.61Zm-2.68,68.25c9.26,0,14.81,6.37,14.81,14.81,0,8.22-5.76,14.6-14.81,14.6-9.25,0-14.6-6.38-14.6-14.6C246.14,237.23,251.69,230.86,260.74,230.86ZM291,373.18q0,3.07-3.09,3.08h-49c-2,0-3.08-.82-3.08-3.08V363.1q0-3.09,3.08-3.09h13V291.32H240.79c-2,0-3.08-.82-3.08-3.08v-10.7q0-3.07,3.08-3.08h31.06c2.26,0,3.08,1,3.08,3.08V360h13c2.06,0,3.09.83,3.09,3.09v10.08Z" transform="translate(-122.47 -162.61)"/></svg>';
		var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 281.89 281.89"><path class="cls-1" d="M256.61,120.09A140.95,140.95,0,1,0,397.55,261,141,141,0,0,0,256.61,120.09ZM288,320.73l-24.51-37.1-6.52-10-31.36,47.1h-24.5l43.61-62-40.35-57.33h25.29l18.32,28q5.18,8,8.32,13.38,4.93-7.43,9.1-13.16l20.13-28.21h24.16l-41.25,56.2,44.4,63.18H288Z" transform="translate(-115.66 -120.09)"/></svg>';

		if(about.style.display == 'none'){
			about.style.display = 'block';
			button.innerHTML = closeIcon;
		}
		else{
			about.style.display = 'none';
			button.innerHTML = infoIcon;
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