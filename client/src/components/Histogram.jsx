
import React, { useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';

const Histogram = ({ data }) => {
    console.log(data);
    return (
        <div className='border border-gray-200 shadow-md hover:shadow-2xl flex overflow-hidden max-w-[1400px]'>
            <BarChart
                xAxis={[{ data: ['Tasks Done', 'Tasks In Progress', 'Plans Done', 'Plans In Progress'], scaleType: 'band' }]}
                series={[
                    { data: [data.tasksdone, data.tasksinprogress, data.plansdone, data.plansinprogress] },
                ]}
                width={800}
                height={300}
            />

        </div>
    )
}

export default Histogram;
