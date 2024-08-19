import Chart from "chart.js/auto"
import { Line } from "react-chartjs-2"

import "chartjs-adapter-moment"
import "chartjs-adapter-luxon"

// Chart.register(Line)

const LineGraph = ({graphTitle="", xLabels=[], datasetsData=[], datasetsYLabels=[], datasetsTitles=[],}) => {

  // if (datasetsYLabels.length != datasetsTitles.length)
  //   throw Error("datasetsYLabels & datasetsTitles should Have Same Length!")

  const data = {
    // labels: xLabels,
      datasets : [
          // {
          //   label: 'Dataset with string point data',
          //   backgroundColor: "rgba(255, 0, 0, .5)",
          //   borderColor: "rgba(255, 0, 0, .4)",
          //   fill: false,
          //   data: [
          //     {x: 1, y :2},
          //     {x: 2, y :5}
          //   ]
          // },
      ]
  }

  // When Using Time Dataset
  // Data in {x, y} format
  datasetsData.forEach((datasetData, idx) => {
    data.datasets.push({
      label: datasetsTitles[idx],
      data: datasetData
    })
  })

  // When Using xLabels & datasetsYLabels
  // for (const datasetIdx in datasetsYLabels) {
  //   data.datasets.push({
  //     label: datasetsTitles[datasetIdx],
  //     data: 
  //       xLabels.map((xVal, xIdx) => {
  //         return {x: new Date(xVal), y:datasetsYLabels[datasetIdx][xIdx]}
  //       })
  //   })
  // }


    const options = {
      // spanGaps:1000 * 60 * 60 * 24 * 2,
      responsive: true,
      plugins: {
        tooltip: true,
        legend: true,
        title: {
          display: graphTitle.length > 0,
          text: graphTitle
        }
      },

      scales:{
        x: {
          type: "time",
          time: {
            tooltipFormat: "DD "
          }
        }
      },

      elements: {
        point: {
          radius: 3.5,
          hoverRadius: 5
        }
      }
    }

  return (
    <Line
    data={data}
    options={options}
    />
  )
}

export default LineGraph
