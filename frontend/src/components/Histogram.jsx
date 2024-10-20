import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs'; // Install this for date manipulation: npm install dayjs

const Histogram = ({ data }) => {
    const [chartData, setChartData] = useState({ dates: [], amounts: [] });
    const [timeRange, setTimeRange] = useState('last 7 days'); // Default time range

    // Function to filter transactions by the selected time range
    const filterTransactions = (transactions, range) => {
        const now = dayjs();
        let filteredTransactions = [];

        switch (range) {
            case 'last 24 hours':
                filteredTransactions = transactions.filter(transaction =>
                    dayjs(transaction.transactionDate).isAfter(now.subtract(1, 'day'))
                );
                break;
            case 'last 7 days':
                filteredTransactions = transactions.filter(transaction =>
                    dayjs(transaction.transactionDate).isAfter(now.subtract(7, 'day'))
                );
                break;
            case 'last month':
                filteredTransactions = transactions.filter(transaction =>
                    dayjs(transaction.transactionDate).isAfter(now.subtract(1, 'month'))
                );
                break;
            case 'last year':
                filteredTransactions = transactions.filter(transaction =>
                    dayjs(transaction.transactionDate).isAfter(now.subtract(1, 'year'))
                );
                break;
            default:
                filteredTransactions = transactions;
        }
        return filteredTransactions;
    };

    useEffect(() => {
        if (data.bankAccounts && data.bankAccounts.length > 0) {
            const transactions = data.bankAccounts[0].transactions;

            // Filter transactions based on the selected time range
            const filteredTransactions = filterTransactions(transactions, timeRange);

            // Aggregate the filtered transactions by date
            const aggregatedData = filteredTransactions.reduce((acc, transaction) => {
                const date = transaction.transactionDate;
                const amount = transaction.transactionAmount;

                // If the date is already in the accumulator, add the amount
                if (acc[date]) {
                    acc[date] += amount;
                } else {
                    acc[date] = amount;
                }
                return acc;
            }, {});

            // Prepare data for the chart
            const dates = Object.keys(aggregatedData);
            const amounts = Object.values(aggregatedData);

            // Set the chart data
            setChartData({ dates, amounts });
        }
    }, [data, timeRange]);

    return (
        <div className='border border-gray-200 shadow-md flex overflow-hidden max-w-[1400px] flex-col'>
            {/* Dropdown for selecting time range */}
            <div className='p-4'>
                <label htmlFor='time-range' className='mr-2'>Select Time Range:</label>
                <select
                    id='time-range'
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className='border rounded p-2'
                >
                    <option value='last 24 hours'>Last 24 hours</option>
                    <option value='last 7 days'>Last 7 days</option>
                    <option value='last month'>Last month</option>
                    <option value='last year'>Last year</option>
                </select>
            </div>

            {/* Bar Chart */}
            <div className='border border-gray-200 shadow-md'>
                <BarChart
                    xAxis={[{ data: chartData.dates, scaleType: 'band' }]}
                    series={[
                        { data: chartData.amounts },
                    ]}
                    width={800}
                    height={300}
                />
            </div>

            {/* Transaction Summary */}
            <div className='items-center justify-center space-y-5 p-5'>
                <h1 className='text-3xl'>Transaction History</h1>
                <h1 className='text-2xl'>Total Transactions: {chartData.dates.length}</h1>
            </div>
        </div>
    );
}

export default Histogram;
