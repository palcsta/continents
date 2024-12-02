
import json
import os

# Load the JSON file
with open('all.json') as f:
    data = json.load(f)


for i in range(len(data)):
    url = (data[i]['flags']['svg'])
    print(os.system("wget "+url))
