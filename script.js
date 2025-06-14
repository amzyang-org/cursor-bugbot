// Get display element
const display = document.getElementById('display');

// Initialize display
let currentInput = '';
let shouldResetDisplay = false;

// Function to append values to display
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple operators in a row
    if (isOperator(value) && isOperator(currentInput.slice(-1))) {
        return;
    }
    
    // Prevent multiple decimal points
    if (value === '.' && currentInput.includes('.')) {
        // Check if there's an operator after the last decimal point
        const lastOperatorIndex = Math.max(
            currentInput.lastIndexOf('+'),
            currentInput.lastIndexOf('-'),
            currentInput.lastIndexOf('*'),
            currentInput.lastIndexOf('/')
        );
        const lastDecimalIndex = currentInput.lastIndexOf('.');
        
        if (lastDecimalIndex > lastOperatorIndex) {
            return;
        }
    }
    
    currentInput += value;
    display.value = currentInput;
}

// Function to clear the display
function clearDisplay() {
    currentInput = '';
    display.value = '';
}

// Function to delete the last character
function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

// Function to calculate the result
function calculateResult() {
    try {
        if (currentInput === '') return;
        
        // Replace × with * for calculation
        let expression = currentInput.replace(/×/g, '*');
        
        // Validate expression (basic security check)
        if (!isValidExpression(expression)) {
            throw new Error('Invalid expression');
        }
        
        // Calculate result
        let result = eval(expression);
        
        // Handle division by zero and other edge cases
        if (!isFinite(result)) {
            throw new Error('Cannot divide by zero');
        }
        
        // Format result (remove unnecessary decimals)
        result = parseFloat(result.toFixed(10));
        
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
        
        // Clear error after 2 seconds
        setTimeout(() => {
            if (display.value === 'Error') {
                clearDisplay();
            }
        }, 2000);
    }
}

// Helper function to check if a character is an operator
function isOperator(char) {
    return ['+', '-', '*', '/', '×'].includes(char);
}

// Helper function to validate expression
function isValidExpression(expression) {
    // Only allow numbers, operators, and decimal points
    const validChars = /^[0-9+\-*/.() ]+$/;
    return validChars.test(expression);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and operators
    if ('0123456789+-*/'.includes(key)) {
        event.preventDefault();
        if (key === '*') {
            appendToDisplay('×');
        } else {
            appendToDisplay(key);
        }
    }
    
    // Decimal point
    if (key === '.') {
        event.preventDefault();
        appendToDisplay('.');
    }
    
    // Enter or equals
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    }
    
    // Escape or clear
    if (key === 'Escape' || key.toLowerCase() === 'c') {
        event.preventDefault();
        clearDisplay();
    }
    
    // Backspace
    if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize calculator
clearDisplay();