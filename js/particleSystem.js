var data = [];

// bounds of the data
const bounds = {};

var xScale = d3.scaleLinear()
                .domain([-9, 5])
                .range([0, 500]);

var yScale = d3.scaleLinear()
                .domain([-9, 5])
                .range([500, 0]);

// creates the particle system
const createParticleSystem = (data) => {
    var choose_colors = d3.scaleLinear()
    .domain([0, 20, 50, 100, 150, 200, 250, 300,360])
    .range(['#FCFCFC','#FFDFDF', '#FFBFBF', '#FF9F9F', '#FF8080', '#FF6060', '#FF4040', '#FF2020', '#FF0000']);

    var dotPosition = new THREE.BufferGeometry()
    var dotMake = new THREE.PointsMaterial({size:1, vertexColors: true, sizeAttenuation: false})
    var color = new THREE.Color()

    const colors = []
    const vertices = []

    data.forEach((item, i) => {
      vertices.push(item.X, item.Z, item.Y)
      color = new THREE.Color(choose_colors(item.concentration))
      colors.push(color.r,color.g,color.b)
    });
    dotPosition.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    dotPosition.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    var dot = new THREE.Points(dotPosition, dotMake)
    dot.position.y = dot.position.y - 5
    scene.add(dot)
    return dotPosition;
    // draw your partic
};

const greying = (data, zval, a) => {
    var chooseColor1 = d3.scaleLinear()
    .domain([0, 45, 90, 135, 180, 225, 270, 315,360])
    .range(['#FCFCFC','#FFDFDF', '#FFBFBF', '#FF9F9F', '#FF8080', '#FF6060', '#FF4040', '#FF2020', '#FF0000']);
    var colors = []
    data.forEach((item, i) => {
      if (data[i].Z >= (zval - 0.5) && data[i].Z <= (zval + 0.5)) {
        color = new THREE.Color(chooseColor1(data[i].concentration));
      } else {
        color = new THREE.Color('gray')
      }
      colors.push(color.r,color.g,color.b)
    });
    a.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  }

const loadData = (file) => {
    // read the csv file
    d3.csv(file).then(function (fileData)
    // iterate over the rows of the csv file
    {
        fileData.forEach(d => {
            // get the min bounds
            bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
            bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
            bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

            // get the max bounds
            bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
            bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
            bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

            // add the element to the data collection
            data.push({
                // concentration density
                concentration: Number(d.concentration),
                // Position
                X: Number(d.Points0),
                Y: Number(d.Points1),
                Z: Number(d.Points2),
                // Velocity
                U: Number(d.velocity0),
                V: Number(d.velocity1),
                W: Number(d.velocity2)
            })
        });
        createParticleSystem(data)
        var planePosition = new THREE.PlaneGeometry(12,14);
        var planeMade = new THREE.MeshBasicMaterial({
          color: '#c6dbef',
          side: THREE.DoubleSide
        });
        var zPlane = new THREE.Mesh(planePosition, planeMade);
        scene.add(zPlane);
        zPlane.translateY(5);
        zPlane.translateY(-5);
        zPlane.rotation.x = Math.PI / 2;
        document.getElementById("upButton").addEventListener("click", upChange,false);
        document.getElementById("downButton").addEventListener("click", downChange,false);

        function upChange(event){
            console.log("up button pressed")
            zPlane.position.y += 0.5
            var zval = zPlane.position.y+5
            d3.selectAll('span.pos').text(zval);
            var points = []
            var choose_colors1 = d3.scaleLinear()
            .domain([0, 1, 5, 10, 20, 40, 100, 200,360])
            .range(['#FCFCFC','#FFDFDF', '#FFBFBF', '#FF9F9F', '#FF8080', '#FF6060', '#FF4040', '#FF2020', '#FF0000']);
            var i = 0
            while(i<data.length){
                if((data[i]["Z"] >= zval-0.5) && (data[i]["Z"] < zval+0.5))
                {
                    points.push({"X": data[i]['X'], "Y": data[i]['Y'],"concentration":data[i]['concentration']});
                }
                i++
            }
            console.log(points)
            //Create an SVG
            d3.select(".plane")
                .selectAll("svg")
                .remove()

            var plane_svg = d3.select(".plane")
                        .append("svg")
                        .attr("width", 500)
                        .attr("height", 500)
                        .attr("transform", "translate(50,50)")
                        .append("g")
                        .attr("transform", "translate(-50,5)");

            plane_svg.selectAll('circle')
                .data(points)
                .enter()
                .append('circle')
                .attr('class','point_value')
                .attr("r",1)
                .attr('cx', function(d) {
                    return xScale(d.X); })
                .attr('cy', function(d) {
                    return yScale(d.Y); })
                .style('fill', function(d) {
                    return choose_colors1(d.concentration); });
            var a = createParticleSystem(data);
            greying(data,zval,a);
        }
        function downChange(event){
            console.log("down button pressed")
            zPlane.position.y -= 0.5
            var zval1 = zPlane.position.y+5
            d3.selectAll('span.pos').text(zval1);
            var points = []
            var choose_colors1 = d3.scaleLinear()
            .domain([0, 20, 50, 100, 150, 200, 250, 300,360])
            .range(['#e0f3db','#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#980043', '#0868ac', '#084081','#0868ac']);
            var i = 0
            while(i<data.length){
                if((data[i]["Z"] >= zval1-0.5) && (data[i]["Z"] < zval1+0.5))
                {
                    points.push({"X": data[i]['X'], "Y": data[i]['Y'],"concentration":data[i]['concentration']});
                }
                i++
            }
            console.log(points)
            //Create an SVG
            d3.select(".plane")
                .selectAll("svg")
                .remove()

            var plane_svg = d3.select(".plane")
                        .append("svg")
                        .attr("width", 500)
                        .attr("height", 500)
                        .attr("transform", "translate(50,50)")
                        .append("g")
                        .attr("transform", "translate(-50,5)");

            plane_svg.selectAll('circle')
                .data(points)
                .enter()
                .append('circle')
                .attr('class','point_value')
                .attr("r",1)
                .attr('cx', function(d) {
                    return xScale(d.X); })
                .attr('cy', function(d) {
                    return yScale(d.Y); })
                .style('fill', function(d) {
                    return choose_colors1(d.concentration); });
            var a = createParticleSystem(data);
            greying(data,zval1,a);
        }
    })


};


loadData('058.csv');