# WTDM Podcast Player

The [WTDM Podcast Player](http://wuft.org/wtdm) is a web application I built for [WUFT](http://wuft.org/news) in order to create a multimedia experience for their new podcast: We’re The Damn Millenials. Each episode has its own page, but once you play one you can navigate through the site without losing the audio feed.

One key skill in building seamless web apps is [push states](https://developer.mozilla.org/en-US/docs/Web/API/History_API). Because javascript objects will disappear when a new HTML page is loaded, users must be “tricked” into thinking they went to another page on your app, when really you just changed the content they’re seeing and what the URL bar says at the top.

There’s plenty of libraries that handle all of this routing for you ([Angular](https://angularjs.org/), [React](https://facebook.github.io/react/), [Ember](http://emberjs.com/)), and I plan on learning one of them eventually, I’m a big proponent in knowing the core vanilla behind anything this important. I’ve been burned one too many times by dependencies going unsupported and breaking your project.

This app was also a good test run for seamless audio playing throughout a site — a feature WUFT hopes to one day have throughout their whole site.