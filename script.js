function calculate() {
    var monthlyRevenue = parseInput(document.getElementById('monthlyRevenue').value);
    var monthlyExpenses = parseInput(document.getElementById('monthlyExpenses').value);
    var investmentAmount = parseInput(document.getElementById('investmentAmount').value);
    var loanAmount = parseInput(document.getElementById('loanAmount').value);
    var interestRate = parseInput(document.getElementById('interestRate').value) / 100 / 12; // Annual to monthly rate
    var loanTerm = parseInput(document.getElementById('loanTerm').value) * 12; // Years to months

    if (isNaN(monthlyRevenue) || isNaN(monthlyExpenses) || isNaN(investmentAmount) ||
        isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        alert("Please enter valid numbers in all fields.");
        return;
    }

    var monthlyOperationIncome = monthlyRevenue - monthlyExpenses;
    var annualOperationIncome = monthlyOperationIncome * 12;
    var personalBreakEvenPoint = investmentAmount / monthlyOperationIncome;
    var monthlyLoanPayment = loanAmount * (interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);
    var totalLoanCost = monthlyLoanPayment * loanTerm;
    var totalInterestPaid = totalLoanCost - loanAmount;
    var loanBreakEvenPoint = totalLoanCost / monthlyOperationIncome;
    var adjustedMonthlyProfit = monthlyOperationIncome - monthlyLoanPayment;
    var adjustedAnnualProfit = adjustedMonthlyProfit * 12;

    var resultHTML = `
        <p>Income from Operations (Monthly): $${formatNumber(monthlyOperationIncome)}</p>
        <p>Annual Income from Operations: $${formatNumber(annualOperationIncome)}</p>
        <p>Break-even Point on Personal Investment (months): ${formatNumber(personalBreakEvenPoint)}</p>
        <p>Break-even Point vs. Total Loan Cost (months): ${formatNumber(loanBreakEvenPoint)}</p>
        <p>Loan Payment Per Month: $${formatNumber(monthlyLoanPayment)}</p>
        <p>Total Cost of Loan: $${formatNumber(totalLoanCost)}</p>
        <p>Total Interest Paid on Loan: $${formatNumber(totalInterestPaid)}</p>
        <p>Adjusted Monthly Profit After Loan Payments: $${formatNumber(adjustedMonthlyProfit)}</p>
        <p>Adjusted Yearly Profits After Loan Payments: $${formatNumber(adjustedAnnualProfit)}</p>
    `;

    document.getElementById('result').innerHTML = resultHTML;
    document.getElementById('result').style.display = 'block';
}

function clearForm() {
    document.getElementById('monthlyRevenue').value = '';
    document.getElementById('monthlyExpenses').value = '';
    document.getElementById('investmentAmount').value = '';
    document.getElementById('loanAmount').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('loanTerm').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').style.display = 'none';
}

function formatNumber(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,');
}

function parseInput(inputValue) {
    return parseFloat(inputValue.replace(/,/g, ''));
}

document.querySelectorAll('input[type=text]').forEach(input => {
    input.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9\.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
});
