#!/usr/bin/env python3
import requests
import json
import re
import requests_cache

requests_cache.install_cache('trends_cache')

URL = 'http://www.google.com/trends/fetchComponent'

def fetch(query):
    resp = requests.get(URL, params={
        'q': ','.join(query),
        'cid': 'TIMESERIES_GRAPH_0',
        'export': '3',
        'hl': 'en',
    }, headers={
        'user-agent': 'distroclient/1.0',
    })
    resp.raise_for_status()
    js = resp.text.split('(', 1)[1].strip(';').strip(')')
    js = re.sub(r'new Date\((\d+),(\d+),(\d+)\)', r'[\1,\2,\3]',
                js)
    values = []
    for entry in json.loads(js)['table']['rows']:
        c = entry['c']
        date = c[0]['v']
        date = [date[0], date[1]]
        values.append((date, [
            d['v']
            for d in c[1:] ]))

    return values

if __name__ == '__main__':
    f = fetch(['lemon', 'orange'])
    print json.dumps(f, indent=4)
