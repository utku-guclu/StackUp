class BankAccount {
  constructor(accountHolderName, accountType) {
    this.accountHolderName = accountHolderName;
    this.accountType = accountType;
    this.balance = 0;
    this.isOperationSuccess = false;
  }

  // Methods to deposit, withdraw and check balance
  deposit(amount) {
    this.balance += amount;
  }

  withdraw(amount) {
    if (amount <= this.balance && this.balance !== 0) {
      this.balance -= amount;
      this.isOperationSuccess = true;
    } else {
      throw new Error("Insufficient funds");
    }
  }

  checkBalance() {
    return this.balance;
  }
}

const accountHolderName = document.getElementById("accountHolderName").value;
const accountType = document.getElementById("accountType").value;
// Create a new BankAccount instance
const bankAccount = new BankAccount(accountHolderName, accountType);

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  
  const amount = parseFloat(document.getElementById("amount").value);
  // Get the selected operation from the user
  const operation = document.querySelector('select[name="operation"]').value;

  try {
    if (amount <= 0) {
      throw new Error("Please enter an amount of greater than 0");
    }
    switch (operation) {
      case "deposit":
        bankAccount.deposit(amount);
        showMessage(`Deposited $${amount}`);
        break;
      case "withdraw":
        bankAccount.withdraw(amount);
        showMessage(`Withdrawn $${amount}`);
        break;
      case "checkBalance":
        const balance = bankAccount.checkBalance();
        if (amount > 0) {
          const accountName = bankAccount.accountHolderName;
          const accountType = bankAccount.accountType;

          showMessage(`${accountName} - $${balance} (${accountType})`);
        } else {
          showMessage(`Acount Balance $${balance}`);
        }
        break;
      default:
        throw new Error("Invalid operation");
    }
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    // Display a "Thank you" message after a
    if (bankAccount.isOperationSuccess) {
      setTimeout(() => {
        showMessage("Thank you for using our service!", "success");
        bankAccount.isOperationSuccess = false;
      }, 2000);
    }
  }
}

// Function to display messages
function showMessage(message, messageType = "info") {
  const messageEl = document.getElementById("message");
  messageEl.textContent = message;

  if (messageType === "error") {
    messageEl.style.color = "red";
  } else if (messageType === "success") {
    messageEl.style.color = "green";
  } else {
    messageEl.style.color = "black";
  }
}

// Attach form submit handler
const form = document.getElementById("bankForm");
form.addEventListener("submit", handleFormSubmit);
