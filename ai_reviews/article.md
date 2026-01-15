# Using on-device AI to Enhance Webflow CMS Content

Most people's interactions with AI are via (hopefully) helpful bots and tools like ChatGPT. AI can be used nearly everywhere to (again, hopefully) enhance and expand the experience. One of the new frontiers for AI is directly in the web browser itself, thanks to efforts by the Google Chrome team. Chrome's [built-in AI](https://developer.chrome.com/docs/ai) feature aims to bring the power of a large language model directly to the user's browser itself. Of course, this is in a somewhat smaller form, using the Gemini Nano model, but it still brings quite a bit of power to web developers. Even better, it can run completely offline, and basically for free. No API keys are required! 

This feature is still in early days and changing rapidly, but broadly, the Chrome team supports task focused APIs as well as a general purpose prompting API. Current features include:

* Both language detection and translation
* Writing and Rewriting text for tone and length
* Summarization of content
* Proofreading content
* And of course, a general purpose prompt.

Right now this is a Chrome-only feature, but other Chromium browsers (like Microsoft Edge) will probably support this as well. Even within Chrome, support isn't 100% baked in yet. The Chrome team has a [dedicated API status and overview](https://developer.chrome.com/docs/ai/built-in-apis) page that clearly states what's available generally as well as what's available for Chrome versus Chrome extensions. 

Given all this, you might be disinclined to even consider this feature, but keep in mind this is a great example of where Progressive Enhancement comes into play. When all of these APIs are generally available in the released version of Chrome, a significant percentage of users will have access to these APIs. Also, by their very nature many of these APIs can act as useful helpers, so for example, providing the ability to summarize content on the page is a great addition to a web page, but not something that's necessarily required. 

Alright, with all of that pre-amble out of the way, how can we actually make use of these APIs?

## The Prompt API at a high level

The API I'm using for my demo today is the [Prompt API](https://developer.chrome.com/docs/ai/prompt-api). This is the general purpose API that will be most useful for our particular demo. At the time this blog post is being written, the Prompt API for Chrome itself (not extensions) is behind a flag: "Prompt API for Gemini Nano". This must be enabled in `chrome://flags` before it can be used. When released, this will not be required. 

There are also pretty strict [hardware requirements](https://developer.chrome.com/docs/ai/prompt-api#hardware-requirements) as well. There's nothing you as a developer can do about that, but it's something to keep in mind if your audience is primarily using older, lower-powered devices. (And as good web developers, we all check for that, right?) The code itself (that you will see in a moment) handles this for us so there isn't anything special you need to do in your code to handle this.

The final requirement is a bit interesting. Since we're talking about downloading a large model, Chrome restricts *just* the downloading aspect until the user has a "meaningful interaction" with the page. This is a somewhat recent change to the feature and can be a bit tricky if you aren't expecting it. The [docs](https://developer.chrome.com/docs/ai/get-started#user-activation) go into some detail, but the simplest solution is just put the interaction (whatever you're doing with AI) behind a button click. And given that some people don't want to use AI, this gives them a choice as well.

Alright, speaking of code, the first step is to simply check for the API itself:

```js
if(!('LanguageModel' in window)) {
    // either silently ignore, or let the user know
    return;
}
```

If the user does have the API, your next step is to use the `availability` method, which does a few things:

* It checks the hardware requirements mentioned above, and if it's determined that this device cannot support the API, `unavailable` will be returned.
* If everything is awesome, then `available` is returned.
* The model used by Chrome's AI feature, Nano, is "small", but that's a relative term. It's still a LLM model that's going to take up some space on the user's hard drive. Luckily, this is usable by any and all websites, a user doesn't have to download it for every site making use of the feature. But to handle this state, the `availability` method can also return `downloadable` and `downloading`. In this case, the API will be usable once the download finishes. You'll see how to handle that in a moment.

Here's an example:

```js
const availability = await LanguageModel.availability();
```

After you have determined the user *can* use the API (the result should be one of `available`, `downloadable`, or `downloading`), you can create a session. The session represents your interaction with the AI model, and each of the APIs has various options you can use to customize how the session will work. Remember that this may need to be after user interaction with the web page. 

For the Prompt API, we can keep it rather simple:

```js
// Copied from the docs: https://developer.chrome.com/docs/ai/prompt-api#use_the_prompt_api
const session = await LanguageModel.create({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  },
});
```

Note the argument passed to the `create` method is an event handler for downloading. In this example, a message is being logged to the console, but in nearly every single real use case, you will want to let the user know by updating the DOM. It isn't required, and it doesn't always need to be displayed, but generally you should. (For the demo I'm sharing I actually don't do this as it doesn't make sense in context.) 

As a quick note, even if the model has been downloaded and the result of the `availability` method was `available`, the event handler for `downloadprogress` always fires twice - once with a `loaded` value of 0 and once with 1. This is instantaneous but it's something to keep in mind if you are updating the user on progress. 

Finally, you can call the model:

```js
let result = await session.prompt('Why are cats so much better than dogs?');
```

The result is a string value that you can use how you see fit. 

That's the gist of it, but as you can imagine, complex AI integrations are possible and will require quite a bit more work. Let's take a look at a real-word use case for this within Webflow.

## Using AI with Webflow CMS content

In my Webflow site, I've got a set of product reviews that have been created by customers. These reviews are just blocks of text, a name, and a date when the review was created. 

On my site, I created a page and added a `Collection List` component tied to my reviews, sorted by the date when the review was created. I did a bit of design work in the `Collection Item` block to nicely render each review with a blue border to the right. You can see this for yourself here, <https://chrome-ai-test.webflow.io/review-demo-page>, but here's a screenshot:

![Screenshot](./shot1.png)
