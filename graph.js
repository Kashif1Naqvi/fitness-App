let margin ={top:40 , left:100 , right:20 , bottom:50}
let graphWidth = 560 - margin.left - margin.right
let graphHeight = 400 - margin.top - margin.bottom

let svg = d3.select(".canvas").append("svg")
            .attr("width",graphWidth+ margin.left + margin.right)
            .attr("height",graphHeight + margin.top + margin.bottom)
let graph = svg.append("g")
               .attr("height",graphHeight)
               .attr("width",graphWidth)
               .attr("transform",`translate(${margin.left},${margin.top})`)

const update = (data) => {

}

var data = [];
db.collection("activities").onSnapshot(res=>{
  res.docChanges().forEach(change => {
    let doc = { ...change.doc.data(), id:change.doc.id  };
    switch(change.type){
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        let index  = data.findIndex(item => doc.item  == doc.id  );
        data[index] = doc;
        break;
      case 'removed':
        data.filter( item =>  item.id !== doc.id );
        break;
    }
  })
  update(data)
})
