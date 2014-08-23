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

var SCALE_X=5*3
var SCALE_Y=15*3
var OFFSET_X=0
var OFFSET_Y=30
var T=100

function set_time (t)
{
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
  
  circles.selectAll("text")
    .data(function(d) {return [d]})
    .enter().append("text")
      .text(function(d){d.name})
//     .text(function(d){d.name})
  
  vertsplit=svg.select("line")
    .attr("stroke", "red")
    .attr("stroke-width", 5)
    .style("opacity", 0.5)
    .attr("y1", 0)
    .attr("y2", 1280)
  
  set_time(1280)
}