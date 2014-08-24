import trends
import json
import collections

distros = {}

def walk(info):
    for distro in info:
        distros[distro['id']] = distro
        walk(distro['children'])

info = json.load(open('../../data/distro_info.json'))
walk(info)

dw_popularities = collections.defaultdict(int)

print len(distros.keys())

def find_dup():
    a = collections.defaultdict(list)
    for k, v in distros.items():
        a[v['name']].append(v)

    for v in a.values():
        if len(v) > 1:
            print v

for year in xrange(2002, 2015):
    info = json.load(open('../../data/popularity/%d.json' % year))
    for minfo in info.values():
        for k, v in minfo.items():
            dw_popularities[k] += v

items = dw_popularities.items()
items.sort(key=lambda x: -x[1])
items = [ k for k, _ in items[:6] ]
a = trends.fetch(items)

import matplotlib.pyplot as plt

for i in xrange(5):
    plt.plot([ itemki[i] for date, itemki in a ], label=items[i])

plt.show()
