import fs from 'fs';

import { Readable } from 'stream';
import { finished } from 'stream/promises';

let REST_API = "https://pdf-services.adobe.io/";

let CLIENT_ID = process.env.CLIENT_ID;
let CLIENT_SECRET = process.env.CLIENT_SECRET;

let SOURCE_PDF = './form_blank.pdf';

async function delay(x) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), x);
	});
}

async function getAccessToken(id, secret) {

	const params = new URLSearchParams();
	params.append('client_id', id);
	params.append('client_secret', secret);

	let resp = await fetch('https://pdf-services-ue1.adobe.io/token', { 
		method: 'POST', 
		headers: {
			'Content-Type':'application/x-www-form-urlencoded'
		},
		body:params 
	});
	let data = await resp.json();
	return data.access_token;
}

async function getUploadData(mediaType, token, clientId) {

	let body = {
		'mediaType': mediaType
	};
	body = JSON.stringify(body);

	let req = await fetch(REST_API+'assets', {
		method:'post',
		headers: {
			'X-API-Key':clientId,
			'Authorization':`Bearer ${token}`,
			'Content-Type':'application/json'
		},
		body: body
	});

	let data = await req.json();
	return data;
}

async function uploadFile(url, filePath, mediaType) {

	let stream = fs.createReadStream(filePath);
	let stats = fs.statSync(filePath);
	let fileSizeInBytes = stats.size;

	let upload = await fetch(url, {
		method:'PUT', 
		redirect:'follow',
		headers: {
			'Content-Type':mediaType, 
			'Content-Length':fileSizeInBytes
		},
		duplex:'half',
		body:stream
	});

	if(upload.status === 200) return;
	else {
		throw('Bad result, handle later.');
	}

}

async function pollJob(url, token, clientId) {

	let status = null;
	let asset; 

	while(status !== 'done') {
		let req = await fetch(url, {
			method:'GET',
			headers: {
				'X-API-Key':clientId,
				'Authorization':`Bearer ${token}`,
			}
		});

		let res = await req.json();

		status = res.status;
		if(status === 'done') {
			asset = res;
		} else if(status == 'failed') {
			console.log('Job failed', res);
			process.exit(1);
		} else {
			await delay(2000);
		}
	}

	return asset;
}

async function downloadFile(url, filePath) {
	let res = await fetch(url);
	const body = Readable.fromWeb(res.body);
	const download_write_stream = fs.createWriteStream(filePath);
	return await finished(body.pipe(download_write_stream));
}

async function setFormDataJob(source, data, token, clientId) {

	let body = {
		'assetID': source.assetID,
		'jsonFormFieldsData':data
	}

	let resp = await fetch('https://pdf-services-ue1.adobe.io/operation/setformdata', {
		method: 'POST', 
		headers: {
			'Authorization':`Bearer ${token}`, 
			'X-API-KEY':clientId,
			'Content-Type':'application/json'
		},
		body:JSON.stringify(body)
	});

	return resp.headers.get('location');

}

(async () => {

	let input = [
		{ option_one: 'Yes', option_two: 'Off', option_three: 'Off', name: 'Jacob Smith', age: '90', favorite_movie: 'Star Wars' },
		{ option_one: 'Off', option_two: 'Off', option_three: 'Off', name: 'Zelda Camden', age: '12', favorite_movie: 'Star Wars Again' },
		{ option_one: 'Yes', option_two: 'Yes', option_three: 'Yes', name: 'Grace Undrapress', age: '45', favorite_movie: 'The Empire Strikes Back' },
	];

	let accessToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
	console.log('Got our access token.');

	let sourceAsset = await getUploadData('application/pdf', accessToken, CLIENT_ID);
	await uploadFile(sourceAsset.uploadUri, SOURCE_PDF, 'application/pdf');
	console.log('Source PDF Uploaded.');

	for(let i=0; i<input.length; i++) {

		let job = await setFormDataJob(sourceAsset, input[i], accessToken, CLIENT_ID);
		console.log('Job created. Now to poll it.');

		let result = await pollJob(job, accessToken, CLIENT_ID);
		console.log('Job is done.'); 

		await downloadFile(result.asset.downloadUri, `./test_import_${i+1}.pdf`);
		console.log(`Record ${i+1} imported and saved.`);
	}

	console.log('All Done');

})();