// Read CSV of latest available data          
d3.csv("../../Data/latest_data_available.csv").then(function(data){

        //Pull CSV and sort by happiness ranking(highest placement to lowest)    
        let x = [];
        data.forEach(d => {
            x.push(d)
        });
        x = x.sort((a, b) => a["2020 Rank"] - b["2020 Rank"]);

        //Format entries from strings to intgers/floats
        x.forEach(d=> {
            d.year = parseInt(d.year);
            d["2020 Rank"]=parseInt(d["2020 Rank"]);
            d["2020 Score"]=+d["2020 Score"]
            d["total suicides/100k pop"]=+d["total suicides/100k pop"]
            d["gdp_per_capita ($)"]=+d["gdp_per_capita ($)"]
        });

        //Pull top and lowest ranking countries (by happiness)
        let top=x.slice(0,10);
        let low = x.slice(-10);

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
        color: "steelblue",
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

    //Create a function to extract data from MEXico
    function filterCity (city) {
        return city.Code === "MEX";
    };

    // Create Mexico's data array
    let mexico = x.filter(filterCity)

    // Trace #3: Overlay for Mexico
    let bubbleTrace3 = {
        name: "Mexico",
        x: mexico.map(d=> d["gdp_per_capita ($)"]),
        y: mexico.map(d=> d["total suicides/100k pop"]),
        text: mexico.map(d=>d.Code),
        textfont : {color: "white"},
        hoverinfo: 'x+text',
        hovertext: mexico.map(d=> `${d.Country} | Suicide: ${d["total suicides/100k pop"]} (${d.year}) | 2020 Happy Rank: ${d["2020 Rank"]}`),
        mode: 'markers+text',
        marker: {
            size: low.map(d=> d["2020 Score"]),
            color: "green",
            //colorscale: "Portland",
            sizeref: 1/500,
            sizemin: 2,
            sizemode: 'area'
        }
    }

    //Construct plotData
    let plotData = [bubbleTrace1, bubbleTrace2,bubbleTrace3]

    //COnstruct plot layout
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