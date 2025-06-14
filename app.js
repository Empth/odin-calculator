const KEY_MAP = {"0": "zero", "1": "one", "2":"two", "3": "three", "4": "four", 
    "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine", "+": "plus",
    "-": "minus", "*": "times", "/": "divide", "c": "clear", ".": "decimal", 
    "Enter": 'equal', "n": "negative", "Backspace": "backspace", "=": "equal"}; // TODO add proper backspace
let round = 4; // Number of digits to round to

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

let clickEvent = new CustomEvent("click");

let allDigitButtons = document.querySelectorAll(".digit");
let digitButtonArr = [...allDigitButtons];
digitButtonArr.forEach(btn => {
    btn.addEventListener("click", (e) => {
        let digit = e.target.textContent;
        restartResult();
        appendDigit(digit);
        updateDisplay();
        setResultOff();
        e.target.blur(); // this removes focus from button after click
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
        e.target.blur();
    });
})

let equalButton = document.querySelector(".equal");
equalButton.addEventListener("click", (e) => {
    evaluate();
    updateDisplay();
    e.target.blur();
})

let clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", (e) => {
    clear();
    updateDisplay();
    setResultOff();
    e.target.blur();
})

let decimalButton = document.querySelector(".decimal");
decimalButton.addEventListener("click", (e) => {
    restartResult();
    appendDecimal();
    updateDisplay();
    setResultOff();
    e.target.blur();
})

let precisionButton = document.querySelector(".precise");
precisionButton.addEventListener("click", () => {
    let formerRound = round; // for null
    round = prompt("Enter degree of precision to show in displayed numbers "+
        "(e.g. 4 to truncate displayed number to 4 decimal places).", round);
    round = round === null ? formerRound : round
    clear();
    updateDisplay();
    setResultOff();  
})

let negativeButton = document.querySelector(".negative");
negativeButton.addEventListener("click", (e) => {
    makeNegative();
    updateDisplay();
    e.target.blur();
})

let backspaceButton = document.querySelector(".backspace");
backspaceButton.addEventListener("click", (e) => {
    restartResult();
    backspace();
    updateDisplay();
    setResultOff();
    e.target.blur();
})

document.addEventListener('keypress', (e) => {
    let keyPress = e.key;
    if (keyPress in KEY_MAP) {
        let keyButton = document.querySelector("."+KEY_MAP[keyPress]);
        keyButton.dispatchEvent(clickEvent);
    }
})

document.addEventListener('keyup', (e) => {
    let keyPress = e.key;
    console.log(keyPress)
    if (keyPress === "Backspace") {
        let keyButton = document.querySelector("."+KEY_MAP[keyPress]);
        keyButton.dispatchEvent(clickEvent);
    }
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
    let displayedSecondNumberString = parenthesize ? "("
    +truncateDecimal(secondNumberString, round)+")" : secondNumberString
    display.textContent = truncateDecimal(firstNumberString, round) 
    + operatorString + displayedSecondNumberString;
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
    result = (+truncateDecimal(result.toString(), 10)) // this handles 0.1 + 0.2 hell
    display.textContent = result.toString();
    firstNumberString = result.toString();
    secondNumberString = operatorString = "";
    onResult = true;
}

function clear() {
    // clears stored digits, op
    firstNumberString = secondNumberString = operatorString = "";
}

function setResultOff() {
    onResult = false;
}

function makeNegative() {
    // makes cur digit negative or reverts negativity if already negative
    if (operatorString === "") {
            firstNumberString = firstNumberString[0] === "-"
            ? firstNumberString.slice(1) : "-"+firstNumberString;
    } else {
            secondNumberString = secondNumberString[0] === "-"
            ? secondNumberString.slice(1) : "-"+secondNumberString;
    }
}

function restartResult() {
    // for resetting progress after result is evaluated and we press a non operation/negative key
    if (operatorString === "" && onResult) {
        firstNumberString = "";
    }
}

function backspace() {
    if (secondNumberString !== "") {
        console.assert(firstNumberString !== "" && operatorString !== "");
        secondNumberString = secondNumberString.slice(0, -1);
    } else if (operatorString !== "") {
        console.assert(firstNumberString !== "");
        operatorString = "";
    } else if (firstNumberString !== "") {
        firstNumberString = firstNumberString.slice(0, -1);
    } else {
        console.log("Can't backspace on blank");
    }
}

function truncateDecimal(str, maxDecimals) {
    // Thanks chatgpt! :^)
    str = String(str);

    // find if there's an exponent part: 'e' or 'E'
    const eIndex = str.search(/e/i);
    let mantissa, exponent;
    if (eIndex === -1) {
        mantissa = str;
        exponent = '';
    } else {
        mantissa = str.slice(0, eIndex);
        exponent = str.slice(eIndex); // includes the 'e' or 'E' and everything after
    }

    const dotIndex = mantissa.indexOf('.');
    if (dotIndex === -1) {
        // no decimal point ⇒ nothing to truncate on the mantissa
        return mantissa + exponent;
    }

    const actualDecimals = mantissa.length - dotIndex - 1;
    if (actualDecimals <= maxDecimals) {
        // already within limit ⇒ return original mantissa (preserves any trailing zeros)
        return mantissa + exponent;
    }

    // cut off after dot + maxDecimals
    const truncatedMantissa = mantissa.slice(0, dotIndex + 1 + maxDecimals);
    return truncatedMantissa + exponent;
}


