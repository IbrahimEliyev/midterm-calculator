const opArea = document.querySelector('.op-area');
const resultArea = document.querySelector('.result-area');
const resultDisplay = document.querySelector('.result');
const keys = document.querySelectorAll('.key');

let currentInput = '0';
let result = 0;
let resetScreen = false;
let lastOperation = false;

function handleKeyClick(event) {
    const key = event.target;
    const keyValue = key.textContent;
    const isOperator = key.classList.contains('op');
    const isNumber = key.classList.contains('num');

    if (resetScreen && isNumber) {
        currentInput = '';
        resetScreen = false;
    }

    if (isNumber) {
        if (currentInput === '0' && keyValue !== '.') {
            currentInput = keyValue;
        } else if (keyValue === '.' && !currentInput.split(/[-+*/]+/).pop().includes('.')) {

            currentInput += keyValue;
        } else if (keyValue !== '.') {
            currentInput += keyValue;
        }
        updateDisplay(currentInput.replace(/\*/g, 'x'));
        lastOperation = false;
    } else if (isOperator) {
        handleOperator(keyValue);
    }
}

function handleOperator(operator) {
    switch (operator) {
        case 'C':
            clearAll();
            break;
        case '←':
            backspace();
            break;
        case '±':
            toggleSign();
            break;
        case '=':
            compute();
            break;
        case '%':
            findPercentage();
            break;
        default:
            addOperatorToInput(operator);
            break;
    }
}

function updateDisplay(displayValue) {
    opArea.textContent = displayValue;
}

function clearAll() {
    currentInput = '0';
    result = 0;
    resetScreen = false;
    resultArea.classList.add('hidden');
    updateDisplay(currentInput);
}

function backspace() {
    currentInput = currentInput.slice(0, -1) || '0';
    updateDisplay(currentInput.replace(/\*/g, 'x'));
}

function toggleSign() {
    const match = currentInput.match(/([+\-*/])?\s*(\(-?\d+(\.\d+)?\)|-?\d+(\.\d+)?)$/);

    if (match) {
        const operator = match[1] || ""; 
        let number = match[2];

        if (operator === '+' || operator === '-') {
            const newOperator = operator === '+' ? '-' : '+';
            currentInput = currentInput.slice(0, -match[0].length) + newOperator + number;
        } else {
            if (number.startsWith("(-")) {
                number = number.slice(2, -1);
            } else if (number.startsWith('-')) {
                number = number.slice(1);
            } else {
                number = `(-${number})`;
            }
            currentInput = currentInput.slice(0, -match[0].length) + operator + number;
        }

        updateDisplay(currentInput.replace(/\*/g, 'x'));
    }
}


function addOperatorToInput(operator) {
    if (currentInput && !/[\+\-\*\/%x]$/.test(currentInput)) {
        currentInput += operator === 'x' ? '*' : operator;
        updateDisplay(currentInput.replace(/\*/g, 'x'));
        resetScreen = false;
    }
}

function findPercentage() {
    const lastNumberMatch = currentInput.match(/-?\d+(\.\d+)?$/);
    if (lastNumberMatch) {
        const lastNumber = parseFloat(lastNumberMatch[0]);
        const percentage = (lastNumber / 100).toString();

        currentInput = currentInput.slice(0, -lastNumberMatch[0].length) + percentage;
        updateDisplay(currentInput.replace(/\*/g, 'x'));
    }
}

function compute() {
    try {
        if (currentInput === '0/0') {
            resultDisplay.textContent = "Not Defined";
            return;
        }

        const correctedInput = currentInput.replace(/x/g, '*');

        const isValidExpression = /^[0-9\-+*/(). x]+$/.test(correctedInput);
        if (!isValidExpression) throw new Error("Invalid expression");

        result = eval(correctedInput);
        resultDisplay.textContent = formatResult(result);

        opArea.textContent = currentInput.replace(/\*/g, 'x');

        currentInput = result.toString();
        resultArea.classList.remove('hidden');
        resetScreen = true;
        lastOperation = true;
    } catch (e) {
        alert("Invalid expression");
    }
}

function formatResult(result) {
    return Number.isInteger(result) ? result : result.toFixed(5);
}

keys.forEach(key => key.addEventListener('click', handleKeyClick));