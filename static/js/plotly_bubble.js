// Specify # of countries to plot for top/low traces (ie., top 10)
const noPlot = 10;

//Select dropdown for plotly
let selection = d3.select("#plotDataset");

function plotlyInit(){
// Read CSV of latest available data          
d3.csv("../../Data/latest_data_available.csv").then(function(data){

        //Pull CSV and sort by happiness ranking (highest placement to lowest)    
        let x = [];
        data.forEach(d => {
            x.push(d)
        });
        x = x.sort((a, b) => a["2020 Rank"] - b["2020 Rank"]);

        //Format entries from strings to integers/floats
        x.forEach(d=> {
            d.year = parseInt(d.year);
            d["2020 Rank"]=parseInt(d["2020 Rank"]);
            d["2020 Score"]=+d["2020 Score"]
            d["total suicides/100k pop"]=+d["total suicides/100k pop"]
            d["gdp_per_capita ($)"]=+d["gdp_per_capita ($)"]
        });

        //Pull top and lowest ranking countries (by happiness)
        let top=x.slice(0,noPlot);
        let low = x.slice(-(noPlot));

        //Add all countries (sorted alphabetically) to dropdown list
        let all = x.sort(function(a, b){
            if(a.Code < b.Code) { return -1; }
            if(a.Code > b.Code) { return 1; }
            return 0;
        })

        // Populate the drop-down list with sample IDs
        x.map(d=> d.Code).forEach(el => {
            selection.append("option").property("value",el).text(el);
           });
        

    //Trace #1: Happiest nations
    let bubbleTrace1 = {
    name: "Top 10 Happiest Nations",
    x: top.map(d=> d["gdp_per_capita ($)"]),
    y: top.map(d=> d["total suicides/100k pop"]),
    text: top.map(d=>d.Code),
    textfont : {color: "white"},
    hoverinfo: 'x+text',
    hovertext: top.map(d=> `${d.Country} | Suicide: ${d["total suicides/100k pop"]} (${d.year}) | 2020 Happy Rank: ${d["2020 Rank"]}`),
    mode: 'markers+text',
    marker: {
        size: top.map(d=> d["2020 Score"]),
        color: "#00A7E1",
        //colorscale: "Portland",
        sizeref: 1/500,
        sizemin: 2,
        sizemode: 'area'
    }
    };
    
    //Trace #2: Least happiest nations
    let bubbleTrace2 = {
        name: "10 Least Happiest Nations",
        x: low.map(d=> d["gdp_per_capita ($)"]),
        y: low.map(d=> d["total suicides/100k pop"]),
        text: low.map(d=>d.Code),
        textfont : {color: "white"},
        hoverinfo: 'x+text',
        hovertext: low.map(d=> `${d.Country} | Suicide: ${d["total suicides/100k pop"]} (${d.year}) | 2020 Happy Rank: ${d["2020 Rank"]}`),
        mode: 'markers+text',
        marker: {
            size: low.map(d=> d["2020 Score"]),
            color: "salmon",
            //colorscale: "Portland",
            sizeref: 1/500,
            sizemin: 2,
            sizemode: 'area'
        }
    }

    // Select user-defined country from drop-down list
    let selCntry = d3.select("#plotDataset").property('value');

    //Create a function to extract data from selected country
    function filterCity (city) {
        return city.Code === selCntry;
    };

    // Create selected country's dat array
    let myPick = x.filter(filterCity)
    let cntryName = myPick[0]["Country"]

    // Trace #3: Overlay for Selected Country
    let bubbleTrace3 = {
        name: cntryName,
        x: myPick.map(d=> d["gdp_per_capita ($)"]),
        y: myPick.map(d=> d["total suicides/100k pop"]),
        text: myPick.map(d=>d.Code),
        textfont : {color: "white"},
        hoverinfo: 'x+text',
        hovertext: myPick.map(d=> `${d.Country} | Suicide: ${d["total suicides/100k pop"]} (${d.year}) | 2020 Happy Rank: ${d["2020 Rank"]}`),
        mode: 'markers+text',
        marker: {
            size: myPick.map(d=> d["2020 Score"]),
            color: "#4C9F70",
            //colorscale: "Portland",
            sizeref: 1/500,
            sizemin: 2,
            sizemode: 'area'
        }
    }

    //Construct plotData
    let plotData = [bubbleTrace1, bubbleTrace2,bubbleTrace3]

    //Construct plot layout
    let layout= {
    title: {
        text: "Comparing Happiest to Least Happiest Nations",
        font: {size:30, family: "Arial"}
    },
    xaxis: {title: "<b>gdp per capita ($)</b>"},
    yaxis: {title: "<b>total suicides/100k pop</b>"},
    width: window.innerWidth*0.8,
    height: window.innerHeight*0.8,
    margin: { t: 100, r: 60, l: 60, b: 40},
    legend: {
        font: {size: 15},
        itemsizing: "constant",
        orientation:'h',
        yanchor:'bottom',
        xanchor:'center',
        y:1,
        x:0.5
    },
    autosize: true
    };

    // Make plot responsive
    let config = {responsive: true}

    // PLOT!
    Plotly.newPlot('bubble', plotData, layout, config);

});
};

//Execute initial plot
plotlyInit()

// Create function to restyle plotly when user specifies a change of country to plot
function plotlyChanged (){
    let selection = d3.select("#plotDataset");
    // Pull in JSON and once loading is complete perform the following:
    d3.csv("../../Data/latest_data_available.csv").then(function(data){

        //Format entries from strings to intgers/floats
        data.forEach(d=> {
            d.year = parseInt(d.year);
            d["2020 Rank"]=parseInt(d["2020 Rank"]);
            d["2020 Score"]=+d["2020 Score"]
            d["total suicides/100k pop"]=+d["total suicides/100k pop"]
            d["gdp_per_capita ($)"]=+d["gdp_per_capita ($)"]
        });

        // Get selected country from drop down list
        let selCntry = d3.select("#plotDataset").property('value');
    
        // Filter data for selected country
        function filterCity (city) {
            return city.Code === selCntry;
        };
        let newPick = data.filter(filterCity)

        // Restyle plotly bubbleTrace3 with new values for following entries
        Plotly.restyle('bubble', "name", [newPick[0]["Country"]],2);
        Plotly.restyle('bubble', "x", [newPick.map(d=> d["gdp_per_capita ($)"])], 2);
        Plotly.restyle('bubble', "y", [newPick.map(d=> d["total suicides/100k pop"])], 2);
        Plotly.restyle('bubble', "text", [newPick.map(d=>d.Code)],2);
        Plotly.restyle('bubble', "hovertext", [newPick.map(d=> `${d.Country} | Suicide: ${d["total suicides/100k pop"]} (${d.year}) | 2020 Happy Rank: ${d["2020 Rank"]}`)], 2);
        Plotly.restyle('bubble', "marker.size", [newPick.map(d=> d["2020 Score"])], 2);

    });
}

//Add listener on drop down list
d3.select("#plotDataset").on("change",plotlyChanged);