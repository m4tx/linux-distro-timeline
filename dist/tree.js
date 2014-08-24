var T0=100, T=300
var NUM=805
var PADDING=30
var WIDTH=1800
var HEIGHT=900
var SCALE_X=d3.scale.linear()
  .domain([T0,T])
  .range([PADDING, WIDTH-PADDING])
var SCALE_Y=d3.scale.linear()
  .domain([0,NUM])
  .range([PADDING, HEIGHT-PADDING])
var monthText;

function set_time (t)
{
    monthText.text(numberToDate[t]);

  vertsplit
    .attr("x1", SCALE_X(t))
    .attr("x2", SCALE_X(t))

  lines
  .style("display", "block")
  .transition()
  .duration(T)
  .style("opacity", function(d){return d.time<t ? 0.3 : 0})
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
  
  var now=numberToDate[t]
  var year=now.slice(0,4)
  var month=now[5]=="0" ? now.slice(6,7) : now.slice(5,7)
  var size_now=popularity[year][month]
  if (size_now===undefined)
    return
  for (var distro in size_now)
    nodedict[distro].hits=size_now[distro]
  circles.selectAll("circle")
    .attr("r", function(d, i){return Math.pow(d.hits, 0.3)})
  circles.selectAll("text")
    .attr("visibility", function(d, i){ return Math.pow(d.hits, 0.3)>10 ? "visible" : "hidden" })
  
}

function getTooltipX(x) {
    var tmp = x - 160;
    if (tmp < 0) {
        tmp = 0;
    } else if (tmp > WIDTH - 325) {
        tmp = WIDTH - 325;
    }
    return tmp;
}

function getTooltipY(y) {
    var tmp = y - 132;
    if (tmp < 0) {
        tmp += 150;
    }
    return tmp;
}

function buildTree ()
{
  var nodes=[]
  nodedict={}
  var edges=[]
  var c=0

  function node (id, number, release_date, name, desktop_environment, package_manager)  {
    this.id=id
    this.time=dateToNumber[release_date.slice(0,7)]
    if (this.time==undefined || this.time<T0)
      this.time=T0
    this.number=number
    this.x=SCALE_X(this.time)
    this.y=SCALE_Y(number)
    this.hits=10

    this.date=release_date
    this.name=name
    this.desktop_enviroment=desktop_environment
    this.package_manager=package_manager
  }

  function edge (from, to)
  {
    this.time=Math.max(from.time, to.time)
    this.from=from
    this.to=to
  }

  function parseTree(tree)
  {
    var n=new node(tree.id, c++, tree.release_date, tree.name, tree.desktop_environment, tree.package_manager)
    nodes.push(n)
    nodedict[n.id]=n
    if ("children" in tree)
    {
      tree.children.sort(function(a, b){return a.time<b.time})
      for (var i in tree.children)
        edges.push(new edge(n, parseTree(tree.children[i])))
    }
    return n
  }

  for (var i in treeData.children)
    parseTree(treeData.children[i])

  var line_between=d3.svg.diagonal()
    .source(function(d){return {"x":d.from.y, "y":d.from.x}})
    .target(function(d){return {"x":d.to.y, "y":d.to.x}})
    .projection(function(d){return [d.y, d.x]})

  var svg = d3.select("#tree-svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

  monthText = svg.append("text")
                 .attr("x", 10)
                 .attr("y", 25)
                 .text("2014-06")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "20px")
                 .attr("fill", "black");

   var div = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

  var slider = d3.select("#timeline")
    .style("width", WIDTH+"px")
    .attr("min", T0)
    .attr("max", T)
    .attr("value", T-10)

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
      .attr("r", 10)
      .attr("cx", function(d, i){return d.x})
      .attr("cy", function(d, i){return d.y})
      .attr("class", "node")
      .attr("fill", "white")
      .attr("stroke", d3.rgb(96,64,128))
      .attr("stroke-width", 2)
      .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9)
                .style("transform", "scale(1)");
            div.html("<img src=\"img/" + d.id + ".png\">" + "<h3>"
                     + d.name + "</h3><br><strong>Package manager</strong>: "
                     + d.package_manager
                     + "<br><strong>First release</strong>: "
                     + d.date
                     + "<br><strong>Desktop environment</strong>: "
                     + d.desktop_enviroment)
                .style("left", getTooltipX(d.x) + "px")
                .style("top", getTooltipY(d.y) + "px");
      })
      .on("mouseout", function() {
            div.transition()
                .duration(200)
                .style("opacity", 0)
                .style("transform", "scale(0.75)");
      });
  
  circles.selectAll("text")
    .data(function(d) {return [d]})
    .enter().append("text")
      .text(function(d, i){return d.name})
      .attr("x", function(d, i){return d.x-10})
      .attr("y", function(d, i){return d.y-15})
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
  
  set_time(T-10)
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
