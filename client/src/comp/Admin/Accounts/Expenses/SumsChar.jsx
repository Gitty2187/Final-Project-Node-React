import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import randomColor from 'randomcolor'; // הוספת import

const DiagramaExspenses = (props) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const yearSums = props.expenses.reduce((acc, expense) => {
            const parts = expense.date.split('/');
            const year = parseInt(parts[2], 10);
            acc[year] = (acc[year] || 0) + expense.sum; // סכום ההוצאות לפי שנה
            return acc;
        }, {});

        const data = {
            labels: props.years,
            datasets: [
                {
                    label: 'הוצאות',
                    data: props.years.map(year => yearSums[year] || 0), // סכום ההוצאות עבור כל שנה
                    backgroundColor: randomColor({ count: props.years.length , luminosity: 'light'}), // שימוש ב-randomColor
                   
                    borderWidth: 1
                }
            ]
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [props.expenses, props.years]);

    return (
         <div className="card"   style={{margin:'0px',width:'48rem',alignItems:'center'}}>
            <Chart type="bar" data={chartData} options={chartOptions} />
         </div>
    );
}

export default DiagramaExspenses;
