/*
 * This file is part of linux-distro-timeline.
 *
 * linux-distro-timeline is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * linux-distro-timeline is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with linux-distro-timeline; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

var months = [["2002", "11"], ["2002", "12"], ["2003", "1"], ["2003", "10"], ["2003", "11"], ["2003", "12"], ["2003", "2"], ["2003", "3"], ["2003", "4"], ["2003", "5"], ["2003", "6"], ["2003", "7"], ["2003", "8"], ["2003", "9"], ["2004", "1"], ["2004", "10"], ["2004", "11"], ["2004", "12"], ["2004", "2"], ["2004", "3"], ["2004", "4"], ["2004", "5"], ["2004", "6"], ["2004", "7"], ["2004", "8"], ["2004", "9"], ["2005", "1"], ["2005", "10"], ["2005", "11"], ["2005", "12"], ["2005", "2"], ["2005", "3"], ["2005", "4"], ["2005", "5"], ["2005", "6"], ["2005", "7"], ["2005", "8"], ["2005", "9"], ["2006", "1"], ["2006", "10"], ["2006", "11"], ["2006", "12"], ["2006", "2"], ["2006", "3"], ["2006", "4"], ["2006", "5"], ["2006", "6"], ["2006", "7"], ["2006", "8"], ["2006", "9"], ["2007", "1"], ["2007", "10"], ["2007", "11"], ["2007", "12"], ["2007", "2"], ["2007", "3"], ["2007", "4"], ["2007", "5"], ["2007", "6"], ["2007", "7"], ["2007", "8"], ["2007", "9"], ["2008", "1"], ["2008", "10"], ["2008", "11"], ["2008", "12"], ["2008", "2"], ["2008", "3"], ["2008", "4"], ["2008", "5"], ["2008", "6"], ["2008", "7"], ["2008", "8"], ["2008", "9"], ["2009", "1"], ["2009", "10"], ["2009", "11"], ["2009", "12"], ["2009", "2"], ["2009", "3"], ["2009", "4"], ["2009", "5"], ["2009", "6"], ["2009", "7"], ["2009", "8"], ["2009", "9"], ["2010", "1"], ["2010", "10"], ["2010", "11"], ["2010", "12"], ["2010", "2"], ["2010", "3"], ["2010", "4"], ["2010", "5"], ["2010", "6"], ["2010", "7"], ["2010", "8"], ["2010", "9"], ["2011", "1"], ["2011", "10"], ["2011", "11"], ["2011", "12"], ["2011", "2"], ["2011", "3"], ["2011", "4"], ["2011", "5"], ["2011", "6"], ["2011", "7"], ["2011", "8"], ["2011", "9"], ["2012", "1"], ["2012", "10"], ["2012", "11"], ["2012", "12"], ["2012", "2"], ["2012", "3"], ["2012", "4"], ["2012", "5"], ["2012", "6"], ["2012", "7"], ["2012", "8"], ["2012", "9"], ["2013", "1"], ["2013", "10"], ["2013", "11"], ["2013", "12"], ["2013", "2"], ["2013", "3"], ["2013", "4"], ["2013", "5"], ["2013", "6"], ["2013", "7"], ["2013", "8"], ["2013", "9"], ["2014", "1"], ["2014", "2"], ["2014", "3"], ["2014", "4"], ["2014", "5"], ["2014", "6"]];

var monthText;

var treeData = {
 "name": "flare",
 "time": 10,
 "children": [
  {
   "name": "analytics",
   "time": 21,
   "children": [
    {
     "name": "cluster",
     "time": 33,
     "children": [
      {"name": "AgglomerativeCluster", "time": 39},
      {"name": "CommunityStructure", "time": 38},
      {"name": "MergeEdge", "time": 74}
     ]
    }]
   },
   {
    "name": "graph",
    "time": 20,
    "children": [
    {"name": "BetweennessCentrality", "time": 35},
    {"name": "LinkDistance", "time": 57}
    ]
   }
 ]
};

var SCALE_X=1280/140
var SCALE_Y=15*3
var OFFSET_X=0
var OFFSET_Y=30
var T=100

function set_time (t)
{
    month = months[Math.round(t / SCALE_X)];
    monthText.text(month[0] + "-" + (month[1].length == 1 ? "0" + month[1] : month[1]));

  vertsplit
    .attr("x1", t)
    .attr("x2", t)
  t/=SCALE_X

  lines
  .style("display", "block")
  .transition()
  .duration(T)
  .style("opacity", function(d){return d.time<t ? 1 : 0})
  .transition()
  .delay(T)
  .style("display", function(d){return d.time<t ? "block" :"none"})
  circles
  .style("display", "block")
  .transition()
  .duration(T)
  .style("opacity", function(d){return d.time<t ? 1 : 0})
  .transition()
  .delay(T)
  .style("display", function(d){return d.time<t ? "block" :"none"})
}

function getTooltipY(y) {
    var tmp = y - 132;
    if (tmp < 0) {
        tmp += 150;
    }
    return tmp;
}

function draw_tree()
{
  function node (name, number, starttime)
  {
    this.name=name
    this.time=starttime
    this.number=number
    this.x=starttime*SCALE_X+OFFSET_X
    this.y=number*SCALE_Y+OFFSET_Y
  }

  function edge (from, to)
  {
    this.time=Math.max(from.time, to.time)
    this.from=from
    this.to=to
  }

  var nodes=[]
  var edges=[]
  var c=0

  function parseTree(tree)
  {
    var n=new node(tree.name, c++, tree.time)
    nodes.push(n)
    if ("children" in tree)
    {
      tree.children.sort(function(a, b){return a.time<b.time})
      for (var i in tree.children)
        edges.push(new edge(n, parseTree(tree.children[i])))
    }
    return n
  }

  var line_between=d3.svg.diagonal()
  .source(function(d){return {"x":d.from.y, "y":d.from.x}})
  .target(function(d){return {"x":d.to.y, "y":d.to.x}})
  .projection(function(d){return [d.y, d.x]})

  parseTree(treeData)

  monthText = d3.select("#tree-svg").append("text")
                 .attr("x", 640)
                 .attr("y", 710)
                 .attr("text-anchor", "middle")
                 .text("2014-06")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "20px")
                 .attr("fill", "black");

  var svg = d3.select("#tree-svg")
  .attr("width", 1280)
    .attr("height", 720)

  var slider = d3.select("#timeline")
    .style("width", "1280px")
    .attr("min", 1)
    .attr("max", 1280)
    .attr("value", 1280)

  document.getElementById("timeline")
          .addEventListener("input",
                            function(){set_time(document.getElementById("timeline").value)}
                            )

  var root = svg.select("g")
    .attr("class", "tree_container")

  lines=root.selectAll("path")
    .data(edges)
    .enter().append("path")
      .attr("d", line_between)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", 2)

  circles=root.selectAll("g")
    .data(nodes)
    .enter().append("g")

  var div = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

  circles.selectAll("circle")
    .data(function(d) {return [d]})
    .enter().append("circle")
      .attr("r", function(d, i){return 10})
      .attr("cx", function(d, i){return d.x})
      .attr("cy", function(d, i){return d.y})
      .attr("class", "node")
      .attr("fill", "gray")
      .attr("stroke", d3.rgb(96,64,128))
      .attr("stroke-width", 2)
      .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9)
                .style("transform", "scale(1)");
            div.html("<img src=\"../data/img/" + d.id + "\">" + "<h3>"
                     + d.name + "</h3><br><strong>Package manager</strong>: "
                     + d.package_manager
                     + "<br><strong>First release</strong>: "
                     + d.release_data
                     + "<br><strong>Desktop environment</strong>: "
                     + d.desktop_environment)
                .style("left", (d.x - 160) + "px")
                .style("top", getTooltipY(d.y) + "px");
      })
      .on("mouseout", function() {
            div.transition()
                .duration(200)
                .style("opacity", 0)
                .style("transform", "scale(0.75)");
      });

  vertsplit=svg.select("line")
    .attr("stroke", "red")
    .attr("stroke-width", 5)
    .style("opacity", 0.5)
    .attr("y1", 0)
    .attr("y2", 1280)

  set_time(1280)
}
