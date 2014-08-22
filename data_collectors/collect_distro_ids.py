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

from os import listdir
from os.path import isfile, isdir, join
import sys

dirs = [f for f in listdir(sys.argv[1]) if isdir(join(sys.argv[1], f))]
id_set = set()
for dir in dirs:
    path = join(sys.argv[1], dir)
    files = [f for f in listdir(path) if isfile(join(path, f))]
    for file in files:
        id_set.add(file)

print(sorted(id_set))