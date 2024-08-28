//import * as dotenv from 'dotenv';
//dotenv.config();

import { Octokit, App } from "octokit";
import fs from 'fs';
import chalk from 'chalk';


const TOKEN = process.env.GH_PAT;

const octokit = new Octokit({
	auth: TOKEN
});

/*
Given a string of Markdown, I find code blocks and sniff type. So I'll find:

```
foo
```

and return it as a 'plain' type. But if I find

```js
foo();
```

I'll return it as a 'js' type. I return blocks with [ { start: x, end: y, type: '' }]
*/
function getCodeBlocks(str) {
	let results = [];
	let blocksReg = /```(.*?)```/sg;
	let match = null;

	// https://stackoverflow.com/a/2295681/52160
	while((match = blocksReg.exec(str)) != null) {
		let result = {
			str:match[0],
			start: match.index, 
			end: match.index + match[0].length
		}

		// get line one to try to figure out type
		let line1 = result.str.split('\n')[0];
		let type = line1.replace(/[\`\r]/g,'');
		if(!type) type = 'plain';
		result.type = type;
		results.push(result);
	}
	return results;
}

async function createGist(code, type) {
	/*
	We switch type to a filename, will help with code rendering.
	Right now, just a few and yeah, I could just use file.TYPE except
	for plain. I may come back to that.
	*/
	let filename = 'plain.txt';

	if(type === 'js') {
		filename = 'script.js';
	} else if(type === 'html') {
		filename = 'file.html';
	} else if(type === 'py') {
		filename = 'file.py';
	}

	// remove initial and ending ```
	// oops, beginning can be ```js. 

	code = code.replace(/```.*/gm,'').trim();

	let files = {};
	files[filename] = { content: code };

	
	let body = {
		description:'', 
		public: true, 
		files
	}

	return (await octokit.request('POST /gists', body)).data;

}

/*
Given x, convert to  
<script src=x.js"></script>

*/
function toGistEmbed(url) {
	//return `<script src="${url}.js"></script>`;
	return url;
}

(async () => {


	/*
	require an input and output arg
	*/
	let input = process.argv[2];
	let output = process.argv[3];

	if(!input || !output) {
		console.log(chalk.red('Usage: node gistify.js <<input file>> <<output file>>'));
		process.exit(1);
	}

	if(!fs.existsSync(input)) {
		console.log(chalk.red(`Can't find input file ${input}`));
		process.exit(1);
	}

	// auto remove existing output
	if(fs.existsSync(output)) fs.unlinkSync(output);

	let md = fs.readFileSync(input,'utf8');
	console.log(chalk.green(`Parsing ${input} to find code blocks.`));

	let blocks = getCodeBlocks(md);

	if(blocks.length === 0) {
		console.log('No code blocks were found in this Markdown file. Have a nice day.');
		process.exit(1);
	}

	console.log(chalk.green(`We found ${blocks.length} code blocks. Beginning the Gist conversion.`));


	/*
	For each code block, make a gist, and take the result and update the markdown. 
	We'll do it backwards as we will be updating the string
	*/
	for(let i=blocks.length-1; i >= 0; i--) {
		let gist = await createGist(blocks[i].str, blocks[i].type);
		// we care about HTML url

		let embed = toGistEmbed(gist.html_url);
		md = md.substring(0, blocks[i].start) + embed + md.substring(blocks[i].end);
		console.log(chalk.yellow(`Processed ${blocks.length-i} on ${blocks.length}`));
	}

	fs.writeFileSync(output, md, 'utf8');

	console.log(chalk.green(`Done and written to ${output}.`));


})();