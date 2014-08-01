vismethods = function() {
  var vismethods = { version: "0.0.1" }; 

  // 0: orange, blue
  // 1: purple, green
  // 2: blue, green (http://colorbrewer2.org/?type=qualitative&scheme=Set1&n=3)
  // 3: blue, orange (http://colorbrewer2.org/?type=qualitative&scheme=Set2&n=3)
  var colorOptions = [
    {A: "rgb(255, 197, 145)", B: "rgb(122, 161, 255)"},
    {A: "#af8dc3", B: "#7fbf7b"},
    {A: "#377eb8", B: "#4daf4a"},
    {A: "#8da0cb", B: "#fc8d62"},
    {A: "rgb(255, 0, 0)", B: "rgb(0, 0, 255)"}
  ];

  // ScatterPlot requires dataset in the structure [[x1,y1],[x2,y2]]. 
  vismethods.getScatterPlot = function (params) {
    var data          = []
      , extentOverall = -1
      , margins       = 20
	    , pSize         = 3
	    , target        = ''
	    , extent        = -1
	    , factor        = 1
	    , showBox       = false
      , boxData       = []
      , showline      = 'false'; 
    
    if(params){
	    if(params.data)
	      data = params.data;
	    if(params.extent)
	      extent = params.extent;	     	
	    if(params.target)  
	      target = '#' + params.target;
	    if(params.showBox)
	    	showBox = params.showBox
	    if(params.pSize)
	    	pSize = params.pSize
	    if(params.margins)
	    	margins = params.margins
	    if(params.factor)
	    	factor = params.factor
      if(params.showline)
        showline = params.showline

    }
    
    extentOverall = extent + margins * 2;
    
    var width  = extent
      , height = extent
      , margin = {
	        top:     margins,
	        right:   margins,
	        bottom:  margins,
	        left:    margins
      };
        
    if(factor != 1)
    	data = gen.setBox({d: data, w: 90, h: 400, factor: factor})
    
    var x = d3.scale.linear().domain([0,width]).range([0,width]);
    var y = d3.scale.linear().domain([0,height]).range([height,0]);

    var chart = d3.select(target).append('svg:svg')
	    .attr('width', extentOverall).attr('height', extentOverall)
	    .attr('class', 'chart')

    var main = chart.append('g')
	    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	    .attr('width', width).attr('height', height).attr('class', 'main')

    // draw the x axis
    var xAxis = d3.svg.axis()
      .scale(x)
      .tickFormat(function(d){ return ''; })
      .tickSize(0)
      .orient('top');

    main.append('g')
	    .attr('transform', 'translate(' + 0 + ',' + height + ')')
	    .attr('class', 'main axis date').call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
      .scale(y)
      .tickFormat(function(d){ return ''; })
      .tickSize(0)
      .orient('right');

    main.append('g')
	    .attr('class', 'main axis date').call(yAxis);

    var g = main.append("svg:g");

    g.selectAll('div').data(data).enter().append("svg:circle")
	    .attr("cx", function(d) { return x(d[0]); })
      .attr("cy", function(d) { return y(d[1]); })
      .attr("r", pSize);
    
    if(showline === 'true'){
    	 data.sort(function(a,b){ return a[0] - b[0]});

    var line = d3.svg.line()
        .x(function(d) {return x(d[0]);})
        .y(function(d) {return y(d[1]);});
    
     var gs = g.append("path")
     .datum(data)
       .attr('d', line)
       .attr('stroke', 'black')
       .attr('stroke-size', 1)
       .attr('fill', 'none')	   	
    }
    
    var box = getBox(gen.rot(data, 45 ,'counterclockwise'))

    return box;
 }

  vismethods.getParaCoord = function (params) {
	  var data          = []
	    , extentOverall = -1
	    , margins       = 20
		  , target        = ''
		  , extent        = -1
	    , boxData       = []
	    , alpha         = 1;

	  if(params) {
		  if(params.data)
		    data = params.data;
		  if(params.extent)
		    extent = params.extent;	     	
		  if(params.target)  
		    target = '#' + params.target;
		  if(params.margins)
		    margins = params.margins;
			if(params.alpha)
				alpha = params.alpha;
	  }
	    
	  extentOverall = extent + margins * 2;
	  
	  var width  = extent
	    , height = extent
	    , margin = {
		      top:     margins,
		      right:   margins,
		      bottom:  margins,
		      left:    margins
	    };
	       
	  var box = getBox(gen.rot(data, 45 ,'counterclockwise'))
	  var x = d3.scale.linear().domain([0,width]).range([0,width]);
	  var y = d3.scale.linear().domain([0,height]).range([height,0]);

	  var chart = d3.select(target).append('svg:svg')
		  .attr('width', extentOverall).attr('height', extentOverall)
		  .attr('class', 'chart')

	  var main = chart.append('g')
		  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		  .attr('width', width).attr('height', height).attr('class', 'main')

	    // draw the x axis
	    var xAxis = d3.svg.axis()
	      .scale(x)
	      .tickFormat(function(d){ return ''; })
	      .tickSize(0)
	      .orient('left');

	    main.append('g')
		    .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
		    .attr('class', 'main axis date').call(xAxis);

	    // draw the y axis
	    var yAxis = d3.svg.axis()
	      .scale(y)
	      .tickFormat(function(d){ return ''; })
	      .tickSize(0)
	      .orient('left');

	    main.append('g')
	        .attr('transform', 'translate(' + width + ',' + 0 + ')')
		    .attr('class', 'main axis date').call(yAxis);

	    var g = main.append("svg:g");

	    g.selectAll('div').data(data).enter().append("svg:line")
	    .attr('x1',function(d){return x(0)})
	    .attr('y1',function(d){return y(d[0])})
	    .attr('x2',function(d){return x(width)})
	    .attr('y2',function(d){return y(d[1])}
	    )
	    .style('stroke', 'rgba(0,0,0,'+alpha+')')
	    .attr('stroke-size', 1)	    

	    d3.selectAll('#box').append('p')
	      .html("r = " + gen.corr(data).toFixed(4));
	            
	  // box {{x1, y1, x2, y2}, {x1, y1, x2, y2},{x1, y1, x2, y2},{x1, y1, x2, y2}, {w , d}}
	   return box;
  }
  
  
  //Donut requires dataset in the structure [[x1,y1],[x2,y2]]. 
  vismethods.getDonut = function(params) {
    var data          = []
      , extentOverall = -1
      , margins       = 20
	    , target        = ''
	    , extent        = -1 
	    , n             = -1
	    , r             = 1  
	    , order         = 0 
	    , stack         = '100%';
	    	
    if(params) {
	    if(params.data)
	      data = params.data;
	    if(params.extent)
	      extent = params.extent;	
	    if(params.target)  
	      target = '#' + params.target;
		  if(params.margins)
        margins = params.margins;
  		if(params.r)
        r = params.r;
      if(params.stack)
        r = params.stack;
      if(params.order)
        order = params.order;
    }

    extentOverall = extent + margins * 2;

    n = data.length;

    var width  = extent
      , height = extent
      , margin = {
	        top : margins,
	        right : margins,
	        bottom : margins,
	        left : margins
      }; 
    
    var chart = d3.select(target).append('svg:svg')
	    .attr('width', extentOverall)
      .attr('height', extentOverall)
	    .attr('class', 'chart');

    var main = chart.append('g')
	    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	    .attr('width', width).attr('height', height)
      .attr('class', 'main');
 
    var g = main.append('svg:g')
      .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');
    
    if(order) data.sort(function(a, b){ return (a[0] - b[0])})
    
    if(stack = 'stacked') { 
      var maxsum = -1;
      data.forEach(function(d) { // get the max (xi + yi)
    	  maxsum = (maxsum > (d[0] + d[1])) ? maxsum : (d[0] + d[1]);
      })
    
      // compute the top white space for a pair (x , y) ,white space = max - (xi + yi)
      data.forEach(function(d){
        d.push(maxsum - (d[1] + d[0]));
      })
    }  
   
    var arcdata = arcsdataFunc(data);
       
    g.selectAll("path")
      .data(arcdata)
      .enter().append("path")         
      .attr("fill", function(d) { return d.color })
      .attr("d", d3.svg.arc());
      
    function arcsdataFunc(d) {
	    var pies = [], colors = [];
	    
      // if I set it to 1, there will be some margins between bands
      var innerRadius = extent / 4.0
        , bandWidth   = extent / n / 4.0
        , xColor      = colorOptions[3].A 
        , yColor      = colorOptions[3].B
        , arcsdata    = [];
	   
      var pie = d3.layout.pie().sort(null);
      
      for (var j = 0; j < d.length; j++){
        // push a [[startAngle, endAngle],[startAngle, endAngle]] every time 	  
    	  var arr = [d[j][0], d[j][1], d[j][2]]; // add the value of white space
      	pies.push( pie(arr) );
        // push colors respectively
      	colors.push([xColor, yColor,'white']); // add the color for white space
      }
      
      // put all [startAngle, endAngle] in one array
      var k = 0;
      for (var i = 0; i < pies.length; i++){
      	for(var j = 0 ; j < pies[i].length; j++){
      	  arcsdata[k] = pies[i][j] 
          arcsdata[k].innerRadius = innerRadius + i * bandWidth;
          arcsdata[k].outerRadius = arcsdata[k].innerRadius + bandWidth;
          arcsdata[k].color = colors[i][j];
          k++;
      	}
      }   

      return arcsdata;
    }
  }

  // input [[x1,y1],[x2,y2]]
  // Radar requires dataset in the structure [[x1,x2,x3],[y1,y2,y3]]
  // Reform dataset in this func
  // Call reform3 in this file
  vismethods.getRadar = function (params) {	
    var data          = []
      , extentOverall = -1
      , margins       = 20
	    , target        = ''
      , order         = 0
      , extent        = -1
      , strokeSize    = 2
      , oneline       = 'false'
      , order         = 0
	    , uniformAxis   = 'simple';
		  
    if(params){
	    if(params.data)
	      data = params.data;
	    if(params.extent)
	      extent = params.extent;	     	
	    if(params.target)  
	      target = '#' + params.target;
	    if(params.margins)
        margins = params.margins
      if(params.order || params.order === 0);
	      order = params.order;
      if(params.strokeSize)
        strokeSize = params.strokeSize;
      if(params.oneline)
        oneline = params.oneline;
      if(params.uniformAxis)
        uniformAxis = params.uniformAxis;
    }

    extentOverall = extent + margins * 2;
    
    var width  = extent
      , height = extent
      , margin = {
	      top : margins,
	      right : margins,
	      bottom : margins,
	      left : margins
      }; 
      
    var radius = d3.scale.linear().domain([0, width]).range([0, width/2])
      , angle = d3.scale.linear().domain([0, height]).range([0, 2 * Math.PI]);
    
    var n      = data.length
      , xColor = colorOptions[3].A
      , yColor = colorOptions[3].B;
    	
    var chart = d3.select(target).append('svg:svg')
  	  .attr('width', extentOverall)
      .attr('height', extentOverall)
  	  .attr('class', 'chart');
  
    var main = chart.append('g')
  	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  	  .attr('width', width)
      .attr('height', height)
      .attr('class', 'main');
  
    var g = main.append('svg:g')    
      .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');
      
    // in order to make the x and y lines clearer, put the axes under these two lines
    if(uniformAxis === 'true') {
   	  var lineAxes = g.selectAll('line-ticks')
        .data(data)
        .enter().append('svg:g')
        .attr("transform", function (d, i) {
          return "rotate(" + ((i / n * 360) - 90) + ") " 
           + "translate(" + radius(width) + ")";
        });
 
     lineAxes.append('line')
      .attr("x2", -1 * radius(width))
      .style("stroke", 'rgb(190,190,190)') // a light gray
      .style('stoke-with', strokeSize / 2.0)
      .style("fill", "none");
   
    } else if (uniformAxis === 'simple') {

    var lineAxes = g.selectAll('line-ticks')
      .data([0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5])
      .enter().append('svg:g')
      .attr("transform", function (d, i) {
        return "rotate(" + ((d / n * 360) - 90) + ") " 
          + "translate(" + radius(width) + ")";
      });

     lineAxes.append('line')
       .attr("x2", -1 * radius(width))
       .style("stroke", 'rgb(190,190,190)') // a light gray
       .style('stoke-with', strokeSize / 2.0)
       .style("fill", "none");
    
    } else {
    	
     var lineAxes = g.selectAll('line-ticks')
       .data(data)
       .enter().append('svg:g')
       .attr("transform", function (d, i) {
         return "rotate(" + ((d[1] / extent * 360) - 90) + ") " 
           + "translate(" + radius(width) + ")";
        });
     
     lineAxes.append('line')
       .attr("x2", -1 * radius(width))
       .style("stroke", 'rgb(190,190,190)') // a light gray
       .style('stoke-with', strokeSize / 2.0)
       .style("fill", "none");

    }
    
    if( oneline === 'true' ) {     
    	// sort by x in order to connect points in order
      data.sort(function(a,b){ return a[1] - b[1]});  	 

    	// add radar path
    	var line = d3.svg.line.radial()
        .radius(function(d){
    	    return radius(d[0]);
    	  })
    	  .angle(function(d) {
          return angle(d[1]);
    	  });

    	 // append path
    	 var gs = g.append('path')
    	   .datum(data)
    	   .attr('d', line)
    	   .attr('stroke', 'black') 
    	   .attr('stroke-size', strokeSize / 2.0)
    	   .attr('fill','none');    	    

    } else {

      // sort data according to x coordinates
      if(order === 1) data.sort(function(a,b){ return a[0] - b[0]; });
  
      // input structure[[x1,y1],[x2,y2],[x3,y3]], output[[x1,x2,x3],[y1,y2,y3]]
      data = gen.oneToTwo(data);
  
      var groups = g.selectAll('xyLines')
        .data(data)
        .enter().append("g")
        .style('fill', function (d, i) {
          if (i === 0)
            return xColor;
          else
            return yColor;
        })
        .style('stroke', function (d, i) {
          if (i === 0)
            return xColor;
          else
            return yColor;
        })
  
      var radialLines = d3.svg.line.radial()
        .radius(function (d) { return 0; })
        .angle(function (d, i) {
          if (i === n) i = 0;
          return (i / n) * 2 * Math.PI;
        });

      var lines = groups.append('path')
        .attr("d", radialLines)
        .style("stroke-width", strokeSize)
        .style("fill", "none");

      var radialPaths = d3.svg.line.radial()
        .radius(function (d) { return radius(d); })
        .angle(function (d, i) {
          if (i === n) i = 0;
          return (i / n) * 2 * Math.PI;
        });
       
      lines.attr("d", radialPaths);
   }

  }

  // LineChart requires dataset in the structure [[x1,x2,x3],[y1,y2,y3]]
  // Reform dataset in this func
  // Call reform3 in this file
  // 4 pixels between each 'data' point
  // 4 pixels because the extent is 400 while the size of dataset is 100
  // stack = 1, x vs x + y; stack = 2, x vs y percentage 
  vismethods.getLineChart = function (params) {
    var data          = []
      , extentOverall = -1
      , margins       = 20
	    , target        = ''
	    , extent        = -1
      , stack         = 'regular'
      , strokeSize    = 2
      , alpha         = 1
      , order         = 1
      , filled        = 'false'
      , cheating      = 'false'; 
	
    if(params) {
	    if(params.data)
	      data = params.data;
      if(params.extent)
        extent = params.extent;	     	
      if(params.target)  
	      target = '#' + params.target;
      if(params.stack)  
        stack = params.stack;
      if(params.margins)
        margins = params.margins;
      if(params.strokeSize)
        strokeSize = params.strokeSize;
      if(params.order || params.order === 0)  
  		  order = params.order;
      if(params.alpha)
        alpha = params.alpha;
      if(params.filled)
    	  filled = params.filled;
      if(params.cheating)
    	  cheating = params.cheating;
    }
    
    extentOverall = extent + margins * 2;
    
    var width  = extent
      , height = extent
      , margin = {
	      top : margins,
	      right : margins,
	      bottom : margins,
	      left : margins
      }; 
 
    var yDomain = height;

    // sort data according to x coordinates
    // in stack 2, we can get rid of this
    if(order) data.sort(function(a,b){ return a[0] - b[0] })
  
    //input structure[[x1,y1],[x2,y2],[x3,y3]], output[[x1,x2,x3],[y1,y2,y3]]
    data = gen.oneToTwo(data);
  	 
    if (stack === 'stacked') {
      data = gen.getStack(data);
  	  yDomain = d3.max(data[1]);
    } else if (stack === 'percentage') {
      data = gen.getPercentage(data);
      yDomain = d3.max(data[1]);
    }
  	 	 
    var xScale = d3.scale.linear().domain([0,width]).range([0,width]);
    var yScale = d3.scale.linear().domain([0,yDomain]).range([height,0]);
  
    var chart = d3.select(target).append('svg:svg')
  	  .attr('width', extentOverall)
      .attr('height', extentOverall)
  	  .attr('class', 'chart');
  
    var main = chart.append('g')
  	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  	  .attr('width', width)
      .attr('height', height)
      .attr('class', 'main');
   
    var n = data[0].length
      , xColor = colorOptions[3].A 
      , yColor = colorOptions[3].B
      , step = extent / n;
  
    var g = main.append('svg:g');
    
    if (filled === 'true'){
    	// additional points to help close path
    	data[0].unshift(0);
    	data[1].unshift(0);
    	data[0].push(0);
    	data[1].push(0);
    }
    
    var line = d3.svg.line()
      .x(function(d,i) { 
  	    if(filled === 'true')
  	  	  i = i - 1; // move the 1st additional point out of canvas
  	    if(i === -1)
  	      i = 0; // set the 1st additional point to (0, 0)
  	    if(i === n)
      	  i = n - 1; // set the last additional point to (n - 1, 0)
  	    return xScale(i * step); 
      })
    .y(function(d,i) { 
    	if(cheating === 'true')
    	  return yScale(d / 2 + height / 4); 
    	else
    		return yScale(d)
    });
  
    // switch x and y array in order to change the order of drawing
	  var tmp = data[0];
	  data[0] = data[1];
	  data[1] = tmp;
	
    var gs = g.selectAll('lines')
      .data(data)
      .enter().append('g')
   
    gs.append("path")
      .attr("d", line)
      .attr('stroke', function(d, i) { return i === 0 ? yColor : xColor;}) // switched color
      .attr('stroke-size', strokeSize)
      .attr('fill', function(d, i){ 
        if (filled === 'true') 
          return i === 0 ? yColor : xColor; // switched color
        else
       	 return 'none';
      })
      .attr('opacity', alpha);
   
   // draw the x axis after plot
   var xAxis = d3.svg.axis()
   	.scale(xScale)
   	.tickFormat(function(d){ return ''; })
   	.tickSize(0)
   	.orient('top');
 
   main.append('g')
 	  .attr('transform', 'translate(' + 0 + ',' + height + ')')
 	  .attr('class', 'main axis date').call(xAxis);
 
   // draw the y axis plot
   var yAxis = d3.svg.axis()
     .scale(yScale)
     .tickFormat(function(d){return '';})
     .tickSize(0)
     .orient('right');
   
   main.append('g')
     .attr('class', 'main axis date')
     .call(yAxis);
   
  }

  // BarChart requires dataset in the structure [[x1,x2,x3],[y1,y2,y3]]
  // Reform dataset in this func
  // Call reform3 in this file
  // draw a x bar every 4 pixel and then a y bar
  // 4 pixel because the extent is 400 while the size of dataset is 100
  // 2 pixel of margin bewteen a pair (x, y)
  vismethods.getBarChart = function (params) {
    var data          = []
      , extentOverall = -1
      , margins       = 20
	    , target        = ''
	    , extent        = -1
      , stack         = 'regular'
      , order         = 1
      , offset        = 'false'
      , showline      = 'false';
	
    if(params){
	    if(params.data)
	      data = params.data;
	    if(params.extent)
	      extent = params.extent;	     	
	    if(params.target)  
	      target = '#' + params.target
        if(params.stack)  
  		  stack = params.stack;
        if(params.order || params.order === 0)  
  		  order = params.order;
    	if(params.alpha)
          alpha = params.alpha;
  		if(params.margins)
          margins = params.margins;
		if(params.offset)
			offset = params.offset;
		if(params.showline)
			showline = params.showline;
    }
    extentOverall = extent + margins * 2;
    
    var width  = extent
      , height = extent
      , margin = {
	      top : margins,
	      right : margins,
	      bottom : margins,
	      left : margins
      }; 
    
    var yDomain = height;

    // sort data according to x coordinates
    if(order) data.sort(function(a,b){ return a[0] - b[0] })
  
    //input structure[[x1,y1],[x2,y2],[x3,y3]], output[[x1,x2,x3],[y1,y2,y3]]
    data = gen.oneToTwo(data);
  	 
    if (stack === 'stacked'){
      data = gen.getStack(data);
  	  yDomain = d3.max(data[1]);
    }else if (stack === 'percentage'){
      data = gen.getPercentage(data);
      yDomain = d3.max(data[1]);
    }
    var xScale = d3.scale.linear().domain([0,width]).range([0,width])
    var yScale = d3.scale.linear().domain([0,yDomain]).range([height,0])
  
    var chart = d3.select(target).append('svg:svg')
  	  .attr('width', extentOverall)
      .attr('height', extentOverall)
  	  .attr('class', 'chart');
  
    var main = chart.append('g')
  	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  	  .attr('width', width)
      .attr('height', height)
      .attr('class', 'main');
  
    var n = data[0].length
      , xColor =  colorOptions[3].A
      , yColor =  colorOptions[3].B;


    var g = main.append('svg:g');

    // may change extent, so the step should be different
    // |    |     |
    // xbar y bar space
    var step = extent / n
      , barWidth = step / ((offset === 'false') ? 1.0 : 2.0);
    
    // draw y bars first
    // add barWid / 2 to move center of bars to right 
    g.selectAll('bars')
      .data(data[1])
    .enter().append("line")
      .attr('x1',function(d, i) { return i * step + barWidth / 2  + ((offset === 'false') ? 0 : barWidth); })
      .attr('y1',function(d) { return (stack === 'stem' ? (height / 2) : yScale(0)); }) 
      .attr('x2',function(d, i) { return i * step + barWidth / 2  + ((offset === 'false') ? 0 : barWidth); })
      .attr('y2',function(d) { return stack === 'stem' ? (height / 2 + d / 2) : yScale (d); }) 
      .attr('stroke', yColor)
      .attr('stroke-width', barWidth)
      .style('fill', yColor)
      .style('opacity', alpha);
    
    // draw x bars later because fm is lazy and don't want to compute coordinates 
    // just let the x bars cover y bars
    g.selectAll('bars')
    .data(data[0])
   .enter().append("line")
    .attr('x1',function(d, i) { return i * step + barWidth / 2 ; })
    .attr('y1',function(d) { return stack === 'stem' ? (height / 2) : yScale (0); }) 
    .attr('x2',function(d, i) { return i * step + barWidth / 2 ; })
    .attr('y2',function(d) { return stack === 'stem' ? (height / 2 - d / 2) : yScale(d); }) 
    .attr('stroke', xColor)
    .attr('stroke-width', barWidth)
    .style('fill', xColor)
    .style('opacity', alpha);

    // draw the x axis
    var xAxis = d3.svg.axis()
    	.scale(xScale)
    	.tickFormat(function(d){ return ''; })
    	.tickSize(0)
    	.orient('top');
  
    main.append('g')
  	  .attr('transform', 'translate(' + 0 + ',' + height + ')')
  	  .attr('class', 'main axis date').call(xAxis);
    
    
    if(showline === 'true'){
 
       var linex = d3.svg.line()
          .x(function(d,i) { return xScale(i * step); })
          .y(function(d,i) { return yScale(d); });
      
       var liney = d3.svg.line()
         .x(function(d,i) { return xScale(i * step+ ((offset === 'false') ? 0 : barWidth)) ; })
         .y(function(d,i) { return yScale(d); });
       
       var gs = g.selectAll('lines')
         .data(data)
        .enter().append("path")
         .attr('d', function(d ,i){if(i === 0) {return linex(d, i);} else {return liney(d, i);}})
         .attr('stroke', function(d, i) { return i === 0 ? xColor : yColor; })
         .attr('stroke-size', barWidth)
         .attr('fill', 'none')
         .attr('opacity', alpha); 	
    	
    }
  
    // draw the y axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .tickFormat(function(d){ return ''; })
      .tickSize(0)
      .orient('right');
  
    main.append('g')
  	  .attr('class', 'main axis date')
      .call(yAxis);
   
  }
  
  
  // x - sorted but using raw value rather than rank
  // y - 0
  // radius - y / 2
  vismethods.getAgStrip = function (params) {
    var data          = []
      , extentOverall = -1
      , margins       = 20
	  , target        = ''
      , extent        = -1
      , alpha         = 1

    if(params){
	    if(params.data)
	      data = params.data;
	    if(params.extent)
	      extent = params.extent;	     	
	    if(params.target)  
	      target = '#' + params.target
  		if(params.margins)
          margins = params.margins
    	if(params.alpha)
    		alpha = params.alpha         
    }
    
    extentOverall = extent + margins * 2;
    
    // double width because under the worst case, y ≈ 400, r for this circle ≈ 200
    // we need 2 * r = 400 space to hold them
    var width  = extent + Math.sqrt(extent) * 2
      , height = extent
      , margin = {
	      top : margins,
	      right :margins,
	      bottom : margins,
	      left : margins
      }; 
    
    // sort data according to x coordinates
    data.sort(function(a,b){ return a[0] - b[0]; });
  
    var xScale = d3.scale.linear().domain([0,width]).range([0,width]);
    var yScale = d3.scale.linear().domain([0,height]).range([height,0]);
  
    // because we double width with 2 extent, the extentOverall should be added
    // 1 extent, too
    var chart = d3.select(target).append('svg:svg')
  	  .attr('width', extentOverall + 2 * Math.sqrt(extent))
      .attr('height', extentOverall)
  	  .attr('class', 'chart');
  
    var main = chart.append('g')
  	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  	  .attr('width', width)
      .attr('height', height)
      .attr('class', 'main');
  
    var g = main.append('svg:g');

    g.selectAll('striped')
      .data(data)
      .enter().append("circle")
        .attr('cx',function(d) { return d[0] + Math.sqrt(extent / 2) ;})
        .attr('cy',function(d) { return height / 2 ;}) 
        .attr('r',function(d) { return Math.sqrt(d[1]); })
        .style('stroke','rgba(0,0,0,' + alpha + ')')
        .style('stroke-size', 1)
        .style('fill','none');
  
    // draw the x axis
    var xAxis = d3.svg.axis()
    	.scale(xScale)
    	.tickFormat(function(d){ return ''; })
    	.tickSize(0)
    	.orient('top');
  
    main.append('g')
  	  .attr('transform', 'translate(' + 0 + ',' + height/2 + ')')
  	  .attr('class', 'main axis date').call(xAxis);
  
    // draw the y axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .tickFormat(function(d){ return ''; })
      .tickSize(0)
      .orient('right');
  
    main.append('g')
  	  .attr('class', 'main axis date')
      .call(yAxis);
   
  }

  // input [[x1,y1],[x2,y2]]
  // polar coordinates requires dataset in the structure [[x1,x2,x3],[y1,y2,y3]]
  vismethods.getPolarCoord = function (params) {	
    var data          = []
      , extentOverall = -1
      , margins       = 20
	  , target        = ''
	  , extent        = -1
      , strokeSize    = 2
	
    if(params){
	    if(params.data)
	      data = params.data;
	    if(params.extent)
	      extent = params.extent;	     	
	    if(params.target)  
	      target = '#' + params.target
	    if(params.margins)
          margins = params.margins
        if(params.strokeSize)
        	strokeSize = params.strokeSize
    }
    extentOverall = extent + margins * 2;
    
    var width  = extent
      , height = extent
      , margin = {
	      top : margins,
	      right : margins,
	      bottom : margins,
	      left : margins
      }; 
      
    // input structure[[x1,y1],[x2,y2],[x3,y3]], output[[x1,x2,x3],[y1,y2,y3]]
   // data = gen.oneToTwo(data);
    
    var n  = data.length
      , radius = d3.scale.linear().domain([0, width]).range([0, width/2])
      , x = d3.scale.linear().domain([0,width]).range([0,width])
      , y = d3.scale.linear().domain([0,height]).range([height,0]);
      
    var chart = d3.select(target).append('svg:svg')
  	  .attr('width', extentOverall)
      .attr('height', extentOverall)
  	  .attr('class', 'chart')
  
    var main = chart.append('g')
  	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  	  .attr('width', width)
      .attr('height', height)
      .attr('class', 'main')
  
    var g = main.append('svg:g')    
      .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');
      
    // in order to make the x and y lines clearer, put the axes under these two lines
    var lineAxes = g.selectAll('line-ticks')
      .data(data)
      .enter().append('svg:g')
        .attr("transform", function (d, i) {
          return "rotate(" + ((i / n * 360) - 90) + ") " 
            + "translate(" + radius(width) + ")";
         });
  
    lineAxes.append('line')
      .attr("x2", -1 * radius(width))
      .style("stroke", 'rgb(190,190,190)') // a light gray
      .style('stoke-with', strokeSize / 2.0)
      .style("fill", "none");
  
      var pocoData = [];
      
      for (var i in data){
    	  var cell = data[i]    	  
    	   //pocoData.push([radis, theta]);
    	   var  r      = cell[0] / 2,
    	        theta  = cell[1] / extent * Math.PI * 2,
    	        xr = r * Math.cos(theta),
    	        yr = r * Math.sin(theta);
    	   pocoData.push([xr, yr]);
    	   
      }      
      
      g.selectAll('div').data(pocoData).enter().append("svg:circle")
	  .attr("cx", function(d) { return x(d[0]); })
      .attr("cy", function(d) { return y(d[1] + extent); })
      .attr("r", 1);
  }

  // get bounding box
  // input structure [[x1,x2],[y1,y2]]
  // output structure [{x1,x2,y1,y2},..] 4 points
  function getBox(d){
    var arrin2 = gen.oneToTwo(d)
      , xmin = gen.min(arrin2[0])
  	  , ymin = gen.min(arrin2[1])
      , xmax = gen.max(arrin2[0])
      , ymax = gen.max(arrin2[1])
      , rb = gen.rot([[xmin, ymin],[xmin, ymax],[xmax, ymax],[xmax, ymin]], 45, 'clockwise');
  
    var box = {
        "one": {"x1" : rb[0][0] , "y1": rb[0][1] , "x2": rb[1][0], "y2": rb[1][1]},
  		"two": {"x1" : rb[1][0] , "y1": rb[1][1] , "x2": rb[2][0], "y2": rb[2][1]},
  		"three": {"x1" : rb[2][0] , "y1": rb[2][1] , "x2": rb[3][0], "y2": rb[3][1]},
  		"four": {"x1" : rb[3][0] , "y1": rb[3][1] , "x2": rb[0][0], "y2": rb[0][1]},
  		"width": xmax - xmin,
        "height": ymax - ymin,
        "ratio": (xmax - xmin) / (ymax - ymin)
      };
  
    return box;
  }

  return vismethods;
}();
