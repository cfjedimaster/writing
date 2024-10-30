# Why Alpine is the new JQuery and Why that is an Awesome Thing

Back in the old days, when I was building web sites by hand, in the snow, uphill, both ways, [jQuery](https://jquery.com/) was my default tool when building any kind of interactivity on a web page. Way before I even considered building apps, jQuery was the workhorse that made cross-browser web development easy, and, at least a bit, less painful. In 2024, it's still prevalent and in use in vast majority of web sites. (I've seen various numbers, but all point to *at least* roughly three fourths of the web sites in use today.) 

I think part of the reason jQuery was so successful is that, along with patching over browser incompatibilities (looking at you <strike>Safari</strike>Internet Explorer), it was a laser focused set of utilities for common things developers needed to do - mainly:

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

Ok, ready to get started? 

## Setting and Displaying Variables

Let's begin simply by initializing a few variables and showing how Alpine renders them. First, to define variables, you can simply set them as an object inside `x-data`:

```html
<div x-data="{
	name:'Raymond',
	age:51,
	cool:false
}">
</div>
```

To display these values, you can use two different directives. `x-text` will bind the text value of a variable to the DOM while `x-html` will bind HTML. Which you use depends on the data of course. Here's this in action:

```html
<div x-data="{
	name:'Raymond',
	age:51,
	cool:false
}">
	<p>
		My name is <span x-text="name"></span>. 
		I'm <span x-text="age"></span> years old.
	</p>
</div>
```

You'll note that unlike Vue, Alpine.js doesn't have a "mustache-like" language built in, but instead relies on attributes applied to your DOM itself. In this case, `span` tags. You could bind them to any element really, but `span`s make sense here for simple values. I will admit, it *is* a bit verbose, but easy to spot in code. You can see this in action below (and feel free to edit the values of course):

<p class="codepen" data-height="300" data-theme-id="42685" data-default-tab="result" data-slug-hash="VwoQNXK" data-pen-title="Alpine Article 1" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/VwoQNXK">
  Alpine Article 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


That's basic "render data from JavaScript in the DOM", but let's now show how to *conditionally* show information. Like Vue, Alpine provides two methods. The first, `x-show`, will hide or display items in the DOM based on their value:


```html
<div x-data="{
	name:'Raymond',
	age:51,
	cool:false
}">
	<p>
		My name is <span x-text="name"></span>. 
		I'm <span x-text="age"></span> years old.
	</p>
	<p x-show="cool">
	Oh, and I'm so darn cool!
	</p>
</div>
```

The other method, `x-if`, will actually add and remove the contents of your DOM based on the value. Because of this, it requires you make use of `template` **and** use one top level root element, like a `div` or `p`. I'll admit this tripped me up from time to time, but Alpine does a good job of reporting the issue if you screw this up. Here's the same example as above, re-written with `x-if`

```html
<div x-data="{
	name:'Raymond',
	age:51,
	cool:false
}">
	<p>
		My name is <span x-text="name"></span>. 
		I'm <span x-text="age"></span> years old.
	</p>
	<p x-show="cool">
	Oh, and I'm so darn cool!
	</p>
</div>
```

You can test this below - just switch the value of `cool` to see it in action:

<p class="codepen" data-height="300" data-theme-id="42685" data-default-tab="result" data-slug-hash="XWvqbLN" data-pen-title="Alpine Article 1" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/XWvqbLN">
  Alpine Article 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Finally, what about looping? Alpine provides the `x-for` directive. Like `x-if`, you'll use a `template` tag with one root element. Here's an example:

```html
<div x-data="{
	name:'Raymond',
	age:51,
	cool:false,
	hobbies:['buillding cat demos','star wars','cats']
}">
	<p>
		My name is <span x-text="name"></span>. 
		I'm <span x-text="age"></span> years old.
	</p>
	<ul>
	<template x-for="hobby in hobbies">
		<li x-text="hobby"></li>
	</template>
	</ul>
</div>
```

Note the use of "variable in array" syntax. You can use whatever you want here, but obviously name it something sensible. Also, in the example above I'm looping over an array of strings. You can absolutely loop over an array of objects as well. Check it out in the embed below:

<p class="codepen" data-height="300" data-theme-id="42685" data-default-tab="result" data-slug-hash="YzmLyzv" data-pen-title="Alpine Article 2" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/YzmLyzv">
  Alpine Article 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Two-Way Binding

How about binding form fields to your data? Once again, Alpine provides a directive, `x-model`. This works on any form field *except* file inputs (although, like in Vue, there's a workaround). 

For example:

```html
<label for="firstName">First Name:</label> <input id="firstName" x-model="firstName"><br/>
<label for="lastName">Last Name:</label> <input id="lastName" x-model="lastName"><br/>
<label for="cool">Cool?</label> 
<select id="cool" x-model="cool">
	<option>true</option>
	<option>false</option>
</select>
```

The embed below demonstrates this, along with conditionally showing content based on the dropdown:

<p class="codepen" data-height="300" data-theme-id="42685" data-default-tab="result" data-slug-hash="MWNGabj" data-pen-title="Alpine Article 3" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/MWNGabj">
  Alpine Article 4</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Binding Attributes 

Closely related to two-way binding of form fields is the simpler act of binding an HTML attribute to your data. Alpine, again, provides a directive for this, `x-bind`, as well a shortcut. 

Given your data has a value for `catPic`, we can bind it like so:

```html
<img x-bind:src="catPic">
```

Because this is something folks may use quite a bit, Alpine provides a shortcut:

```html
<img :src="catPic2">
```

I feel like a live embed of this would be gratuitous given how simple this is, but as it's pictures of cats, sorry, you're getting an embed:

<p class="codepen" data-height="300" data-theme-id="42685" data-default-tab="result" data-slug-hash="bGXMVad" data-pen-title="Alpine Article 4" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/bGXMVad">
  Alpine Article 4</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Events 

As you can probably guess by now, events are supported by a directive, this time the `x-on` directive where you specify the event and the handler to call. As with attribute bindings, there's a shortcut. Here's a simple example:


```html
<div x-data="{
	 catPic:'https://placecats.com/400/400',
	 flipImage() {
			if(this.catPic.includes('/g')) this.catPic = this.catPic.replace('/g', '');
			else this.catPic = this.catPic.replace('/400', '/g/400');
	 }						 
}">
	<img :src="catPic" x-on:click="flipImage">
</div>
```

I've defined a click handler on the image that runs a method, `flipImage`. If you look up in the `x-data` block, you can see I've defined the function there. In Alpine, your data can consist of various variables *and* methods interchangeably. Also note that `flipImage` uses the `this` scope to refer to the variable, `catPic`. All in all, this simply flips out a static picture of a cat 
with a grayscale version. 

The shorthand removes `x-on:` and simply uses `@`:

```html
<img :src="catPic" @click="flipImage">
```

You can play wit this below:

<p class="codepen" data-height="300" data-theme-id="42685" data-default-tab="result" data-slug-hash="mdNLVaR" data-pen-title="Alpine Article 6" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/mdNLVaR">
  Alpine Article 6</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Alpine also supports various modifies for event handling including the ability to run events once, prevent default behavior, throttle, and more. Check the [modifiers](https://alpinejs.dev/directives/on#modifiers) docs for more examples.


getters?
switch to JS only
when NOT to use it

