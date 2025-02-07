import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GAnalyticsGraph = ({ ga4Data }) => {
    const labels = ga4Data.rows.map(row => row.dimensionValues[0]?.value || 'N/A');
    const activeUsers = ga4Data.rows.map(row => row.metricValues[0]?.value || 0);
    const sessions = ga4Data.rows.map(row => row.metricValues[1]?.value || 0);
    const bounceRate = ga4Data.rows.map(row => row.metricValues[2]?.value || 0);
    const avgSessionDuration = ga4Data.rows.map(row => row.metricValues[3]?.value || 0);

    const data = {
        labels,
        datasets: [
            {
                label: 'Active Users',
                data: activeUsers,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Sessions',
                data: sessions,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
            },
            {
                label: 'Bounce Rate',
                data: bounceRate,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
            },
            {
                label: 'Avg. Session Duration',
                data: avgSessionDuration,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    return <Line data={data} />;
};

export default GAnalyticsGraph;