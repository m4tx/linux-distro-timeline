#!/usr/bin/python3

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

from collections import defaultdict
from genericpath import isfile
import json

from os import listdir
from os.path import isdir, join
import sys

from optparse import OptionParser

# Parse options
opt_parser = OptionParser(usage="usage: %prog [options] DIRECTORY YEAR")
opt_parser.add_option("-p", "--pretty", action="store_true", dest="pretty",
                      help="pretty print the JSON")
(options, args) = opt_parser.parse_args()

if len(args) != 2:
    opt_parser.print_help()
    exit(-1)

# Arguments
BASE_DIR = args[0]
YEAR = args[1]

# List dirs matching to chosen year in chosen directory
dirs = [f for f in listdir(BASE_DIR) if
        isdir(join(BASE_DIR, f)) and f.startswith(YEAR)]
# Visits by distro IDs by month numbers
visit_dict = defaultdict(lambda: defaultdict(int))

for i in range(1, 13):  # Process the months
    dirs_m = [f for f in dirs if f.startswith(YEAR + "%02d" % i)]
    print("Processing month #%d..." % i, end='', file=sys.stderr)
    sys.stderr.flush()
    file_counter = 0
    visit_counter = 0

    for dir in dirs_m:  # Process current month
        path = join(BASE_DIR, dir)
        files = [f for f in listdir(path) if isfile(join(path, f))]
        for filename in files:
            file_counter += 1
            with open(join(path, filename), 'r', encoding='utf-8') as file:
                read = file.read()
                visits = read.count('\n')
                visit_dict[i][filename] += visits
                visit_counter += visits

    print(" Processed %d files; %d visits added." % (
        file_counter, visit_counter), file=sys.stderr)

# Print the JSON
if options.pretty:
    print(json.dumps(visit_dict, sort_keys=True, indent=4))
else:
    print(json.dumps(visit_dict, sort_keys=True, separators=(',', ':')))
