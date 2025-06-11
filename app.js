let round = 4 // Number of digits to round to

let add = (a,b) => a+b;
let subtract = (a,b) => a-b;
let multiply = (a,b) => a*b;
let divide = (a,b) => a/b;
let defaultOperator = (a, b) => a; // default
/*
console.log(add(1, 2)); // 3
console.log(subtract(1, 2)); // -1
console.log(multiply(1, 2)); // 2
console.log(divide(1, 2)); // 0.5
*/

let operate = (operator, a, b) => operator(a, b); // operatorFunc is add, ..., divide callback

let display = document.querySelector(".display");
let firstNumberString = "";
let secondNumberString = "";
let operatorString = ""; // default empty str, +, -, ×, ÷ o/w
let operatorMapFunc = {"": defaultOperator, "+": add, "-": subtract, "×": multiply, "÷": divide};

let onResult = false;

let allDigitButtons = document.querySelectorAll(".digit");
let digitButtonArr = [...allDigitButtons];
digitButtonArr.forEach(btn => {
    btn.addEventListener("click", (e) => {
        let digit = e.target.textContent;
        appendDigit(digit);
        updateDisplay();
        setResultOff();
    });
})

let allOpButtons = document.querySelectorAll(".op");
let opButtonArr = [...allOpButtons];
opButtonArr.forEach(btn => {
    btn.addEventListener("click", (e) => {
        let op = e.target.textContent;
        updateOp(op);
        updateDisplay();
        setResultOff();
    });
})

let equalButton = document.querySelector(".equal");
equalButton.addEventListener("click", () => {
    evaluate();
    updateDisplay();
})

let clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", () => {
    clear();
    updateDisplay();
    setResultOff();
})

let decimalButton = document.querySelector(".decimal");
decimalButton.addEventListener("click", () => {
    appendDecimal();
    updateDisplay();
    setResultOff();
})

// event loop: 
// occupy firstNumberString 
// => occupy operatorString and update curOperator
// => open and occupy secondNumberString
// => press equal to evaluate
// => press digit or clear to restart loop

function appendDigit(n) {
    // append string n to firstNumberString if operatorString 
    // is empty or secondNumberString o/w
    if (operatorString === "") {
        if (onResult) {
            firstNumberString = "";
        }
        firstNumberString = (firstNumberString === "0") ? n : firstNumberString+n; // for leading zeroes
    } else {
        secondNumberString = (secondNumberString === "0") ? n : secondNumberString+n;
    }
}

function appendDecimal() {
    if (operatorString === "") {
        if (onResult) {
            firstNumberString = "";
        }
        if (firstNumberString.includes(".")) { return; }
        firstNumberString = (firstNumberString === "") ? "0." : firstNumberString+"."; // for 0. on blank
    } else {
        if (secondNumberString.includes(".")) { return; }
        secondNumberString = (secondNumberString === "") ? "0." : secondNumberString+".";
    }
}

function updateOp(input) {
    // Updates operatorString to input, which
    // can be empty str, +, -, ×, ÷
    if (firstNumberString === "") {
        alert("Need to enter first number!");
        return;
    }
    operatorString = input;
}

function updateDisplay() {
    display.textContent = firstNumberString + operatorString + secondNumberString;
}

function evaluate() {
    // evaluate 1st and 2nd digits under op.
    // Also sets 1st digit to result and 
    // 2nd digit and op strings to empty str
    if (secondNumberString === "") {
        alert("Need to enter second number!");
        return;
    }
    if (operatorString === "÷" && +secondNumberString === 0) {
        alert(":^)")
        return;
    }
    let result = operate(operatorMapFunc[operatorString], +firstNumberString, +secondNumberString);
    result = roundToDecimal(result, round);
    display.textContent = result.toString();
    firstNumberString = result.toString();
    secondNumberString = operatorString = "";
    onResult = true;
}

function clear() {
    // clears stored digits, op
    firstNumberString = secondNumberString = operatorString = "";
}

function roundToDecimal(num, place) {
    return Math.round((num + Number.EPSILON) * 10**place) / 10**place 
    // eps to ensure correct rounding
}

function setResultOff() {
    onResult = false;
}


