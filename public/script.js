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
        <p>Monthly Income from Operations: ${formatNumber(monthlyOperationIncome)}</p>
        <p>Annual Income from Operations: ${formatNumber(annualOperationIncome)}</p>
        <p>Total Price of the Business: ${formatNumber(totalBusinessPrice)}</p>
        <p>Interest Rate on Business Purchase Price: ${businessInterestRate.toFixed(2)}%</p>
        <p>Interest Rate on Personal Investment: ${personalInvestmentInterest.toFixed(2)}%</p>
        <p>Years until Business Income Pays Off Interest on Loan: ${yearsToPayOffInterest.toFixed(2)}</p>
        <p>Years until Business Income Pays Off Full Loan Amount: ${yearsToPayOffLoan.toFixed(2)}</p>
        <p>Total Loan Payment Over Term: ${formatNumber(totalPayments)}</p>
        <p>Monthly Loan Payments: ${formatNumber(monthlyLoanPayment)}</p>
        <p>Total Interest Paid on Loan: ${formatNumber(totalInterestPaid)}</p>
        <p>Adjusted Monthly Profit After Loan Payments: ${formatNumber(adjustedMonthlyProfit)}</p>
        <p>Adjusted Yearly Profits After Loan Payments: ${formatNumber(adjustedAnnualProfit)}</p>
    `;
    document.getElementById('result').innerHTML = resultHTML;
    document.getElementById('result').style.display = 'block';
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
    var loanChart = Chart.getChart("loanChart");
    if (loanChart) {
        loanChart.destroy();
    }
}

function parseInput(inputValue) {
    inputValue = inputValue.replace(/,/g, '').trim();
    if (!inputValue || isNaN(inputValue)) {
        return NaN;
    }
    return parseFloat(inputValue);
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

// Function to send queries to ChatGPT or a similar AI
async function askAI() {
    //const query = document.getElementById('userQuery').value;
    //const augmentedQuery = " answer this in french: " + query; // Add your extra text here
    // const userQuery = document.getElementById('userQuery').value;
    // const augmentedQuery = " answer this in french: " + userQuery;
    
    const userQuery = document.getElementById('userQuery').value;
    let augmentedQuery = userQuery; 

    // Check if calculator results are displayed
    const resultElement = document.getElementById('result');
    if (resultElement && resultElement.style.display !== 'none') {
        // Extract text from result element and append to query
        const calculatorResults = resultElement.innerText;
        //augmentedQuery = "Soon I will ask you a question. I want you to respond to my question, however if my question involves what you see see in this data, respond to my question given that data:    \" " + calculatorResults + " \"  - However, if my question does not involve business somehow, I want you to ignore the previous business data and just answer my question normally.  -  Ok, here is my question:     \"" + userQuery + "\" also, moving forward, do not talk about the fact that you are doing this, or any of the data about the business unless specifically asked to talk about it. \n ";
        const augmentedQuery = `

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

    }

    const responseElement = document.getElementById('aiResponse');

    try {
        const response = await fetch('/ask-openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: augmentedQuery, max_tokens: 150 })
        });

        const text = await response.text(); // or response.json(), depending on response format

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



// Ensure this event listener is at the bottom of your script.js file
document.querySelectorAll('input.numeric-input').forEach(input => {
    input.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });
});

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});