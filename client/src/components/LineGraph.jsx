import React, {useState, useEffect, useRef} from 'react'
import { LineChart } from '@mui/x-charts'
const LineGraph = ({data}) => {
    return (
       
        <div className='border border-gray-200 shadow-md hover:shadow-2xl'>
            <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                    {
                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                    },
                ]}
                width={400}
                height={200}
            />
        </div>
    )
}

export default LineGraph
