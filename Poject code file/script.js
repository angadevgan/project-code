document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('health-form');
    const bmiButton = document.getElementById('calculate-bmi');
    const bmiResult = document.getElementById('bmi-result');
    const tableBody = document.querySelector('#records-table tbody');
    const chartCanvas = document.getElementById('health-chart');
    const recommendationText = document.getElementById('recommendation-text');
    let bmiValue = null;

    // Local Storage to retain data across reloads
    let healthData = JSON.parse(localStorage.getItem('healthData')) || [];
    let chartInstance;

    // BMI Calculation
    bmiButton.addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('bmi-weight').value);
        const height = parseFloat(document.getElementById('bmi-height').value) / 100;

        if (weight && height) {
            const bmi = (weight / (height * height)).toFixed(2);
            let category = '';
            let recommendation = '';

            if (bmi < 18.5) {
                category = 'Underweight';
                recommendation = `<p><strong>Focus:</strong> Gain weight with nutrient-rich foods and strength training.</p>`;
            } else if (bmi < 24.9) {
                category = 'Normal';
                recommendation = `<p><strong>Focus:</strong> Maintain a healthy weight with balanced nutrition and activity.</p>`;
            } else if (bmi < 29.9) {
                category = 'Overweight';
                recommendation = `<p><strong>Focus:</strong> Lose weight through balanced diet and increased activity.</p>`;
            } else {
                category = 'Obese';
                recommendation = `<p><strong>Focus:</strong> Consult a healthcare provider for personalized advice.</p>`;
            }

            bmiValue = bmi;
            bmiResult.innerHTML = `Your BMI is <strong>${bmi}</strong> (${category}).`;
            recommendationText.innerHTML = recommendation;
        } else {
            alert("Please enter valid weight and height.");
        }
    });

    // Save Data
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const date = document.getElementById('date').value;
        const steps = parseInt(document.getElementById('steps').value, 10);
        const calories = parseInt(document.getElementById('calories').value, 10);
        const sleep = parseFloat(document.getElementById('sleep').value);
        const weight = parseFloat(document.getElementById('weight').value);

        if (!date || isNaN(steps) || isNaN(calories) || isNaN(sleep) || isNaN(weight)) {
            alert("Please fill in all fields.");
            return;
        }

        if (bmiValue === null) {
            alert("Please calculate your BMI before saving.");
            return;
        }

        const newData = { date, steps, calories, sleep, weight, bmi: bmiValue };
        healthData.push(newData);

        // Save to localStorage
        localStorage.setItem('healthData', JSON.stringify(healthData));

        // Update UI
        updateTable(healthData);
        updateGraph(healthData);

        // Reset form
        form.reset();
        bmiValue = null;
        bmiResult.textContent = "";
        recommendationText.innerHTML = "";
    });

    // Update Table
    const updateTable = (data) => {
        tableBody.innerHTML = '';
        data.forEach(({ date, steps, calories, sleep, weight, bmi }) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${date}</td>
                    <td>${steps}</td>
                    <td>${calories}</td>
                    <td>${sleep}</td>
                    <td>${weight}</td>
                    <td>${bmi}</td>
                </tr>`;
        });
    };

    // Update Graph
    const updateGraph = (data) => {
        const labels = data.map((entry) => entry.date).slice(-7); // Last 7 entries
        const stepsData = data.map((entry) => entry.steps).slice(-7);
        const caloriesData = data.map((entry) => entry.calories).slice(-7);

        if (chartInstance) {
            chartInstance.destroy(); // Destroy the previous chart instance
        }

        chartInstance = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Steps Walked',
                        data: stepsData,
                        borderColor: '#ff6f61',
                        backgroundColor: 'rgba(255, 111, 97, 0.3)',
                        borderWidth: 4,
                        pointBackgroundColor: '#ff4500',
                        pointRadius: 7,
                    },
                    {
                        label: 'Calories Consumed',
                        data: caloriesData,
                        borderColor: '#36a2eb',
                        backgroundColor: 'rgba(54, 162, 235, 0.3)',
                        borderWidth: 4,
                        pointBackgroundColor: '#1e90ff',
                        pointRadius: 7,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Date', color: '#333', font: { size: 16, weight: 'bold' } },
                        ticks: { color: '#4e54c8', font: { size: 14, weight: '600' }, padding: 10 },
                        grid: { color: 'rgba(200, 200, 200, 0.5)', lineWidth: 1 },
                    },
                    y: {
                        title: { display: true, text: 'Values', color: '#333', font: { size: 16, weight: 'bold' } },
                        ticks: { color: '#ff6f61', font: { size: 14, weight: '600' }, padding: 10 },
                        grid: { color: 'rgba(200, 200, 200, 0.5)', lineWidth: 1 },
                    },
                },
                plugins: {
                    chartAreaBackground: { color: 'rgba(240, 248, 255, 0.5)' },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { color: '#333', font: { size: 14, weight: 'bold' } },
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        titleFont: { size: 16, weight: 'bold' },
                        bodyFont: { size: 14, weight: 'normal' },
                        padding: 10,
                    },
                },
            },
        });
        
        
        
    };

    // Initialize UI
    updateTable(healthData);
    updateGraph(healthData);
});
