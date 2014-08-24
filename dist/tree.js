var T=140
var NUM=807
var PADDING=30
var WIDTH=5000
var HEIGHT=5000
var SCALE_X=d3.scale.linear()
  .domain([1,140])
  .range([PADDING, WIDTH-PADDING])
var SCALE_Y=d3.scale.linear()
  .domain([0,806])
  .range([PADDING, HEIGHT-PADDING])

function set_time (t)
{
  
  vertsplit
    .attr("x1", SCALE_X(t))
    .attr("x2", SCALE_X(t))
  
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

function buildTree ()
{
  var nodes=[]
  var edges=[]
  var c=0
  
  function node (name, number, starttime)
  {
    this.name=name
    this.time=starttime
    this.number=number
    this.x=SCALE_X(starttime)
    this.y=SCALE_Y(number)
    this.radious=10
  }
  
  function edge (from, to)
  {
    this.time=Math.max(from.time, to.time)
    this.from=from
    this.to=to
  }
  
  function parseTree(tree)
  {
    var n=new node(tree.id, c++, dateToNumber[tree.release_date.slice(0,7)])
    nodes.push(n)
    if ("children" in tree)
    {
      tree.children.sort(function(a, b){return a.time<b.time})
      for (var i in tree.children)
        edges.push(new edge(n, parseTree(tree.children[i])))
    }
    return n
  }
  
  for (var i in treeData)
    parseTree(treeData[i])
  
  var line_between=d3.svg.diagonal()
    .source(function(d){return {"x":d.from.y, "y":d.from.x}})
    .target(function(d){return {"x":d.to.y, "y":d.to.x}})
    .projection(function(d){return [d.y, d.x]})
  
  var svg = d3.select("#tree-svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
  
  var slider = d3.select("#timeline")
    .style("width", WIDTH+"px")
    .attr("min", 1)
    .attr("max", T)
    .attr("value", WIDTH)
  
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
      .attr("r", function(d, i){return d.radious})
      .attr("cx", function(d, i){return d.x})
      .attr("cy", function(d, i){return d.y})
      .attr("class", "node")
      .attr("fill", "gray")
      .attr("stroke", d3.rgb(96,64,128))
      .attr("stroke-width", 2)
  
  circles.selectAll("text")
    .data(function(d) {return [d]})
    .enter().append("text")
      .text(function(d, i){return d.name})
      .attr("x", function(d, i){return d.x-d.radious-5})
      .attr("y", function(d, i){return d.y-d.radious-5})
      .style("fill", "black")
      .style("font", "20px")
  
  vertsplit=svg.select("line")
    .attr("stroke", "red")
    .attr("stroke-width", 5)
    .style("opacity", 0.5)
    .attr("y1", 0)
    .attr("y2", HEIGHT)

  document.getElementById("timeline")
          .addEventListener("input",
                            function(){set_time(document.getElementById("timeline").value)}
                            )
  
  set_time(1280)
}

function init()
{
  d3.json("distro_info.json", function(error, json)
  {
    treeData=json
    d3.json("months_list.json", function(error, json)
    {
      dateToNumber=json[0]
      numberToDate=json[1]
      d3.json("popularity.json",  function(error, json)
      {
        popularity=json
        buildTree()
      })
    })
  })
  
}
