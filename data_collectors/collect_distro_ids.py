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

import glob

import os
from os.path import join
import sys

id_set = set(
    f.split(os.sep)[-1] for f in glob.glob(join(sys.argv[1], "*", "*")))
# Remove non-existing "distros"
id_set = filter(lambda x: x not in ['INDEX', 'INDEX~', 'NEW', 'dwcz.sh',
                                    'netmax', 'pisi'], id_set)

print(sorted(id_set))