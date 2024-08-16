# Writing to the Clipboard

In my [last article](https://frontendmasters.com/blog/reading-from-the-clipboard-in-javascript/), I showed you how to enable your website to read a visitor's clipboard. Now I'm going to follow up that guide with a look at *writing* to the clipboard. It goes without saying that in any use of this type of functionality, you should proceed with care and, most of all, respect for your visitors. I'll talk a bit about what that means later in the article, but for now, let's look at the API.

## Before We Begin...

As I said last time, clipboard functionality on the web requires a “secure context”. So if you’re running an http site (as opposed to an https site), these features will not work. I’d highly encourage you to get your site on https. That being said, these features, and others like them that require secure contexts, will still work on http://localhost. There’s no need to set up a temporary certificate when doing local testing.

## The Clipboard API

I covered this last time, but in case you didn't read the previous article in this series, the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard) is supported in JavaScript via `navigator.clipboard` and has excellent cross-platform support:

![Browser support](./shot1.webp)

This feature will also prompt the user for permission so remember to handle cases where they reject the request. 

## Writing to the Clipboard

When I last discussed the clipboard API, I mentioned how it had two APIs for reading from the clipboard, we had a `readText` method tailored for, you guessed it, reading text, and a more generic `read` method for handling complex data. Unsurprisingly, we've got the same on the write side:

* write
* writeText

And just like before, `writeText` is specifically for writing text to the clipboard while `write` gives you additional flexibility. 

At the simplest, you can use it like so:

```js
await navigator.clipboard.writeText("Hello World!");
```

That's literally it. Here's a CodePen demonstrating an example of this, but you will most likely need to make use of the 'debug' link to see this in action due to security issues on the CodePen side:

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="XWLVRGX" data-pen-title="Clipboard Reading" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/XWLVRGX">
  Clipboard Reading</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

One pretty simple and actually practical use-case for something like this is quickly copying links to the user's clipboard. Let's consider some simple HTML:

```html
<div class="example">
  <p>
    <a href="https://www.raymondcamden.com">My blog</a><br />
    <a href="https://frontendmasters.com/blog/">Frontend Masters blog</a>
  </p>

  <p>If this doesn't work for you <a href="https://codepen.io/pen/debug/ZEdvKgb" target="_blank">try Debug Mode</a>.</p>
</div>
```

What I want to do is - pick up all the links (filtered by something logical), and automatically add a UI item that will copy the URL to the clipboard:

```js
links = document.querySelectorAll("div.example p:first-child a");

links.forEach((a) => {
  let copy = document.createElement("span");
  copy.innerText = "[Copy]";
  copy.addEventListener("click", async () => {
    await navigator.clipboard.writeText(a.href);
  });
  a.after(copy);
});
```

I begin with a selector for the links I care about, and for each, I append a span element with `[Copy]` as the text. Each new element has a click handler to support copying it's related URL to the clipboard. As before, here's the CodePen but expect to need the debug link:

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="ZEdvKgb" data-pen-title="Clipboard Writing " data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/ZEdvKgb">
  Clipboard Writing </a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

As a quick note, the UX of this demo could be improved. I'd add a pointer style to the text so it's obvious it's clickable and perhaps notify the user in some small way that you performed the action.

Now let's kick it up a notch and look into how to support binary data with the `write` method.


NOTES:
from https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
"Browsers commonly support writing text, HTML, and PNG image data "
Uncaught (in promise) DOMException: Failed to execute 'write' on 'Clipboard': Type image/jpeg not supported on write.