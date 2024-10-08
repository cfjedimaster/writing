# Handling Paste Events in JavaScript

Welcome to the third and final post in the series. In the [first article](https://frontendmasters.com/blog/reading-from-the-clipboard-in-javascript/), I explained how JavaScript can read from the user's clipboard. In the [last article](https://frontendmasters.com/blog/writing-to-the-clipboard-in-javascript/), I explained the opposite, writing to the user's clipboard. Now I'm going to demonstrate how to add basic "paste event" handling in your web app. Luckily, much of what we learned in the past two articles will come in handy as the 'shape' of the data will be the same. 

## Listening for the Event 

If you've done anything at all with JavaSsript and events you can probably guess the name of the event we'll use, `paste`. (And to be clear, I love a language/API/SDK/etc. where my natural guess about how something is done usually works!) Where you listen for that event will depend on your use - but for our purposes, we'll make it easy and add a listener on the `window` object like so:

```js
window.addEventListener('paste', e => {
}, false);
```

That's the easy part. Note that as with most event related handlers, if you want to block the default action, for example, if the user pasted into a form field, you would use `e.preventDefault()`. One example of this, and to be clear, I *despise* this example, are forms asking for confidential information like bank account numbers. The form will disable pasting information into the form field. Again, I *really* don't like this, so if you do make use of this, please consider using a `title` field to provide information to the user. Here's an example.

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="result" data-slug-hash="qBeaYrZ" data-pen-title="Paste Events 1" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/qBeaYrZ">
  Paste Events 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Working with the Event 

So you're listening for the paste event and want to do something with it, how do you begin? When the event fires, it contains a [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData) object. There are two main things we can do with this object:

* Read textual data from it using a method, `getData`
* Check for a pasted *file* using the `files` property

Let's take a quick look at working with text.

## Getting Text of a Pasted Event 

The [`getData`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData) method accepts one attribute, the format of the data to retrieve. 

So for example, to read the text of the clipboard:

```js
let pastedText = e.clipboardData.getData('text/plain');
```

And HTML:

```js
let pastedText = e.clipboardData.getData('text/html');
```

The HTML version gets a bit... interesting. Let's build a quick application to let you test this quickly. First, some HTML that includes radio buttons to let you select how to handle the paste event and an empty div for the data:

```html
<h2>Pasted Data</h2>
<p>
<label for="textplain">View text/plain</label>
<input type="radio" name="type" id="textplain" value="text/plain" checked><br>

<label for="texthtml">View text/html</label>
<input type="radio" name="type" id="texthtml" value="text/html"><br>
</p>

<div id="pasteDump"></div>
```

In our JavaScript, we'll listen for changes to the radio button as a way to determine how to handle the paste event. The paste event handler itself will call `getData()` and log it out to the div:

```js
let type = 'text/plain';

document.querySelectorAll('input[name=type').forEach(i => {
	i.addEventListener('change', e => {
		console.log('click', e.target.value);
		type = e.target.value;
	},false);
});

window.addEventListener('paste', e => {
	let dump = document.querySelector('#pasteDump');
	
	let data = e.clipboardData.getData(type);
	console.log(data);
	dump.innerHTML = data;
}, false);
```

Now, you can paste text into the demo and see the different results:

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="result" data-slug-hash="RwXGyqx" data-pen-title="Paste Events 1" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/RwXGyqx">
  Paste Events 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

For 'plain/text', you see what I think you would expect. If you go to a random web page, lets say the [first article](https://frontendmasters.com/blog/reading-from-the-clipboard-in-javascript/) in this series, and select from the title to the first paragraph:


![Screenshot showing text selected in the article](./shot1.png)

And the paste, you get:

```
Reading from the Clipboard in JavaScript July 31, 2024 Browsers have excellent support for reading and writing the user’s clipboard, and this opens up possibilities for better, and more native like experiences on the web. On websites that use these APIs for helpful features, it feels natural to the user. On sites where it isn’t supported, it almost feels like a bug. In this series of articles, I’m going to demonstrate how to work with the clipboard.
```

I'll note that the line breaks were preserved, but are lost when rendered in HTML. If you wanted, you could do a string replacement for `\n` for `<br>` to more accurately render the text.

The HTML version is a bit... different:

![Rendered HTML from the Paste](./shot2.png)

As you can see, it tried to accurately, kinda, represent the HTML from the selection. If you open up your console, you're presented with something monstrous:

```html
<html>
<body>
<!--StartFragment--><h1 class="gradient-style-text" style="box-sizing: border-box; font-family: &quot;Mona Sans&quot;, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; white-space: balance; letter-spacing: 0px; margin: 0px; line-height: 1.1; font-variation-settings: &quot;wght&quot; 900, &quot;wdth&quot; 125; font-size: var(--font-size-xxl); word-break: break-word; color: rgb(255, 255, 255); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; view-transition-name: header-3136;">Reading from the Clipboard in JavaScript</h1><time class="block-time" datetime="2024-07-31" style="box-sizing: border-box; font-family: var(--font-family-monospace); text-transform: uppercase; font-size: var(--font-size-xsm); letter-spacing: 0.3rem; margin: 0px 0px 2rem; display: block; color: rgb(255, 255, 255); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; orphans: 2; text-align: start; text-indent: 0px; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; view-transition-name: article-time-3136;">July 31, 2024</time><div class="article-content" style="box-sizing: border-box; font-size: var(--font-size-md); color: rgb(255, 219, 219); position: relative; word-break: break-word; overflow-wrap: break-word; font-family: &quot;Mona Sans&quot;, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.64px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 2.2rem;">Browsers have excellent support for reading and writing the user’s clipboard, and this opens up possibilities for better, and more<span> </span><em style="box-sizing: border-box; font-variation-settings: &quot;wght&quot; 400, &quot;wdth&quot; 100, &quot;slnt&quot; -10; font-style: normal; color: rgb(250, 162, 162); margin-right: 0.1rem;">native like</em><span> </span>experiences on the web. On websites that use these APIs for helpful features, it feels natural to the user. On sites where it <em style="box-sizing: border-box; font-variation-settings: &quot;wght&quot; 400, &quot;wdth&quot; 100, &quot;slnt&quot; -10; font-style: normal; color: rgb(250, 162, 162); margin-right: 0.1rem;">isn’t</em> supported, it almost feels like a bug. In this series of articles, I’m going to demonstrate how to work with the clipboard.</p></div><!--EndFragment-->
</body>
</html>
```

This reminds me quite a lot of what Word documents exported to HTML looked like. Visually fine, but a source that would make your head spin. 

If your curious how this handles *non*-text data, it depends. 

Right clicking on an image and pasting it in returns nothing if the type is 'text/plain', but with 'text/html', you get:

```html
<html>
<body>
<!--StartFragment--><img src='https://www.raymondcamden.com/images/avatar3.jpg' alt='Raymond Camden'/><!--EndFragment-->
</body>
</html>
```

In this case, I copied an image from my blog. While this works, there's a better way.

## Getting Files from the Clipboard 

So what happens when you try to paste binary data, or let's even say a file you copied from your machine? These end up in the `clipboardData.files` property. This is an array-like [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList) object which matches what you get from an input form field with `type=file` or when you drag and drop into the browser. Because of this, code you may have used before can be used again, which is handy. 

One simple method for handling images is using a `FileReader` object, reading in the file as a data URL, and then adding it to the DOM. Let's look at an example of that.

First, our simple HTML:

```html
<h2>Pasted Images</h2>
<p>
	Paste an image into the browser.
</p>

<img id="preview">
```

Notice the 'empty' image. This is what we'll use for the preview. Now the JavaScript:

```js
let img = document.querySelector('#preview');

window.addEventListener('paste', e => {

	if(e.clipboardData.files.length) {
    console.log('handle a file');
    /*
    Files can be 2 or more, but we'll focus on 1 for img preview
    */
    let file = e.clipboardData.files[0];
    if(file.type.startsWith('image/')) {
      previewImage(file);
    }
 }

}, false);


function previewImage(file) {
  let reader = new FileReader();

  reader.onload = e => {
    img.src = e.target.result;
  }

  reader.readAsDataURL(file);
    
}
```

Basically, if the pasted event contains file, we can check the mimetype of each (although in this case, to keep things simple we'll focus on one), and if it is an image, run `previewImage`, which handles reading and converting the data into a URL. You can try this version below:

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="result" data-slug-hash="VwoKENq" data-pen-title="Paste Events Dont Use" data-editable="true" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/VwoKENq">
  Paste Events Dont Use</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
