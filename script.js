const expenseTable = document.querySelector('.table-items');
const totalExpense = document.querySelector("#total");
const categoryFilter = document.querySelector("#category-filter");
const addExpenseBtn = document.querySelector("#add-expense-btn");

const expenseName = document.querySelector("#expense-name");
const expenseAmount = document.querySelector("#expense-amount");
const expenseCategory = document.querySelector("#expense-category");
const expenseDate = document.querySelector("#expense-date");

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
console.log(expenses);

let editingExpenseId = null;
let deletingExpenseId = null;

// Update UI

function updateUI() {
    expenseTable.innerHTML = '';
    let total = 0;

    if(expenses.length === 0){
        const emptyMsgRow = document.createElement('tr');
        emptyMsgRow.innerHTML = `<td colspan=5 class = "empty-table-message">No Expenses found</td>`;
        expenseTable.appendChild(emptyMsgRow);
    }
    else{
        expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                <button class="edit-btn" onClick='openEditExpense(${expense.id})'>Edit</button>
                <button class ="delete-btn" onClick='openDeleteExpense(${expense.id})'>Delete</button>
                </td>
                `;
                expenseTable.appendChild(row);
                total += expense.amount;
        });
    }
    totalExpense.textContent = total.toFixed(2);
}


// check if inputs are valid and enable add expense button
function validateInputs(){
    if(expenseName.value.trim() && expenseAmount.value.trim() && expenseCategory.value && expenseDate.value){
        addExpenseBtn.disabled = false;
    }
    else{
        addExpenseBtn.disabled = true;
    }
}


// Add EventListener for each Input field to check if button should be enabled

[expenseName,expenseAmount,expenseCategory,expenseDate].forEach(input => {
    input.addEventListener('input',validateInputs);

});

// Add Expense to table and LocalStorage

addExpenseBtn.addEventListener('click',() => {
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    console.log(name,amount,category,date);

    if(!name || isNaN(amount) || !date){
        alert("Please fill out all the fields.");
        return;
    }

    const expense = {
        id:Date.now(),
        name,
        amount,
        category,
        date
    }
    expenses.push(expense);
    localStorage.setItem('expenses',JSON.stringify(expenses));

    expenseName.value = '';
    expenseAmount.value = '';
    expenseCategory.value = '';
    expenseDate.value = '';
    addExpenseBtn.disabled = true;

    updateUI();
});


// open Edit Expense

function openEditExpense(id){
    const expense = expenses.find(exp => exp.id === id);

    if(!expense){
        return;
    }

    document.querySelector('#edit-expense-name').value = expense.name;
    document.querySelector('#edit-expense-amount').value = expense.amount;
    document.querySelector('#edit-expense-category').value = expense.category;
    document.querySelector('#edit-expense-date').value = expense.date;

    editingExpenseId = id;
    openPopup('#edit-expense');
}

// Save Edited Expense

const confirmEdit = document.querySelector('#confirm-edit');

confirmEdit.addEventListener('click', () => {
    const name = document.querySelector("#edit-expense-name").value.trim();
    const amount = parseFloat(document.querySelector("#edit-expense-amount").value);
    const category = document.querySelector("#edit-expense-category").value;
    const date = document.querySelector("#edit-expense-date").value;

    if(!name || isNaN(amount) || !date){
        alert("Please fill out all the fields.");
        return;
    }
    const index = expenses.findIndex(exp => exp.id === editingExpenseId);

    if(index > -1){
        expenses[index] = {
            id:editingExpenseId,
            name,
            amount,
            category,   
            date
        }

        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateUI();
    }
    closePopup('#edit-expense');

});

// Cancel and close edit popup

const cancelEdit = document.querySelector('#cancel-edit');
cancelEdit.addEventListener('click', () => {
    closePopup('#edit-expense');
});






// Open Delete Expense popup

function openDeleteExpense(id) {
    deletingExpenseId = id;
    openPopup('#delete-expense');
}


// Confirm Delete Expense

const confirmDelete = document.querySelector('#confirm-delete');
confirmDelete.addEventListener('click', () => {
    expenses = expenses.filter(exp => exp.id !== deletingExpenseId);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateUI();
    closePopup('#delete-expense');
});

// Cancel and close delete popup
const cancelDelete = document.querySelector('#cancel-delete');
cancelDelete.addEventListener('click', () => {
    closePopup('#delete-expense');
});



// Open Popup by ID

function openPopup(popupId) {
    document.querySelector(popupId).style.display = 'flex';
}

function closePopup(popupId) {
    document.querySelector(popupId).style.display = 'none';
}

// Category Filter 

categoryFilter.addEventListener('change', () => {
    const selectedCategory = categoryFilter.value;
    if(selectedCategory === 'All') {
        expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    }else{
        expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = expenses.filter(exp => exp.category === selectedCategory);
    }

    updateUI();
});


updateUI();