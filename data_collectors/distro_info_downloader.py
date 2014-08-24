#!/usr/bin/python
# python 2

# This file is part of linux-distro-timeline.
#
# linux-distro-timeline is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# linux-distro-timeline is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with linux-distro-timeline; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

from pyquery import PyQuery
from distro_ids import DISTRO_IDS
from urllib import urlopen
import json
import os.path


def print_log(text):
    print_log.log += text + '\n'
    print(text)
print_log.log = ''

def save_log():
    success = False
    with open('distro_info_downloader.log', 'w') as f:
        success = f.write(print_log.log) == None
    return success
    

def get_html_object(url):
    html_src = urlopen(url).read()
    return PyQuery(html_src)


def download_image(url, file_location):
    if os.path.isfile(file_location) == True:
        print_log('\t> Image already downloaded, skipping...')
        return True
    bin_data = urlopen(url).read()
    result = False
    with open(file_location, 'wb') as f:
        result = f.write(bin_data) == None
    if result == False and os.path.isfile(file_location):
        os.remove(file_location)
    return result


def process_distro(distro_id, distro_dict, root):
    print_log('Processing distro: %s' % distro_id)

    url_base = 'http://distrowatch.com/table.php?distribution='
    html = get_html_object(url_base + distro_id)
    info_table = html.find('body')[0].xpath('//th[contains(text(),\'Release Date\')]/../..')[0]

    cur_distro = distro_dict[distro_id]
    cur_distro['id'] = distro_id
    cur_distro['name'] = html.find('td.TablesTitle').find('h1').text()
    cur_distro['release_date'] = info_table.xpath('//th[contains(text(),\'Release Date\')]/../td[last()]')[0].text.replace('/', '-')
    cur_distro['desktop_environment'] = info_table.xpath('//th[contains(text(),\'Default Desktop\')]/../td[1]')[0].text
    cur_distro['package_manager'] = info_table.xpath('//th[contains(text(),\'Package Management\')]/../td[1]')[0].text

    parents = html.find('body')[0].xpath('//td[@class="TablesTitle"]/ul/li[2]/a/@href')
    print_log('\t> DEBUG: parents: %s' % str(parents))
    for distro in ['', distro_id]:
        if distro in parents:
            parents.remove(distro)

    if len(parents) == 0:
        print_log('\t> Root distro!')
    if len(parents) > 1:
        print_log('\t> Multi parent! List: %s' % str(parents))

    parent = distro_dict[parents[-1]] if parents else root
    parent['children'].append(distro_dict[distro_id])

    img_url = 'http://distrowatch.com/' + html.find('body')[0].xpath('//td[@class="TablesTitle"]/img/@src')[0]
    extension = img_url.split('.')[-1]
    file_location = '../data/img/%s.%s' % (distro_id, extension)
    if not download_image(img_url, file_location):
        print_log('\t> Image downloading error! Continuing...')


distro_dict = dict()
main_data = dict(id=0, children=[])
# Init dict
for distro_id in DISTRO_IDS:
    distro_dict[distro_id] = dict(id=None,
                                  name=None,
                                  release_date=None,
                                  desktop_environment=None,
                                  package_manager=None,
                                  children=[])

for distro_id in DISTRO_IDS:
    process_distro(distro_id, distro_dict, main_data)


data = json.dumps(main_data, sort_keys=True, separators=(',', ':'))
success = False
with open('../data/distro_info.json', 'w') as f:
    success = f.write(data) == None
print_log('Status: %s!' % ('done' if success else 'fail'))

print('Saving log status: %s!' % ('done' if save_log() else 'fail'))