/*
Code snippet for making YouTube and Vimeo iframes responsive.
*/

module.exports = {
	init: function(){
		var self = this;
		window.addEventListener('resize', function(){
			self.resize();
		});
		self.resize();
	},

	resize: function(){
		var videos = this.getYoutubeVimeoIframes();
		if(videos !== null){
			var i;
			for (i = 0; i < videos.length; i++) {
				videos[i].setAttribute('data-aspectRatio', videos[i].height / videos[i].width);
				videos[i].removeAttribute('height');
				videos[i].removeAttribute('width');
			}
			for (i = 0; i < videos.length; i++) {
				var parentWidth = videos[i].parentElement.clientWidth;
				videos[i].width = parentWidth;
				videos[i].height = parentWidth * videos[i] .getAttribute('data-aspectRatio');
			}
		}
	},

	getYoutubeVimeoIframes: function(){
		var iframes = document.getElementsByTagName('iframe');
		var output = [];
		for (var i = 0; i < iframes.length; i++) {
			if(/^(http|https):\/\/(www\.)?(player\.vimeo\.com|youtube\.com)/.test(iframes[i].src))
				output.push(iframes[i]);
		}

		if(output.length > 0)
			return output;
		else
			return null;
	}
};