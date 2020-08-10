function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("id: " + result.id);
    PANEL.append("h6").text("ethnicity: " + result.ethnicity);
    PANEL.append("h6").text("gender: " + result.gender);
    PANEL.append("h6").text("age: " + result.age);
    PANEL.append("h6").text("location: " + result.location);
    PANEL.append("h6").text("bbtype: " + result.bbtype);
    PANEL.append("h6").text("wfreq: " + result.wfreq);
  });
}

function buildCharts(sample) {
// Bubble Chart
d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];

  var x_axis = result.otu_ids;
  var y_axis = result.sample_values;
  var size = result.sample_values;
  var color = result.otu_ids;
  var texts = result.otu_labels;

  var bubble = {
    x: x_axis,
    y: y_axis,
    text: texts,
    mode: `markers`,
    marker: {
      size: size,
      color: color,
      colorscale: "Viridis"
    }
  };
  var data = [bubble];
  var layout = {
    title: "Navel Bacteria",
    xaxis: {title: "OTU ID"},
    hovermode: "closests",
    autosize: true
  };
  Plotly.newPlot("bubble", data, layout);
});  

// Building Bar Graph
d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];

  var sample_values = result.sample_values.slice(0,10);
  var otu_ids = result.otu_ids.slice(0,10);
  var otu_labels = result.otu_labels.slice(0,10);

  var bar_graph = [{
    x: sample_values.reverse(),
    y: otu_ids.map(id => 'OTU:' + id).reverse(),
    text: otu_labels,
    type: "bar",
    orientation: "h",
    marker: {
      color: otu_ids,
    }
  }];
  Plotly.newPlot("bar", bar_graph);
});

// Gauge Chart
d3.json("samples.json").then((data) => {
  var samples = data.metadata;
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  var wfreq = resultArray[0].wfreq;
  var level = parseFloat(wfreq) * 20;

  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var aX = 0.025 * Math.cos((degrees-90) * Math.PI / 180);
  var aY = 0.025 * Math.sin((degrees-90) * Math.PI / 180);
  var bX = -0.025 * Math.cos((degrees-90) * Math.PI / 180);
  var bY = -0.025 * Math.sin((degrees-90) * Math.PI / 180);
  var cX = radius * Math.cos(radians);
  var cY = radius * Math.sin(radians);

  var mainPath = 'M ' + aX + ' ' + aY + ' L ' + bX + ' ' + bY + ' L ' + cX + ' ' + cY + ' Z';
  var pathX = String(cX);
  var space = " ";
  var pathY = String(cY);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [{
    type: "scatter",
    x: [0],
    y: [0],
    marker: {size: 14, color: "Black"},
    showlegend: false,
    text: level,
    hoverinfo: "text+name"},
    {
      values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(10,129,20,.5)",
          "rgba(55,110,43,.5)",
          "rgba(15,137,1,.5)",
          "rgba(115,165,35,.5)",
          "rgba(170,202,42,.5)",
          "rgba(220,215,100,.5)",
          "rgba(215,226,175,.5)",
          "rgba(247,256,232,.5)",
          "rgba(252,237,215,.5)",
          "rgba(255,255,255,0)"
        ]},
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
  }];
  var layout = {
    shapes: [
      {
      type: "path",
      path: path,
      fillcolor: "Black",
      line: {
        color: "Black"
        }
    }],
    title: "Navel Washing Frequency <br> Scrubs/Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1,1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1,1]
    }
  }; 
  Plotly.newPlot('gauge', data, layout);
  });
};

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
  });

});
optionChanged(940);
};

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
};

init();
