
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
  
  // Colour codes colder than base
  	const coldColors = ['#dee2ed', '#afb8d3', '#7f8db8', '#6778aa', '#4f639d']
  	// Colour codes hotter that base
	const hotColors = ['#ffedba','#ffde7d','#ffb853', '#fa7433', '#eb4e33']
	
  const monthText = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec']
  
	  const baseTemp = dataset.baseTemperature;  
	  const totalWidth = 1200, totalHeight = 640;
	
	 const margin = {
	   top: 30,
	   right: 30,
	   bottom: 80,
	   left: 100
	 },chartWidth = totalWidth - margin.left - margin.right,
	 chartHeight = totalHeight - margin.top - margin.bottom;
	
   // Axies
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
  

   // Tooltipf
  const div = d3.select("#graph").append("div")
    .attr("class", "tooltip")
    .style("opacity",0);
  
  // Chart and data
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
			if ( d.temperature > 50 &&  d.temperature < 55 ) return coldColors[4];
			if ( d.temperature > 55 &&  d.temperature < 60) return coldColors[3];
			if ( d.temperature > 60 &&  d.temperature < 68) return coldColors[2];
			if ( d.temperature > 68 &&  d.temperature < 70) return coldColors[1];
			if ( d.temperature > 70 &&  d.temperature < 73 ) return hotColors[4];
			if ( d.temperature > 73 &&  d.temperature < 75) return hotColors[3];
			if ( d.temperature > 75 &&  d.temperature < 85) return hotColors[2];
			if ( d.temperature > 85 &&  d.temperature < 90) return hotColors[1];
			if (d.temperature >= 0) return hotColors[0];
		} else {
			if (d.temperature < -4) return coldColors[4];
			if (d.temperature < -3) return coldColors[3];
			if (d.temperature < -2) return coldColors[2];
			if (d.temperature < -1) return coldColors[1];
			if (d.temperature < 0) return coldColors[0];
		}
		return '#fff';  
	}


  // Bind data
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
          'Temperature Moy: ' + (d.temperature) + '&deg;<br/>' +
		  'Humidite Moy: ' + (d.humidite)  +
          '%;' ;
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

  // X-axis label
  chart.append("g")
    .append("text")
    .attr("x", totalWidth - margin.right - 220)
    .attr("y", totalHeight - margin.bottom)
    .attr("dy", "1.2em")
    .style("font-size", "14px")
    .text("Years");

  // Y-axis label
  chart.append("text")
    .attr("x", -90)
    .attr("y", -90)
    .attr("dy", "1.2em")
    .attr('transform', 'rotate(-90)')
    .style("font-size", "14px")
    .text("Month");

 // Key
  chart.append("text")
    .attr("x", 40)
    .attr("y", chartHeight + 20)
    .attr("dy", "1.2em")
    .style("font-size", "12px")
    .text("variance de Temperature/Humidité Moyennes  ");
 
 	const allColors = coldColors.reverse().concat(hotColors);
 	
 const keys = chart.selectAll("circle")
    .data(allColors)
    .enter()
    .append("circle")
    .attr('r', 15)
    .attr('cx', (d,i) => (i * 40) + margin.left)
    .attr('cy', totalHeight - 50)
    .style('fill', (d,i) => allColors[i]);
    
   
   chart.append('text')
   .text('50°')
   .attr("x", -50 + margin.left)
    .attr("y", totalHeight - 50)
    .attr("dy", ".3em")

   chart.append('text')
   .text('+75°')
   .attr("x", 380  + margin.left)
    .attr("y", totalHeight - 50)
    .attr("dy", ".3em")
        
  
})
