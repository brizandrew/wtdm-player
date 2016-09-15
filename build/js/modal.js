module.exports = {
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

	init: function(config){
		var self = this;
		this.createDOM(config);

		var handleTabClicks = function(name){
			return function(){self.displayTab(name);};
		};

		for (var i = 0; i < this.tabLabels.length; i++) {
			this.tabLabels[i].addEventListener('click', handleTabClicks(self.tabLabels[i].innerText));
		}

		this.displayTab(this.tabLabels[0].innerText);
	},

	createDOM: function(config){
		this.ele = this.newElement({
			name: 'div',
			className: 'modalWrapper',
			attrs: {
				style: 'display:none;'
			}
		});

		this.container = this.newElement({
			name: 'div',
			className: 'modal',
			appendTo: this.ele
		});

		this.heading = this.newElement({
			name: 'h2',
			innerHTML: config.name,
			appendTo: this.container
		});

		var tab;
		if(Object.keys(config.tabs).length > 1){
			this.nav = this.newElement({
				name: 'div',
				className: 'modalNav',
				appendTo: this.container
			});

			this.tabLabels = []; 
			for(tab in config.tabs){
				this.tabLabels.push(this.newElement({
					name: 'h4',
					innerHTML: tab,
					appendTo: this.nav
				}));
			}
		}
		else{
			this.tabLabels = []; 
			for(tab in config.tabs){
				this.tabLabels.push(this.newElement({
					name: 'h4',
					innerHTML: tab
				}));
			}
		}

		this.content = this.newElement({
			name: 'div',
			className: 'modalContent',
			appendTo: this.container
		});

		this.tabs = [];
		for(tab in config.tabs){
			this.tabs.push(this.newElement({
				name: 'div',
				className: 'modalTab',
				id: tab,
				innerHTML: config.tabs[tab],
				appendTo: this.content,
				attrs: {
					style: 'display:none;'
				}
			}));
		}

		this.footer = this.newElement({
			name: 'div',
			className: 'modalFooter',
			appendTo: this.container
		});

		this.buttons = {};
		var button;
		for (var i = 0; i < config.buttons.length; i++) {
			this.buttons[config.buttons[i]] = this.newElement({
				name: 'button',
				innerHTML:config.buttons[i],
				appendTo: this.footer
			});
		}
	},

	displayTab: function(name){
		for (var i = 0; i < this.tabLabels.length; i++) {
			if(this.tabLabels[i].innerText == name)
				this.tabLabels[i].className = 'active';
			else
				this.tabLabels[i].className = '';
		}

		for (var i = 0; i < this.tabs.length; i++) {
			if(this.tabs[i].id == name)
				this.tabs[i].style.display = 'flex';
			else
				this.tabs[i].style.display = 'none';
		}
	},

	toggle: function(){
		if(this.ele.style.display == 'none')
			this.ele.style.display = 'block';
		else
			this.ele.style.display = 'none';
	}
};