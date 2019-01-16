
d3.json("oussama.json", 
  	function(dataset) {
  	let xYears = []
  	dataset.forEach(y => {
  		if (!xYears.includes(y.year)) 
  			xYears.push(y.year);
  	});
	//console.log(Math.max(xYears ))
	xYears.push(2018)
  	console.log(xYears )
  
  
 
	const hotColors = [' #fcf3cf ','#f9e79f ','#f7dc6f ','#f8c471 ', '#f5b041', '#eb984e','#e67e22','#ca6f1e','#ba4a00','#a04000',' #873600','#6e2c00',' #561a13',' #31110e ']
	
  const monthText = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre','Novembre', 'Décembre']
  
	  const baseTemp = dataset.baseTemperature;  
	  const totalWidth = 1200, totalHeight = 640;
	
	 const margin = {
	   top: 30,
	   right: 30,
	   bottom: 80,
	   left: 100
	 },chartWidth = totalWidth - margin.left - margin.right,
	 chartHeight = totalHeight - margin.top - margin.bottom;
	
   // Axes
  const yAxisScale = d3.scaleLinear()
	 .range([25, chartHeight])
	 .domain([0,12]);
	 
  const yAxis = d3.axisLeft()
	 .scale(yAxisScale);
	  
  const xAxisScale = d3.scaleLinear()
	.domain([xYears[0],xYears[xYears.length-1]])
   .range([0, chartWidth]);
     
  const xAxis = d3.axisBottom(xAxisScale)
    //.ticks(32)
    .ticks(xYears.length )
    .tickFormat(d3.format("")); // remove any special number formats
  


  const div = d3.select("#graph").append("div")
    .attr("class", "tooltip")
    .style("opacity",0);
  
  
  const chart = d3.select(".chart")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   const monthLabels = chart.selectAll(".monthLabel")
    .data(monthText)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return i * 42;
    })
    .style("text-anchor", "end")
    .attr("transform", "translate(-10," + 50 + ")")
    .attr("class", "monthLbl");

  const yearExtent = d3.extent(dataset, (d) => d.year);
  console.log('ye' + yearExtent);
  const monthExtent = d3.extent(dataset, (d) => d.month);

  const yearScale = d3.scaleTime()
    .domain([new Date(yearExtent[0], 0), new Date(yearExtent[1], 0)])
    .range([margin.left * 1.8, chartWidth - margin.right]);
    
  const monthScale = d3.scaleTime()
    .domain([new Date(2015, monthExtent[1] - 1), new Date(2015, monthExtent[0] - 1)])
    .range([chartHeight - margin.top * 2, margin.bottom - 20]);    

	function varianceColour(d) {
		if (d.temperature >= 0) {
			if ( d.temperature >= 30 &&  d.temperature < 50 ) return hotColors[0];
			if ( d.temperature >= 50 &&  d.temperature < 53 ) return hotColors[1];
			if ( d.temperature >= 53 &&  d.temperature < 56) return hotColors[2];
			if ( d.temperature >= 56 &&  d.temperature < 59) return hotColors[3];
			if ( d.temperature >= 59 &&  d.temperature < 62) return hotColors[4];
			if ( d.temperature >= 62 &&  d.temperature < 65 ) return hotColors[5];
			if ( d.temperature >= 65 &&  d.temperature < 68) return hotColors[6];
			if ( d.temperature >= 68 &&  d.temperature < 71) return hotColors[7];
			if ( d.temperature >= 71 &&  d.temperature < 75) return hotColors[8];
			if ( d.temperature >= 75 &&  d.temperature < 77) return hotColors[9];
			if ( d.temperature >= 77 &&  d.temperature < 80) return hotColors[10];
			if ( d.temperature >= 80 &&  d.temperature < 82.8) return hotColors[11];
			if ( d.temperature >= 82.8 &&  d.temperature < 86) return hotColors[12];
			if ( d.temperature >= 86 &&  d.temperature < 90) return hotColors[13];
			
			
			
		}
		return '#fff';  
	}


  // Relier les données
  const blocks = chart.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('width', Math.ceil(chartWidth / 4))
    .attr('height', (chartHeight - (margin.top - 15) * 1.8)/12)
    .attr('x', (d) => xAxisScale(d.year))
    .attr('y', (d) => yAxisScale(d.month - 1))
    .attr('fill', (d) => varianceColour(d))
	 .on("mouseover", function(d) {
       div.transition()
         .duration(100)
         .style("opacity", 1.0);
       var htmlCode = d.year + '-' + monthText[d.month-1] + '<br/>' +
          'Temperature Moy: ' + (d.temperature) + '°F<br/>' 
		  ;
       div.html(htmlCode)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
    .on("mouseout", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", 0);
       });


  
 

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(xAxis);

  chart.append("g")
    .call(yAxis)
   .attr("opacity", "0"); // hide the ticks so only shows the month names

  // Étiquette d'axe X
  chart.append("g")
    .append("text")
    .attr("x", totalWidth - margin.right - 220)
    .attr("y", totalHeight - margin.bottom)
    .attr("dy", "1.2em")
    .style("font-size", "14px")
    .text("Années");

  // Étiquette d'axe Y
  chart.append("text")
    .attr("x", -90)
    .attr("y", -90)
    .attr("dy", "1.2em")
    .attr('transform', 'rotate(-90)')
    .style("font-size", "14px")
 

 /// Clé
  chart.append("text")
    .attr("x", 40)
    .attr("y", chartHeight + 20)
    .attr("dy", "1.2em")
    .style("font-size", "12px")
    .text("Variation de la temperature moyenne en Fahrenheit");
 
 	
 	
 const keys = chart.selectAll("circle")
    .data(hotColors)
    .enter()
    .append("circle")
    .attr('r', 15)
    .attr('cx', (d,i) => (i * 40) + margin.left)
    .attr('cy', totalHeight - 50)
    .style('fill', (d,i) => hotColors[i]);
    
   
   chart.append('text')
   .text('48°F')
   .attr("x", -50 + margin.left)
    .attr("y", totalHeight - 50)
    .attr("dy", ".3em")

   chart.append('text')
   .text('+90°F')
   .attr("x", 540  + margin.left)
    .attr("y", totalHeight - 50)
    .attr("dy", ".3em")
        
  
})
