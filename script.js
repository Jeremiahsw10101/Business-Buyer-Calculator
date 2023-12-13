function calculate() {
  var monthlyRevenue = parseInput(document.getElementById('monthlyRevenue').value);
  var monthlyExpenses = parseInput(document.getElementById('monthlyExpenses').value);
  var investmentAmount = parseInput(document.getElementById('investmentAmount').value);
  var loanAmount = parseInput(document.getElementById('loanAmount').value);
  var interestRate = parseInput(document.getElementById('interestRate').value) / 100; // Convert annual rate to a percentage
  var loanTerm = parseInput(document.getElementById('loanTerm').value) * 12; // Convert years to months

  if (isNaN(monthlyRevenue) || isNaN(monthlyExpenses) || isNaN(investmentAmount) ||
    isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
    alert("Please enter valid numbers in all fields.");
    return;
  }

  var monthlyOperationIncome = monthlyRevenue - monthlyExpenses;
  var annualOperationIncome = monthlyOperationIncome * 12;

  // Corrected calculation of monthly loan payment
  var monthlyLoanPayment = calculateLoanPayment(loanAmount, interestRate, loanTerm);

  var personalBreakEvenPointMonths = Math.ceil(loanAmount / monthlyLoanPayment);
  var totalPayments = monthlyLoanPayment * loanTerm;
  var totalInterestPaid = totalPayments - loanAmount;
  var adjustedMonthlyProfit = monthlyOperationIncome - monthlyLoanPayment;
  var adjustedAnnualProfit = adjustedMonthlyProfit * 12;

  var resultHTML = `
    <p>Monthly Income from Operations: ${formatNumber(monthlyOperationIncome)}</p>
    <p>Monthly Loan Payments: ${formatNumber(monthlyLoanPayment)}</p>
    <p>Annual Income from Operations: ${formatNumber(annualOperationIncome)}</p>
    <p>Break-even Point on Loan Payments (months): ${personalBreakEvenPointMonths}</p>
    <p>Total Loan Payment Over Term: ${formatNumber(totalPayments)}</p>
    <p>Total Interest Paid on Loan: ${formatNumber(totalInterestPaid)}</p>
    <p>Adjusted Monthly Profit After Loan Payments: ${formatNumber(adjustedMonthlyProfit)}</p>
    <p>Adjusted Yearly Profits After Loan Payments: ${formatNumber(adjustedAnnualProfit)}</p>
  `;
  // Display the results
  document.getElementById('result').innerHTML = resultHTML;
  document.getElementById('result').style.display = 'block';

  // Draw the pie chart
  drawPieChart(loanAmount, totalInterestPaid);
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
    // Remove commas and trim whitespace
  inputValue = inputValue.replace(/,/g, '').trim();

  // Check if the inputValue is a valid number
  if (!inputValue || isNaN(inputValue)) {
    return NaN; // Return NaN for invalid input
  }

  return parseFloat(inputValue);
}

function formatNumber(number) {
    // This will format the number as currency with two decimal places
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


function calculateLoanPayment(loanAmount, interestRate, loanTerm) {
  var monthlyInterestRate = interestRate / 12;
  return loanAmount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm)));
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


function calculateLoanPayment(loanAmount, interestRate, loanTerm) {
  var monthlyInterestRate = interestRate / 12;
  return (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));
}

// Add this at the end of your script.js
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});
