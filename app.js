import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js';

const ALL_TOGGLE = $('#all-btn');
const BTC_TOGGLE = $('#btc-btn');
const ETH_TOGGLE = $('#eth-btn');
const LTC_TOGGLE = $('#ltc-btn');
const XRP_TOGGLE = $('#xrp-btn');
const API_KEY = '6BC1E5F6-2511-4075-AFE1-BCC34D540F4E';
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ctx = $("#myChart");

let date = new Date();
date.setDate(date.getDate()-30);
let dateISO = date.toISOString();

let btcData = {
    labels: [],
    datasets: [{
        label: '',
        data: []
    }]
};

let ethData = {
    labels: [],
    datasets: [{
        label: '',
        data: []
    }]
};

let ltcData = {
    labels: [],
    datasets: [{
        label: '',
        data: []
    }]
};

let xrpData = {
    labels: [],
    datasets: [{
        label: '',
        data: []
    }]
};


function apiCall(string, object) {
    $.ajax({
        url: 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_' + string + '_USD/history?period_id=1DAY&time_start=' + dateISO + '&apikey=' + API_KEY,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            for (var i = 0; i < 30; i++) {
                let d = new Date(data[i].time_period_end);
                let month = MONTH_NAMES[d.getMonth()];
                date = d.getDate();
                object.labels.push(month.toString() + ' ' + date.toString());
                object.datasets[0].data.push((data[i].price_open));
            }
            object.datasets[0].label = string;
        },
        error: function() {
            console.log(string + ' API ERROR');
        }
    });
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

apiCall('BTC', btcData);
apiCall('ETH', ethData);
apiCall('LTC', ltcData);
apiCall('XRP', xrpData);

$(document).ajaxStop(function() {
    let dataChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: btcData.labels,
            datasets: [btcData.datasets[0], ethData.datasets[0], ltcData.datasets[0], xrpData.datasets[0]],
            backgroundColor: [
                'rgb(38, 82, 153)',
                'blue',
                'green',
                'yellow'
        ]},
    });
});