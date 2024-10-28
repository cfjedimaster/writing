# Why Alpine is the new JQuery and Why that is an Awesome Thing

Back in the old days, when I was building web sites by hand, in the snow, uphill, both ways, [jQuery](https://jquery.com/) was my default tool when building any kind of interactivity on a web page. Way before I even considered building apps, jQuery was the workhorse that made cross-browser web development easy, and, at least a bit, less painful. In 2024, it's still prevalent and in use in vast majority of web sites. (I've seen various numbers, but all point to *at least* roughly three fourths of the web sites in use today.) 

I think part of the reason jQuery was so successful is that, along with patching over browser incompatabilities (looking at you <strike>Safari</strike>Internet Explorer), it was a laser focused set of utilities for common things developers needed to do - mainly:

* Making network requests (without the pain of XMLHtttpRequest)
* Listening for changes in the DOM
* And making changes in the DOM

Of course it did a lot more than that, but those three items are probably part of every interactive web page I've built since the introduction of JavaScript. This is why I've been so enamored of late with [Aline.js](https://alpinejs.dev/). Alpine.js is lightweight (44kb minified) and simple enough that the entire thing, well, at a high level, is documented on the home page. Let's quickly go over the basics, and hopefully you'll fall in love as well!

## Installation and Setup

While you can do a `npm install alpinejs` if you want, it's far easier to simply drop the CDN link in the head of your web page:

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

While that's easy, the next part requires a tiny bit of thought. jQuery, once installed, was available everywhere and could do, well just about anything. If you ever used Vue.js for progressive enhancement (versus as your entire application), you might remember that you had to specify the part of the DOM that Vue would work with. Basically, "This area of the DOM will make use of variables, have event handlers I track and so forth." This usually was the main block of your web page, not the header and footer.

Alpine is the same way. To keep things simple, I'll be using one main `<div>` block for this purpose. This is done with an `x-data` attribute:

```html
<div x-data="stuff here in a bit...">
</div>
```



showing stuff in the dom
simple values and looping
show/IF

2 way binding

events

switch to JS only

when NOT to use it

