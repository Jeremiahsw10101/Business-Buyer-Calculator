function calculate() {
    var monthlyRevenue = parseInput(document.getElementById('monthlyRevenue').value);
    var monthlyExpenses = parseInput(document.getElementById('monthlyExpenses').value);
    var investmentAmount = parseInput(document.getElementById('investmentAmount').value);
    var loanAmount = parseInput(document.getElementById('loanAmount').value);
    var interestRate = parseInput(document.getElementById('interestRate').value) / 100 / 12; // Convert annual rate to monthly
    var loanTerm = parseInput(document.getElementById('loanTerm').value) * 12; // Convert years to months

    if (isNaN(monthlyRevenue) || isNaN(monthlyExpenses) || isNaN(investmentAmount) ||
        isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        alert("Please enter valid numbers in all fields.");
        return;
    }

    var monthlyProfit = monthlyRevenue - monthlyExpenses;
    var annualProfit = monthlyProfit * 12;
    var monthlyLoanPayment = loanAmount * interestRate / (1 - Math.pow(1 + interestRate, -loanTerm));
    var totalLoanCost = monthlyLoanPayment * loanTerm;
    var totalInterestPaid = totalLoanCost - loanAmount;
    var principal = loanAmount;
    var interest = totalInterestPaid;

    document.getElementById('result').innerHTML = `
        <p>Adjusted Monthly Profit After Loan Payments: ${formatNumber(monthlyProfit - monthlyLoanPayment)}</p>
        <p>Adjusted Yearly Profits After Loan Payments: ${formatNumber(annualProfit - monthlyLoanPayment * 12)}</p>
    `;
    document.getElementById('result').style.display = 'block';

    drawPieChart(principal, interest);

    var totalPayments = monthlyLoanPayment * loanTerm;

// Add the missing outputs
var resultHTML = `
    <p>Income from Operations (Monthly): ${formatNumber(monthlyOperationIncome)}</p>
    <p>Annual Income from Operations: ${formatNumber(annualOperationIncome)}</p>
    <p>Break-even Point on Personal Investment (months): ${formatNumber(personalBreakEvenPoint)}</p>
    <p>Break-even Point vs. Total Loan Cost (months): ${formatNumber(loanBreakEvenPoint)}</p>
    <p>Loan Payment Per Month: ${formatNumber(monthlyLoanPayment)}</p>
    <p>Total Cost of Loan: ${formatNumber(totalLoanCost)}</p>
    <p>Total Interest Paid on Loan: ${formatNumber(totalInterestPaid)}</p>
    <p>Adjusted Monthly Profit After Loan Payments: ${formatNumber(adjustedMonthlyProfit)}</p>
    <p>Adjusted Yearly Profits After Loan Payments: ${formatNumber(adjustedAnnualProfit)}</p>
`;

}

function clearForm() {
    document.getElementById('monthlyRevenue').value = '';
    document.getElementById('monthlyExpenses').value = '';
    document.getElementById('investmentAmount').value = '';
    document.getElementById('loanAmount').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('loanTerm').value = '';
    document.getElementById('result').style.display = 'none';
    var loanChart = Chart.getChart("loanChart"); // Get the chart instance
    if (loanChart) {
        loanChart.destroy(); // Destroy the chart instance if it exists
    }
}

function parseInput(inputValue) {
    return parseFloat(inputValue.replace(/,/g, ''));
}

function formatNumber(number) {
    // This will format the number as currency with two decimal places
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


function drawPieChart(principal, interest) {
    var ctx = document.getElementById('loanChart').getContext('2d');
    var loanChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#4e73df', '#1cc88a'],
                hoverBackgroundColor: ['#2e59d9', '#17a673'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
}

document.querySelectorAll('input[type=text]').forEach(input => {
    input.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9\.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
});


// Add this at the end of your script.js
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});
