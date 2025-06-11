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
        restartResult();
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
    restartResult();
    appendDecimal();
    updateDisplay();
    setResultOff();
})

let precisionButton = document.querySelector(".precise");
precisionButton.addEventListener("click", () => {
    let formerRound = round; // for null
    round = prompt("Enter degree of precision (e.g. 3 for round to 3 decimal places). "
        +"Enter none to disable precision.", round);
    round = round === null ? formerRound : round
    clear();
    updateDisplay();
    setResultOff();  
})

let negativeButton = document.querySelector(".negative");
negativeButton.addEventListener("click", () => {
    makeNegative();
    updateDisplay();
})

let backspaceButton = document.querySelector(".backspace");
backspaceButton.addEventListener("click", () => {
    backspace();
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
        if (firstNumberString == "-0") {
            firstNumberString = "-";
        }
        if (firstNumberString.length > 16) { return; }
        firstNumberString = (firstNumberString === "0") ? n : firstNumberString+n; // for leading zeroes
    } else {
        if (secondNumberString == "-0") {
            secondNumberString = "-";
        }
        if (secondNumberString.length > 16) { return; }
        secondNumberString = (secondNumberString === "0") ? n : secondNumberString+n;
    }
}

function appendDecimal() {
    if (operatorString === "") {
        if (firstNumberString.includes(".")) { return; }
        firstNumberString = (firstNumberString === "" ||
        firstNumberString === "-") ? firstNumberString+"0." : firstNumberString+"."; // for 0. on blank
    } else {
        if (secondNumberString.includes(".")) { return; }
        secondNumberString = (secondNumberString === "" ||
        secondNumberString === "-") ? secondNumberString+"0." : secondNumberString+".";
    }
}

function updateOp(input) {
    // Updates operatorString to input, which
    // can be empty str, +, -, ×, ÷
    if (firstNumberString === "" || firstNumberString === "-") {
        alert("Need to enter first number!");
        return;
    }
    operatorString = input;
}

function updateDisplay() {
    let parenthesize = false; // for add/subtraction of negatives
    if (secondNumberString.includes("-") && 
    (operatorString === "-" || operatorString === "+")) {
        parenthesize = true;
    }
    let displayedSecondNumberString = parenthesize ? "("+secondNumberString+")" : secondNumberString
    display.textContent = firstNumberString + operatorString + displayedSecondNumberString;
}

function evaluate() {
    // evaluate 1st and 2nd digits under op.
    // Also sets 1st digit to result and 
    // 2nd digit and op strings to empty str
    if (secondNumberString === "" || secondNumberString === "-") {
        alert("Need to enter second number!");
        return;
    }
    if (operatorString === "÷" && +secondNumberString === 0) {
        alert("You can't do that :^)")
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
    if (round === "none") {
        return num;
    }
    return Math.round((num + Number.EPSILON) * 10**place) / 10**place 
    // eps to ensure correct rounding
}

function setResultOff() {
    onResult = false;
}

function makeNegative() {
    // makes cur digit negative or reverts negativity if already negative
    if (operatorString === "") {
        firstNumberString = firstNumberString.includes("-") 
        ? firstNumberString.slice(1) : "-"+firstNumberString;
    } else {
        secondNumberString = secondNumberString.includes("-") 
        ? secondNumberString.slice(1) : "-"+secondNumberString;
    }
}

function restartResult() {
    // for resetting progress after result is evaluated and we press a non operation/negative key
    if (operatorString === "" && onResult) {
        firstNumberString = "";
    }
}


