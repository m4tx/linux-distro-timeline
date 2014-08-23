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
var OFFSET_X=30
var OFFSET_Y=30

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
  
  var nodes = []
  var edges = []
  var c=0
  
  function parseTree(tree)
  {
    n=new node(tree.name, c++, tree.time)
    nodes.push(n)
    if ("children" in tree)
      for (i in tree.children)
        edges.push(new edge(n, parseTree(tree.children[i])))
    return n
  }
  
  parseTree(treeData)
  
  var svg = d3.select("#tree-svg")
    .attr("width", 1280)
    .attr("height", 720)
  
  var root = svg.select("g")
    .attr("class", "tree_container")
  
  root.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", function(d, i){return 10})
      .attr("cx", function(d, i){return d.x})
      .attr("cy", function(d, i){return d.y})
      .attr("class", "node")
      .attr("fill", function(d, i){return d3.rgb(25*i, 25*i, 0)})
      .text(function(d){d.name})
  
  var line_between=d3.svg.diagonal()
    .source(function(d){return {"x":d.from.y, "y":d.from.x}})
    .target(function(d){return {"x":d.to.y, "y":d.to.x}})
    .projection(function(d){return [d.y, d.x]})
  
  root.selectAll("path")
    .data(edges)
    .enter().append("path")
      .attr("d", line_between)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", 2)
      
}
