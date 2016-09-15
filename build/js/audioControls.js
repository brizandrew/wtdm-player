module.exports = {
	_icons: {
		shuttleBack: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.73 105.75"><path d="M139.06,184.64a52.87,52.87,0,0,1-86.82,40.54l7.08-6.84a43.09,43.09,0,1,0,2-68.91l6.11,2.27,0,0L59.86,158l4.24,1.57L45.4,175l-0.48-2.84-2.85-16.73-0.74-4.37,3.07,1.14L46.34,153,45.9,150.4l-1.2-7.07v-0.08l6,2.22A52.88,52.88,0,0,1,139.06,184.64Z" transform="translate(-41.33 -131.77)"/><path d="M79.64,169.82c-0.47,2.24-1.17,3.67-2.12,4.27a12.38,12.38,0,0,1-5,1.28v2.8h6.2v20.56h3.53V169.82H79.64Z" transform="translate(-41.33 -131.77)"/><path d="M102,182.53a8.78,8.78,0,0,0-9.55-1.91,8.34,8.34,0,0,0-1.74,1.16l1.12-8.07H103v-3.53H89.37l-2,15.63L90.23,186a6.51,6.51,0,0,1,2.09-2,5.94,5.94,0,0,1,7,.93,6.34,6.34,0,0,1,1.68,4.71,7.9,7.9,0,0,1-1.42,4.58,4.89,4.89,0,0,1-4.35,2.06,6,6,0,0,1-2.73-.6,5.12,5.12,0,0,1-2.63-4.32H86.41q0.29,4.14,2.76,6.13a8.82,8.82,0,0,0,5.69,2c3.38,0,5.83-1,7.37-3.14a12,12,0,0,0,2.31-7.26A9,9,0,0,0,102,182.53Z" transform="translate(-41.33 -131.77)"/></svg>',
		shuttleForward: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.73 105.75"><path d="M326.34,178v-2.8a12.47,12.47,0,0,0,5-1.29q1.42-.9,2.11-4.27h2.61v28.91h-3.53V178h-6.2Z" transform="translate(-291.85 -131.94)"/><path d="M343.66,191.15a5.08,5.08,0,0,0,2.63,4.32,5.85,5.85,0,0,0,2.72.61,4.92,4.92,0,0,0,4.36-2.07,7.93,7.93,0,0,0,1.42-4.58,6.32,6.32,0,0,0-1.68-4.7,5.54,5.54,0,0,0-4-1.66,5.62,5.62,0,0,0-2.93.73,6.52,6.52,0,0,0-2.09,2l-2.87-.18,2-15.63h13.68v3.53h-11.2l-1.12,8.07a7.18,7.18,0,0,1,5.15-1.82,8.27,8.27,0,0,1,6.14,2.57,9,9,0,0,1,2.52,6.53,11.94,11.94,0,0,1-2.31,7.26q-2.31,3.14-7.36,3.14a8.8,8.8,0,0,1-5.69-2,8.21,8.21,0,0,1-2.77-6.13h3.44Z" transform="translate(-291.85 -131.94)"/><path d="M291.85,184.82a52.87,52.87,0,0,0,86.82,40.54l-7.08-6.84a43.09,43.09,0,1,1-2-68.91l-6.11,2.27,0,0,7.54,6.24-4.24,1.57,18.7,15.49,0.48-2.84,2.85-16.73,0.74-4.37-3.07,1.14-1.94.72,0.44-2.57,1.2-7.07v-0.08l-6,2.22A52.88,52.88,0,0,0,291.85,184.82Z" transform="translate(-291.85 -131.94)"/></svg>',
		play: 'M0,0 L7,3.74 7,12.28 0,16 M7,3.74 L15,8 15,8 7,12.28',
		pause: 'M0,0 L6,0 6,16 0,16 M9,0 L15,0 15,16 9,16'
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

	init: function (argument) {
		var self = this;

		this.createDOM();
		this.currentSecond = 0;
		this.timeChange = new Event('timeChange');
		this.playState = false;
		this.isScrubbing = false;
		// this.loop = setInterval(function(){self._looper();}, 1000/30); // 30 fps --kinda
		
		// buttons
		this.playbackButton.addEventListener('click',function(){
			self.togglePlayback();
		});
		this.shuttleBack.addEventListener('click', function(){
			self.currentTime(self.audio.currentTime - 15);
		});
		this.shuttleForward.addEventListener('click', function(){
			self.currentTime(self.audio.currentTime + 15);
		});


		// desktop scrubbing
		this.duration.addEventListener('mousemove', function(e){
			if(self.isScrubbing)
				self.currentTime( ((e.clientX - self.duration.getBoundingClientRect().left)/self.duration.clientWidth) * self.audio.duration );
		}, false);

		this.duration.addEventListener('click', function(e){
			self.currentTime( ((e.clientX - self.duration.getBoundingClientRect().left)/self.duration.clientWidth) * self.audio.duration );
		}, false);

		this.duration.addEventListener('mousedown', function(e){
			self.isScrubbing = true;
			self.audio.pause();
		}, false);

		this.duration.addEventListener('mouseup', function(e){
			self.isScrubbing = false;
			self.resumePlayState();
		}, false);

		this.duration.addEventListener('mouseleave', function(e){
			self.isScrubbing = false;
			self.resumePlayState();
		}, false);

		// mobile scrubbing
		this.duration.addEventListener('touchmove', function(e){
			e.preventDefault();
			self.currentTime( ((e.pageX - self.duration.getBoundingClientRect().left)/self.duration.clientWidth) * self.audio.duration );
		}, false);

		this.duration.addEventListener('touchstart', function(e){
			e.preventDefault();
			self.isScrubbing = true;
			self.audio.pause();
		}, false);

		this.duration.addEventListener('touchend', function(e){
			self.isScrubbing = false;
			self.resumePlayState();
		}, false);
	},

	createDOM: function(){
		var self = this;
		this.ele = this.newElement({
			name:'div',
			id:'controls'
		});

		this.audio = this.newElement({
			name:'audio',
			id:'now-playing',
			appendTo: this.ele
		});

		this.duration = this.newElement({
			name:'div',
			id:'duration-bar',
			appendTo: this.ele
		});

		this.progress = this.newElement({
			name:'div',
			id:'progress-bar',
			appendTo: this.duration
		});

		this.infoBox = this.newElement({
			name:'div',
			id:'controls-infoBox',
			appendTo: this.ele
		});

		this.timecode = this.newElement({
			name:'div',
			id:'controls-timecode',
			appendTo:this.infoBox,
			innerHTML: '<p>0:00 / 0:00</p>'
		});

		this.buttonsBox = this.newElement({
			name:'div',
			id:'controls-buttons',
			appendTo: this.infoBox
		});

		this.shuttleBack = this.newElement({
			name:'div',
			className:'controls-button',
			appendTo: this.buttonsBox,
			innerHTML: this._icons.shuttleBack
		});

		this.playbackButton = this.newElement({
			name:'div',
			className:'controls-button',
			appendTo:this.buttonsBox
		});

		this.playbackSVG = this.newElement({
			name:'svg',
			appendTo:this.playbackButton,
			attrs: {
				viewBox: '0 0 15 16'
			}
		});

		this.playbackIcon = this.newElement({
			name:'path',
			appendTo:this.playbackSVG,
			attrs: {
				d: this._icons.play
			}
		});

		this.shuttleForward = this.newElement({
			name:'div',
			className:'controls-button',
			appendTo:this.buttonsBox,
			innerHTML: this._icons.shuttleForward
		});

		// this._updateDisplayTime();
	},

	load: function(data){
		var self = this;
		console.log('clearing interval.' + this.loop);
		clearInterval(this.loop);
		var resumeLoop = function(){
			console.log('setting interval.');
			self.loop = setInterval(function(){self._looper();}, 1000/30);
			self.audio.removeEventListener('durationchange', resumeLoop, false);
		};
		this.audio.addEventListener('durationchange', resumeLoop, false);
		this.audio.src = data.src;
		this.ele.className = 'active';
	},

	currentTime: function(time){
		if(time !== undefined)
			this.audio.currentTime = time;
		return this.audio.currentTime;
	},

	play: function(time){
		var self = this;
		if(time !== undefined)
			this.audio.currentTime = time;
		this.audio.play();
		this.playState = true;
		this.utils.d3.select(self.playbackIcon).transition()
				.duration(350)
				.attr("d", self._icons.pause);
	},

	pause: function(time){
		var self = this;
		if(time !== undefined)
			this.audio.currentTime = time;
		this.audio.pause();
		this.playState = false;
		this.utils.d3.select(self.playbackIcon).transition()
				.duration(350)
				.attr("d", self._icons.play);
	},

	togglePlayback: function(){
		if(this.playState){
			this.pause();
		}
		else{
			this.play();
		}
	},

	resumePlayState: function(){
		if(this.playState)
			this.audio.play();
		else
			this.audio.pause();
	},

	_updateDisplayTime: function(){
		var current = this.utils.toDisplayTime(this.currentSecond);
		var duration = this.utils.toDisplayTime(this.audio.duration);
		this.timecode.innerHTML = '<p>'+current+' / '+duration+'</p>';
	},

	_looper: function(){
		console.log('loop!');
		if(Math.floor(this.audio.currentTime * 100)/100 != this.currentSecond){
			this.currentSecond = Math.floor(this.audio.currentTime * 100)/100;
			this.ele.dispatchEvent(this.timeChange);
		}
		this.progress.style.width = (this.audio.currentTime * 100 / this.audio.duration) + '%';
		this._updateDisplayTime();
	},

	utils: {
		toDisplayTime: function(input){
			var sec_num = parseInt(input, 10);
			var hours   = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);
			var hasHours = true;
			var time;

			if(hours === 0){
				hours = "";
				hasHours = false;
			} 

			if(minutes === 0){
				minutes = "0";
			}
			else if(minutes < 10 && hasHours){
				minutes = "0"+minutes;
			}

			if(seconds < 10){
				seconds = "0"+seconds;
			}

			if(hasHours)
				time = hours+':'+minutes+':'+seconds;
			else
				time = minutes+':'+seconds;

			return time;
		},

		d3: require('d3')
	}
};