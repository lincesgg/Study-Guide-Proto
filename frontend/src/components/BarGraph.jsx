import React from 'react'

import { Bar } from 'react-chartjs-2'

const BarGraph = ({className="", style, title="", labels=[], datasets}) => {

    const data = {labels, datasets}
    data.datasets = data.datasets.map(val => {
        val.minBarLength = 5
        return val
    })

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 7
                    }
                }
            },
            tooltip: {
                titleFont: {
                    size: 8
                },
                bodyFont: {
                    size: 7
                }
            },
            title: {
                display: title.length > 0,
                text: title
            }
        },

        elements: {
            bar: {
                minBarLength: 200
            }
        },

        indexAxis: "y",
        scales: {
            y: {
                ticks: {
                    textStrokeColor: "#DDD",
                    textStrokeWidth: 2,
                    maxRotation: 10,
                    mirror: true,
                    labelOffset: -6,
                    crossAlign: "near",
                    z:1,
                    font: {
                        size: 8,
                        family: "'Nunito', sans-serif"
                    }
                }
            }
        }
    }


  return (
    <Bar 
    className={`${className}`}
    {...{data, options, style}}
    />
  )
}

export default BarGraph
