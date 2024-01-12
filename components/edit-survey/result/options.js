const options = (type) => {
    return {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: type === "bar",
                },
                grid: {
                    display: false,
                    drawBorder: type === "bar",
                },
                ticks: {
                    display: type === "bar",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: type === "bar",
                },
                grid: {
                    display: type === "bar",
                    drawBorder: type === "bar",
                },
                ticks: {
                    display: type === "bar",
                    precision: 0
                },
            },
        },
    };
}

export default options