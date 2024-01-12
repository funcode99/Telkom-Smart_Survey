const options = (length) => {
    return {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                displayColors: false,
            },
        },
        interaction: {
            mode: "index",
            intersect: false,
        },
        elements: {
            line: {
                tension: 0.05,
            },
            point: {
                radius: (context) => {
                    var index = context.dataIndex;
                    var length = context.dataset.data.length;
                    return length - 1 == index ? 5 : 0;
                },
                pointHoverRadius: 8,
                pointHoverBackgroundColor: "rgb(139, 116, 234)",
                pointHoverBorderColor: "rgb(139, 116, 234)",
                pointBackgroundColor: "rgb(139, 116, 234)",
            },
        },

        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    autoSkip: false,
                },
            },
            y: {
                position: "right",
                beginAtZero: length > 1,
                ticks: {
                    precision: 0,
                },
            },
        }
    }
};

export default options