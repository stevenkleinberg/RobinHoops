import React from 'react'
import Plot from 'react-plotly.js';

function TeamChart({ team }) {
    const history_string = team?.price_history.slice(1, (team.price_history.length - 1));
    const history_string_array = history_string?.split(",");
    const priceHistory = history_string_array?.map(price => (parseFloat(price) / 100).toFixed(2));

    const zeroIndexrange = [...(priceHistory ? priceHistory.keys() : [] )]
    const range = zeroIndexrange?.map(ind => ind + 1)

    const layout = {
        autosize: true,
        plot_bgcolor: 'black',
        paper_bgcolor: 'black',
        font: { color: 'white' },
        xaxis: {
            title: 'Games Played',
            titlefont: {
                size: 18,
                color: 'white'
            },
            showticklabels: true,
            tickangle: 'auto',
            tickfont: {
                size: 9,
                color: 'white'
            }
        },
        yaxis: {
            title: 'Stock Price',
            titlefont: {
                size: 18,
                color: 'white'
            },
            showticklabels: true,
            tickangle: 'auto',
            tickfont: {
                size: 9,
                color: 'white'
            }
        }
    }
    return (
        <Plot className='chart'
            data={[
                {
                    x: range,
                    y: priceHistory,
                    type: 'line',
                    mode: 'lines+markers',
                    marker: { color: 'green' },
                    hovertemplate: '<br><b>Price</b>: $%{y:.2f}' +
                        '<br><b>Games Played</b>: %{x}<br>',
                    name: ''
                },
            ]}
            layout={layout}
            config={{
                scrollZoom: false,
                responsive: true,
                displayModeBar: false,
            }}


        />
    )
}

export default TeamChart
