const url_energy = 'https://api.waziup.io/api/v2/sensors_data?sort=dsc&calibrated=true&limit=10000&device_id=60d9fef6957a2200070eb699&sensor_id=illuminanceSensor_1';
const url_lumens = 'https://api.waziup.io/api/v2/sensors_data?sort=dsc&calibrated=true&limit=10000&device_id=60d9fef6957a2200070eb699&sensor_id=illuminanceSensor_0';
const url_occupancy = 'https://api.waziup.io/api/v2/sensors_data?sort=dsc&calibrated=true&limit=10000&device_id=60d9fef6957a2200070eb699&sensor_id=digitalOutput_0';

async function get_data() {
    //data for current sensor
    const response_data = await fetch(url_energy);
    const data = await response_data.json();
    //const timestamp = data.timestamp;
    //console.log(data);
    //console.log(timestamp);
    //data for lumens lux sensor
    const response_lumens = await fetch(url_lumens);
    const data_lumens = await response_lumens.json();
    //console.log(data_lumens);
    //
    // data for occupancy
    const response_occupancy = await fetch(url_occupancy);
    const data_occupancy = await response_occupancy.json();
    //console.log(data_occupancy[1].value);
    //
    //
    const data_value = []; // stores data that ignores zeros 
    const data_energy = []; // stores all energy data
    //data_value.length = data.length;
    // arrays for simulations.
    const timestamp=[];
    const lumens = [];
    const occupancy = [];
    const arkshine = [];
    const philips = [];
    const ensave = [];
    const arkshine_dimming = [];
    const arkshine_ldrpir = [];
    var i;
    for (i = 0; i < data.length; i++) {
        data_energy[i] = (((data[i].value - 610) * 4.88) / 100) * 0.7 * 240;
    }
    for (i = 0; i < data.length; i++) {
        if (data_energy[i] > 100) {
            timestamp.push(data[i].timestamp);
            lumens.push(data_lumens[i].value);
            occupancy.push(data_occupancy[i].value);
            data_value.push(data_energy[i]);
            arkshine.push(data_energy[i] * 0.26);
            philips.push(data_energy[i] * 0.37);
            ensave.push(data_energy[i] * 0.47);
        }
    }
    //arkshine_dimming.length = data_value.length;
    for (i = 0; i < data_value.length;i++) {
        if (occupancy[i] == 0) {
            arkshine_dimming[i] = 0;
            arkshine_ldrpir[i] = 0;
        }
        else {
            if (lumens[i] > 1000) {
                arkshine_dimming.push(0);
            }
            else if (lumens[i] > 600 && lumens[i] <= 1000) {
                arkshine_dimming.push(data_value[i] * 0.26 * 0.2);
            }
            else if (lumens[i] > 400 && lumens[i] <= 600) {
                arkshine_dimming.push(data_value[i] * 0.26 * 0.4);
            }
            else if (lumens[i] > 200 && lumens[i] <= 400) {
                arkshine_dimming.push(data_value[i] * 0.26 * 0.6);
            }
            else if (lumens[i] > 80 && lumens[i] <= 200) {
                arkshine_dimming.push(data_value[i] * 0.26 * 0.8);
            }
            else if (lumens[i].value <= 80) {
                arkshine_dimming.push(data_value[i] * 0.26);
            }
            if (lumens[i].value > 950) {
                arkshine_ldrpir.push(0);
            }
            else {
                arkshine_ldrpir.push(data_value[i] * 0.26);
            }

        }
    }
    //assigning energy figures to arkshine and ldrpir
    /*for (i = 0; i < data.length; i++) {
        data_energy[i] = (((data[i].value - 634) * 4.88) / 100) * 0.7 * 240;
        if (data_energy[i] > 100) {
            timestamp.push(data[i].timestamp);
            data_value.push(data_energy[i]);
            arkshine.push(data_energy[i] * 0.26);
            philips.push(data_energy[i] * 0.37);
            ensave.push(data_energy[i] * 0.47);
            // asigning data to arkshine_dimming for arkshine
            if (data_occupancy[i] == 0) {
                arkshine_dimming[i] = 0;
                arkshine_ldrpir[i] = 0;
            }
            else {
                if (data_lumens[i].value > 1000) {
                    arkshine_dimming.push(0);
                }
                else if (data_lumens[i].value > 600 && data_lumens[i].value < 1000) {
                    arkshine_dimming.push(data_value[i]*0.26* 0.2);
                }
                else if (data_lumens[i].value > 400 && data_lumens[i].value < 600) {
                    arkshine_dimming.push(data_value[i]*0.26* 0.4);
                }
                else if (data_lumens[i].value > 200 && data_lumens[i].value < 400) {
                    arkshine_dimming.push(data_value[i]*0.26* 0.6);
                }
                else if (data_lumens[i].value > 80 && data_lumens[i].value < 200) {
                    arkshine_dimming.push(data_value[i]*0.26 * 0.8);
                }
                else if (data_lumens[i].value < 80) {
                    arkshine_dimming.push(data_value[i]*0.26);
                }
                if (data_lumens[i].value > 950) {
                    arkshine_ldrpir.push(0);
                }
                else {
                    arkshine_ldrpir.push(data_value[i] *0.26);
                }
            }
        }
        //data_value[i] = data[i].value;
    }
    */
    //console.log(lumens);
    //console.log(data_value);
    //console.log(arkshine_dimming);
    //console.log(arkshine_ldrpir);
    //console.log(data_energy);
    // TOTAL ENERGY FOR EACH POTENTIAL SOLUTIONS
    //1. TOTAL ENERGY
    var x
    var total_energy = 0;
    var arkshine_dimming_energy=0;
    var arkshine_ldrpir_energy=0;
    //investment parameters
    //var payback_period;
    var Return_on_investment;
    var savings_5years;
    //arkshine dimming total eenrgy
    for (x = 0; x < arkshine_dimming.length; x++) {
        arkshine_dimming_energy = arkshine_dimming_energy + arkshine_dimming[x];
    }
    //total energy
    for (x = 0; x < data_value.length; x++) {
        total_energy = total_energy + data_value[x];
        //arkshine_dimming_energy = arkshine_dimming_energy + arkshine_dimming[x];
        arkshine_ldrpir_energy = arkshine_ldrpir_energy + arkshine_ldrpir[x];
    }
    //console.log(total_energy);
    //console.log(arkshine_dimming_energy);
    //console.log(arkshine_ldrpir_energy);
    var average_total_energy = total_energy / data_value.length;

    var arkshine_energy = total_energy * 0.26;
    var philips_energy = total_energy * 0.37;
    var ensave_energy = total_energy * 0.47;
    //
    //TOTAL SAVINGS SO FAR FOR EACH CASE
    var arkshine_dimming_savings = total_energy - arkshine_dimming_energy;
    var arkshine_ldrpir_savings = total_energy - arkshine_ldrpir_energy;
    var arkshine_savings = total_energy * 0.74;
    var philips_savings = total_energy * 0.67;
    var ensave_savings = total_energy * 0.53;
    //console.log(total_energy);
    //console.log(arkshine_ldrpir_energy);
    //console.log(arkshine_ldrpir_savings);
    //
    //Arkshine dimming investment essentials
    var arkshine_dimming_payback = (19500 / ((average_total_energy - (arkshine_dimming_energy / data_value.length)) * 0.022 * 12 * 30));
    var savings_dimming_5years = (60 * 19500) / arkshine_dimming_payback;
    var arkshine_dimming_roi = savings_dimming_5years / 19500;
    var q = Math.round((arkshine_dimming_payback + Number.EPSILON) * 100) / 100;
    document.getElementById("arkshine dimming").innerHTML = q; //arkshine_dimming_payback.toFixed();
    document.getElementById("arkshine dimming 5year savings").innerHTML = savings_dimming_5years.toFixed(2);
    document.getElementById("arkshine dimming roi").innerHTML = arkshine_dimming_roi.toFixed(2);
    //console.log(savings_dimming_5years);
    //console.log(arkshine_dimming_roi);
    //console.log(arkshine_dimming_payback);
    //
    //arkshine ldrpir investment essentials
    var arkshine_ldrpir_payback = 20800 / ((average_total_energy - (arkshine_ldrpir_energy / data_value.length)) * 0.022 * 12 * 30);
    var savings_ldrpir_5years = (60 * 20800) / arkshine_ldrpir_payback;
    var arkshine_ldrpir_roi = savings_ldrpir_5years / 20800;
    document.getElementById("arkshine ldrpir").innerHTML = arkshine_ldrpir_payback.toFixed(2);
    document.getElementById("arkshine ldrpir 5year savings").innerHTML = savings_ldrpir_5years.toFixed(2);
    document.getElementById("arkshine ldrpir roi").innerHTML = arkshine_ldrpir_roi.toFixed(2);
    //console.log(savings_ldrpir_5years);
    //console.log(arkshine_ldrpir_roi);
    //console.log(arkshine_ldrpir_payback);
    //
    //arkshine retrofit investment essentials
    var arkshine_payback = 15600 /((average_total_energy - (arkshine_energy / data_value.length)) * 0.022 * 12 * 30);
    var savings_arkshine_5years = ((60 * 15600) / arkshine_payback).toFixed(2);
    var arkshine_roi = (savings_arkshine_5years / 15600).toFixed(2);
    document.getElementById("arkshine").innerHTML = arkshine_payback.toFixed(2);
    document.getElementById("arkshine 5year savings").innerHTML = savings_arkshine_5years;
    document.getElementById("arkshine roi").innerHTML = arkshine_roi;
    //console.log(arkshine_payback);
    //console.log(savings_arkshine_5years);
    //console.log(arkshine_roi);
    //
    //philips retrofit investment essentials
    var philips_payback = 19500 / ((average_total_energy - (philips_energy / data_value.length)) * 0.022 * 12 * 30);
    var savings_philips_5years = (60 * 19500) / philips_payback;
    var philips_roi = savings_philips_5years / 19500;
    document.getElementById("philips").innerHTML = philips_payback.toFixed(2);
    document.getElementById("philips 5year savings").innerHTML = savings_philips_5years.toFixed(2);
    document.getElementById("philips roi").innerHTML = philips_roi.toFixed(2);
    //console.log(philips_payback);
    //console.log(savings_philips_5years);
    //console.log(philips_roi);
    //
    //ensave retrofit investment essentials
    var ensave_payback = (11700 / ((average_total_energy - (ensave_energy / data_value.length)) * 0.022 * 12 * 30)).toFixed(2);
    var savings_ensave_1years = ((12 * 11700) / ensave_payback).toFixed(2);
    var ensave_roi = (savings_ensave_1years / 11700).toFixed(2);
    document.getElementById("ensave").innerHTML = ensave_payback;
    document.getElementById("ensave 1year savings").innerHTML = savings_ensave_1years;
    document.getElementById("ensave roi").innerHTML = ensave_roi;
    //console.log(ensave_payback);
    //console.log(savings_ensave_1years);
    //console.log(ensave_roi);
    //
    //charts
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamp.slice(0, 21),
            datasets: [{
                label: 'power consumption real time',
                data: data_value.slice(0, 21),
                backgroundColor: [
                    'red'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }, {
                label: 'simulated ARKSHINE consumption',
                data: arkshine.slice(0, 21),
                backgroundColor: [
                    'green'
                ],
                borderColor: [
                    'rgba(75, 0, 192, 1)'
                ],
                borderWidth: 1
            }, {
                label: 'simulated ensave consumption',
                data: ensave.slice(0, 21),
                backgroundColor: [
                    'blue'
                ],
                borderColor: [
                    'rgba(75, 0, 192, 1)'
                ],
                borderWidth: 1
            }, {
                label: 'ldrpir savings',
                data: arkshine_ldrpir.slice(0, 21),
                backgroundColor: [
                    'grey'
                ],
                borderColor: [
                    'rgba(75, 0, 192, 1)'
                ],
                borderWidth: 1
            }, {
                label: 'arkshine dimming',
                data: arkshine_dimming.slice(0, 21),
                backgroundColor: [
                    'red'
                ],
                borderColor: [
                    'rgba(75, 0, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: true,
                        color: "rgba(255,99,132,0.2)"
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        }
    });
    //
    //total savings chart
    var total_savings_chart = document.getElementById('savings_chart').getContext('2d');
    var savings_chart = new Chart(total_savings_chart, {
        type: 'bar',
        data: {
            labels: ['arkshine_retrofit + dimming', 'arkshine_ldrpir + retrofit', 'arkshine_retrofit', 'philips_retrofit', 'ensave_retrofit'],
            datasets: [{
                label: 'TOTAL SAVINGS',
                data: [arkshine_dimming_savings, arkshine_ldrpir_savings, arkshine_savings, philips_savings, ensave_savings],
                backgroundColor: ['green', 'blue', 'Yellow', 'brown', 'red'],
                borderColor: ['white'],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: true,
                        color: "rgba(255,99,132,0.2)"
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        }
    });
}
get_data();

