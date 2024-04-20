var loanChartInstance;
var loanPaymentChartInstance;

function initSlider(sliderId, valueDisplayId, start, min, max, step) {
    var slider = document.getElementById(sliderId);
    var valueDisplay = document.getElementById(valueDisplayId);

    noUiSlider.create(slider, {
        start: start,
        step: step,
        connect: [true, false],
        range: {
            'min': min,
            'max': max
        }
    });

    slider.noUiSlider.on('update', function (values) {
        valueDisplay.innerHTML = parseFloat(values[0]).toFixed(2);
    });

    slider.noUiSlider.on('change', calculate);
}

function initSliders() {
    initSlider('monthlyRevenueSlider', 'monthlyRevenueValue', 15000, 0, 50000, 1000);
    initSlider('monthlyExpensesSlider', 'monthlyExpensesValue', 7000, 0, 50000, 1000);
    initSlider('investmentAmountSlider', 'investmentAmountValue', 20000, 0, 100000, 1000);
    initSlider('loanAmountSlider', 'loanAmountValue', 150000, 0, 500000, 5000);
    initSlider('interestRateSlider', 'interestRateValue', 7.5, 0, 20, 0.1);
    initSlider('loanTermSlider', 'loanTermValue', 10, 1, 20, 1);

    calculate();
}

document.addEventListener('DOMContentLoaded', initSliders);

function calculate() {
    var monthlyRevenue = parseFloat(document.getElementById('monthlyRevenueSlider').noUiSlider.get());
    var monthlyExpenses = parseFloat(document.getElementById('monthlyExpensesSlider').noUiSlider.get());
    var investmentAmount = parseFloat(document.getElementById('investmentAmountSlider').noUiSlider.get());
    var loanAmount = parseFloat(document.getElementById('loanAmountSlider').noUiSlider.get());
    var interestRate = parseFloat(document.getElementById('interestRateSlider').noUiSlider.get()) / 100;
    var loanTerm = parseFloat(document.getElementById('loanTermSlider').noUiSlider.get()) * 12;

    var monthlyOperationIncome = monthlyRevenue - monthlyExpenses;
    var annualOperationIncome = monthlyOperationIncome * 12;
    var monthlyLoanPayment = calculateLoanPayment(loanAmount, interestRate, loanTerm);
    var totalPayments = monthlyLoanPayment * loanTerm;
    var totalInterestPaid = totalPayments - loanAmount;
    var adjustedMonthlyProfit = monthlyOperationIncome - monthlyLoanPayment;
    var adjustedAnnualProfit = adjustedMonthlyProfit * 12;

    var totalBusinessPrice = investmentAmount + loanAmount;
    var businessInterestRate = (annualOperationIncome / totalBusinessPrice) * 100;
    var annualLoanPayments = monthlyLoanPayment * 12;
    var personalInvestmentInterest = ((annualOperationIncome - annualLoanPayments) / investmentAmount) * 100;

    var yearsToPayOffInterest = (annualOperationIncome > 0) ? totalInterestPaid / annualOperationIncome : 'N/A';
    var yearsToPayOffLoan = (annualOperationIncome > 0) ? totalPayments / annualOperationIncome : 'N/A';
    

    var resultHTML = `
    <p>Monthly Operational Income: ${formatNumber(monthlyOperationIncome)}</p>
    <p>Annual Operational Income: ${formatNumber(annualOperationIncome)}</p>
    <p>Total Business Valuation: ${formatNumber(totalBusinessPrice)}</p>
    <p>Return on Business Purchase Price: ${businessInterestRate.toFixed(2)}%</p>
    <p>Return on Personal Investment: ${personalInvestmentInterest.toFixed(2)}%</p>
    <p>Time to Recoup Loan Interest with Income: ${yearsToPayOffInterest.toFixed(2)} Years</p>
    <p>Time Till you can own 100% of the business: ${yearsToPayOffLoan.toFixed(2)} Years</p>
    <p>Cumulative Loan Payments: ${formatNumber(totalPayments)}</p>
    <p>Average Monthly Loan Payment: ${formatNumber(monthlyLoanPayment)}</p>
    <p>Total Interest Incurred on Loan: ${formatNumber(totalInterestPaid)}</p>
    <p>Net Monthly Profit (Post-Loan Payments): ${formatNumber(adjustedMonthlyProfit)}</p>
    <p>Net Annual Profit (Post-Loan Payments): ${formatNumber(adjustedAnnualProfit)}</p>
    `;

    document.getElementById('result').innerHTML = resultHTML;
    document.getElementById('result').style.display = 'block';

    drawPieChart(loanAmount, totalInterestPaid);
    drawLoanPaymentChart(adjustedMonthlyProfit, monthlyLoanPayment);
}


function clearForm() {
    initSliders();
    document.getElementById('result').style.display = 'none';
    if (loanChartInstance) {
        loanChartInstance.destroy();
        loanChartInstance = null;
    }
    if (loanPaymentChartInstance) {
        loanPaymentChartInstance.destroy();
        loanPaymentChartInstance = null;
    }
}

function formatNumber(number) {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function calculateLoanPayment(loanAmount, interestRate, loanTerm) {
    var monthlyInterestRate = interestRate / 12;
    return (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));
}

function drawPieChart(principal, interest) {
    var ctx = document.getElementById('loanChart').getContext('2d');
    if (loanChartInstance) {
        loanChartInstance.data.datasets[0].data = [principal, interest];
        loanChartInstance.update();
    } else {
        loanChartInstance = new Chart(ctx, {
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
                responsive: true,
                width: 100,
                height: 100, // Set the desired width and height
                plugins: {
                    title: {
                        display: true,
                        text: 'Loan Payment Breakdown (Principal vs. Interest)',
                        font: {
                            size: 16
                        }
                    }
                },
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
}

function drawLoanPaymentChart(profit, payment) {
    var ctx = document.getElementById('loanPaymentChart').getContext('2d');
    if (loanPaymentChartInstance) {
        loanPaymentChartInstance.data.datasets[0].data = [profit, payment];
        loanPaymentChartInstance.update();
    } else {
        loanPaymentChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Profit After Loan Payments', 'Loan Payment'],
                datasets: [{
                    data: [profit, payment],
                    backgroundColor: ['#1cc88a', '#f6c23e'],
                    hoverBackgroundColor: ['#17a673', '#f4b619'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                width: 100,
                height: 100, // Set the desired width and height
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Loan Payments as a Share of Monthly Income',
                        font: {
                            size: 16
                        }
                    }
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: true,
                    caretPadding: 10,
                },
                legend: {
                    display: true
                },
                cutoutPercentage: 50,
            },
        });
    }
}

// Function to send queries to ChatGPT or a similar AI and other event listeners...

// Function to send queries to ChatGPT or a similar AI
async function askAI() {
    const userQuery = document.getElementById('userQuery').value;
    let augmentedQuery = userQuery;

    // Check if calculator results are displayed
    const resultElement = document.getElementById('result');
    if (resultElement && resultElement.style.display !== 'none') {
        const calculatorResults = resultElement.innerText;

        augmentedQuery = `
        Soon I will ask you a question. I want you to respond to my question, however if my question involves
        something about this data, respond to my question given that data:

        " ${calculatorResults} "

        - However, if my question does not involve business or this data somehow, I want you to ignore the previous business
        data and just answer my question normally.

        - Ok, here is my question:

        " ${userQuery} "

        - also, moving forward, do not talk about the fact that you are doing this, or reference any of the data about the business unless specifically
        asked to talk about it.

        Also, I want you to take into account that you are a tool to help a potential investor that is interested in
        buying a business. The investor is most importantly interested in generating a profit for himself and will be
        especially focusing on the Return on investment he will get from his personal investment costs

        Also a business is a better business if it generates more monthly cash flow minus the loan payment costs each month, the higher the ratio of
        monthly cash flow to loan payment costs, the better the business is (make sure to mention this in your answer if applicable)
        `;

        console.log(augmentedQuery); // Log the augmentedQuery directly
    }

    const responseElement = document.getElementById('aiResponse');

    try {
        const response = await fetch('/ask-openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: augmentedQuery, max_tokens: 150 }) // Use the augmentedQuery here
        });

        const text = await response.text();

        if (text) {
            responseElement.innerText = text;
            responseElement.style.display = 'block'; // Make the element visible
        } else {
            responseElement.innerText = 'No response from AI.';
            responseElement.style.display = 'block'; // Make the element visible
        }
    } catch (error) {
        console.error('Error:', error);
        responseElement.innerText = 'Failed to get response.';
        responseElement.style.display = 'block'; // Make the element visible even in case of error
    }
}

// Add event listener for 'Enter' keypress
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});

// Ensure numeric inputs are correctly formatted
document.querySelectorAll('input.numeric-input').forEach(input => {
    input.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });
});

document.getElementById('userQuery').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        // Check if text is entered in the input box
        if (this.value.trim() !== '') {
            askAI();
        }
    }
});
