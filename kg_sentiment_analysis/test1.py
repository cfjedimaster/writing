import os 
import requests 
import json 
import urllib.parse

token = os.environ.get("db_token")

query = 'type:Article tags.label:"Xbox" language:"en" sentiment<=0 date>"2025-03-03" sortBy:date'

apiCall = f"https://kg.diffbot.com/kg/v3/dql?type=query&token={token}&query={urllib.parse.quote(query)}&size=25"

req = requests.get(apiCall)
results = json.loads(req.content)
print(f"Total results, {results['hits']}")

for result in results["data"]:
	print(result["entity"]["title"])
	print(result["entity"]["date"]["str"])
	print(result["entity"]["summary"])
	if "author" in result["entity"]:
		print(result["entity"]["author"])
	print(result["entity"]["siteName"])
	print(result["entity"]["pageUrl"])
	print(result["entity"]["sentiment"])

	print("------------------------------------")

