dataHost = "http://77.221.147.54:8080/"

var chart;
var ctx;

var currentValue;
var currentPrediction;

function renderForecastPage() {
    createChart();          
    updateCurrentValue();
    updateCurrentPrediction();
    displayIntervalConfigure();

    setInterval(updateCurrentValue, 1000 * 5);
    setInterval(updateCurrentPrediction, 1000 * 5);
    setInterval(updateChart, 1000 * 5);
}

function displayIntervalConfigure() {
    $("#displayInterval").on('change', function() {
        fillChart(calcFromTime());
    });
}

function calcFromTime() {
    let fromTime = 0;
    switch($("#displayInterval").val()) {
        case "day":
            fromTime = new Date().getTime() - 1000 * 60 * 60 * 24;
            break;
        case "3 days":
            fromTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 3;
            break;
        case "month":
            fromTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;
            break;
    }
    return fromTime;
}

function updateCurrentValue() {
    var url = dataHost + 'forecast/currencyValue';
    makeRequest(url, function(btcVal) {
        currentValue = {date: new Date(btcVal.time), value: btcVal.value.toFixed(2)};
        $("#currentValueInformation").html("Current BTC price: $" + currentValue.value);
    });
}

function updateCurrentPrediction() {
    var url = dataHost + '/forecast/prediction';
    makeRequest(url, function(btcValPrediction) {

        currentPrediction = 
            {date: new Date(btcValPrediction.predictionTime), value: btcValPrediction.predictionValue.toFixed(2)};


        $("#predictedValueInformation").html("Predicted BTC price for " + 
                                    moment(currentPrediction.date).format("HH:mm, MMMM Do")
                                    + ": $" + currentPrediction.value);
    });
}


function updateChart() {
    addPoint(chart.data.datasets[0].data, 
        {x: moment(currentValue.date).format('YYYY-MM-DD HH:mm'), y: currentValue.value});

    addPoint(chart.data.datasets[1].data,
        {x: moment(currentPrediction.date).format('YYYY-MM-DD HH:mm'), y: currentPrediction.value});

    chart.update();
}

function addPoint(chartData, point) {
    // add 'point' to 'chartData' only if 
    // there is no such point in 'chartData'
    for (const dataPoint of chartData) {
        //custom object compare:
        let flag = true;
        for (const prop in dataPoint) {
            if (!flag)
                break;

            if (dataPoint[prop] !== point[prop])
                flag = false;
        }

        if (flag == true)
            return;
    }

    chartData.push(point); 
}

function createChart() {
    ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Real value',
                    data: [],
                    showLine: true,

                    pointRadius: 0,
                    borderColor: 'blue',
                    lineTension: 0
                },

                {
                    label: 'Predicted',
                    data: [],
                    showLine: true,

                    pointRadius: 0,
                    borderColor: 'red',
                    lineTension: 0
                }

            ]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',

                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    },
                    
                    ticks: {
                        beginAtZero: false,
                    },
                }],

                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Price in $(USD)'
                    },

                    ticks: {
                        beginAtZero: false
                    }
                }]
            },

            tooltips: {
                intersect: false,

                callbacks: {
                    
                beforeLabel: function(tooltipItem, data) {
                    return tooltipItem.xLabel;
                },
                    
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label;

                        return label + ": " + tooltipItem.yLabel;
                    }
                }


            }
        }
    });

    fillChart(calcFromTime());
}

function clearData(datasetIndex) {
    chart.data.datasets[datasetIndex].data = [];
}


function fillChart(fromTime) {
    var url = dataHost + "forecast/listValuesFromTime?fromTime=" + fromTime;
    var labels = [];


    clearData(0);
    clearData(1);
    makeRequest(url, function(btcValues) {
        for (const btcVal of btcValues) {
            const date = moment(new Date(btcVal.time)).format('YYYY-MM-DD HH:mm');
            addPoint(chart.data.datasets[0].data, {x: date, y: btcVal.value.toFixed(2)});
        }

        chart.data.datasets[0].data.sort();

        chart.update();
    });


    var url = dataHost + 'forecast/listPredictionsFromTime?fromTime=' + fromTime;
    makeRequest(url, function(predictions) {

        for (const pred of predictions) {
            const date = moment(new Date(pred.predictionTime)).format('YYYY-MM-DD HH:mm');
            addPoint(chart.data.datasets[1].data, {x: date, y: pred.predictionValue.toFixed(2)});
        }


        chart.data.datasets[1].data.sort();
        chart.update();
    });
}


function makeRequest(url, successHandler) {
	$.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        datatype: 'json',
        success: function (data, textStatus, xhr) {
        	successHandler(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}