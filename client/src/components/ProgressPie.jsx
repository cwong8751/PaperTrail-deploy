import React, { useState, useEffect, useRef } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
import Box from '@mui/material/Box';
const ProgressPie = ({ data }) => {
    return (

        <div className='border border-gray-200 shadow-md hover:shadow-2xl'>
            <Box flexGrow={1}>
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: data.tasksdone, label: 'tasks done' },
                                { id: 1, value: data.tasksinprogress, label: 'tasks in progress' },
                                { id: 2, value: data.plansdone, label: 'plans done' },
                                { id: 3, value: data.plansinprogress, label: 'plans in progress' },
                            ],
                            
                        },
                    ]}
                    width={600}
                    height={200}
                />
            </Box>
        </div>
    )
}

export default ProgressPie
