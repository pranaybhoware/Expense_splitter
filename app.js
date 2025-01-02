let expenses = [];

document.getElementById('addExpenseBtn').addEventListener('click', () => {
  const payer = document.getElementById('payer').value;
  const amount = parseFloat(document.getElementById('amount').value);
  
  if (payer && amount > 0) {
    expenses.push({ payer, amount });
    updateDebtSummary();
  }
});

document.getElementById('calculateBtn').addEventListener('click', () => {
  const optimizedTransactions = calculateOptimalTransactions();
  displayOptimizedTransactions(optimizedTransactions);
});

function updateDebtSummary() {
  const debtSummary = document.getElementById('debt-summary');
  debtSummary.innerHTML = '';

  let totalAmount = 0;
  let people = {};

  // Calculate total amount paid and individual balances
  expenses.forEach(expense => {
    totalAmount += expense.amount;
    if (people[expense.payer]) {
      people[expense.payer] += expense.amount;
    } else {
      people[expense.payer] = expense.amount;
    }
  });

  let equalShare = totalAmount / Object.keys(people).length;

  for (let person in people) {
    let balance = people[person] - equalShare;
    debtSummary.innerHTML += `<p>${person}: ${balance.toFixed(2)}</p>`;
  }
}

function calculateOptimalTransactions() {
  // Debt minimization algorithm (Graph-based or Greedy)
  let transactions = [];
  let balances = {};

  expenses.forEach(expense => {
    if (balances[expense.payer]) {
      balances[expense.payer] += expense.amount;
    } else {
      balances[expense.payer] = expense.amount;
    }
  });

  let equalShare = Object.values(balances).reduce((sum, amount) => sum + amount, 0) / Object.keys(balances).length;

  for (let person in balances) {
    balances[person] -= equalShare;
  }

  // Simplifying debt: Try to make the number of transactions as few as possible
  let debtors = [];
  let creditors = [];

  for (let person in balances) {
    if (balances[person] < 0) {
      debtors.push({ person, amount: Math.abs(balances[person]) });
    } else if (balances[person] > 0) {
      creditors.push({ person, amount: balances[person] });
    }
  }

  // Matching debtors with creditors to minimize transactions
  while (debtors.length > 0 && creditors.length > 0) {
    let debtor = debtors.pop();
    let creditor = creditors.pop();

    let amount = Math.min(debtor.amount, creditor.amount);
    transactions.push(`${debtor.person} pays ${amount.toFixed(2)} to ${creditor.person}`);

    // Update amounts
    if (debtor.amount > creditor.amount) {
      debtors.push({ person: debtor.person, amount: debtor.amount - amount });
    } else if (debtor.amount < creditor.amount) {
      creditors.push({ person: creditor.person, amount: creditor.amount - amount });
    }
  }

  return transactions;
}

function displayOptimizedTransactions(transactions) {
  let debtSummary = document.getElementById('debt-summary');
  debtSummary.innerHTML += '<h3>Optimized Transactions:</h3>';
  transactions.forEach(transaction => {
    debtSummary.innerHTML += `<p>${transaction}</p>`;
  });
}
