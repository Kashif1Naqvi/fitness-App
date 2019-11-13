const margin ={top:40 , left:100 , right:20 , bottom:50}
const graphWidth = 560 - margin.left - margin.right
const graphHeight = 400 - margin.top - margin.bottom
const svg = d3.select(".canvas")
            .append("svg")
            .attr("width", graphWidth  + margin.left + margin.right)
            .attr("height",graphHeight + margin.top  + margin.bottom)
const graph = svg.append("g")
               .attr("height",graphHeight)
               .attr("width",graphWidth)
               .attr("transform",`translate(${margin.left},${margin.top})`);
const tip = d3.select("body").append("div").attr("class","tip")

const x = d3.scaleTime().range([0,graphWidth])
const y = d3.scaleLinear().range([graphHeight,0])

const xAxisGroup = graph.append("g")
            .attr("class","x-axis")
            .attr("transform","translate(0," + graphHeight + ")");
const yAxisGroup = graph.append("g")
            .attr("class","y-axis");
const path = graph.append("path")
const line = d3.line()
             .x(function(d){
               return x(new Date(d.date))
             })
             .y(function(d){
               return y(d.distance)
             });
const dottedLine  = graph.append("g").attr("class","line").style("opacity",0)

const xDottedLine = dottedLine.append("line").attr("stroke","#aaa").attr("stroke-width",1).attr("stroke-dasharray",4)
const yDottedLine = dottedLine.append("line").attr("stroke","#aaa").attr("stroke-width",1).attr("stroke-dasharray",4)

const update = (data) => {
  data =  data.filter(item => item.activity == activity )
  data.sort((a,b)=> new Date(a.date) - new Date(b.date))
  x.domain(d3.extent(data , d => new Date(d.date)));
  y.domain([0,d3.max(data , d => d.distance)]);

  const circle = graph.selectAll("circle")
                      .data(data)
        circle.exit().remove()
          path.data([data])
            .attr("fill","none")
            .attr("stroke","#00bfa5")
            .attr("stroke-width",2)
            .attr("d",line)
       circle
            .attr("cx",d=>x(new Date(d.date) ))
            .attr("cy",d=>y(d.distance))


       circle.enter()
       .append("circle")
       .attr("r",4)
       .attr("cx",d=>x(new Date(d.date) ))
       .attr("cy",d=>y(d.distance))
       .attr("fill","#fff");

graph.selectAll("circle")
      .on("mouseover",(d,i,n)=>{
        tip.html("<div>"+ d.distance +"m</div><br><p>"+d.date+"</p>")
        .style("top" , function(d,i){
          return (d3.event.pageY-125)+i+"px"
        })
        .style("left",function(d,i){
          return (d3.event.pageX-45)+i+ "px"
        })
        .transition()
        .duration(700)
        .delay(i*20)
        .style('opacity',.9)
        d3.select(n[i])
          .transition()
          .duration(100)
          .attr("r",8)
          .attr("fill","#fff")

          xDottedLine
            .attr("x1",x(new Date(d.date)))
            .attr("x2",x(new Date(d.date)))
            .attr("y1",graphHeight)
            .attr("y2",y(d.distance))
          yDottedLine
            .attr("x1",0)
            .attr("x2",x(new Date(d.date)))
            .attr("y1",y(d.distance))
            .attr("y2",y(d.distance))

            dottedLine.style("opacity",1)
      })
      .on("mouseout",(d,i,n)=>{
        tip.html("")
        d3.select(n[i])
          .transition()
          .duration(100)
          .attr("r",4)
          .attr("fill","#fff");
          dottedLine.style("opacity",0)

      })
const xAxis = d3.axisBottom(x)
                .ticks(6)
                .tickFormat(d3.timeFormat('%b %d'));

const yAxis = d3.axisLeft(y)
                .ticks(4)
                .tickFormat(d => d + "m");

  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)

  xAxisGroup.selectAll("text")
            .attr("transform","rotate(-25)")
            .attr("text-anchor","end");

}

var data = [];
db.collection("activities").onSnapshot(res=>{
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id:change.doc.id  };
    console.log(doc)
    switch(change.type){
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index  = data.findIndex(item => doc.item  == doc.id  );
        data[index] = doc;
        break;
      case 'removed':
        data.filter( item =>  item.id !== doc.id );
        break;
    }
  })
  update(data)
})
