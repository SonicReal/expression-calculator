function eval() {
    // Do not use eval!!!
    return;
}

console.log = function () {
}

function expressionCalculator(expr) {
    console.log('CALC EXPR', expr);
    let result = null;
    while (expr.length > 0) {
        const token = expr[0];
        const parsed = parseToken(expr, true);
        console.log(parsed);
        switch (parsed.type) {
            case 'whitespace':
                expr = crop(expr, parsed.length);
                continue;
            case 'number':
                result = parsed.value;
                expr = crop(expr, parsed.length);
                continue;
            case "sum":
                return result + expressionCalculator(parsed.value);
            case "sub":
                result = result - expressionCalculator(parsed.value);
                expr = crop(expr, parsed.length);
                continue;
            case "multiply":
                result = result * expressionCalculator(parsed.value);
                expr = crop(expr, parsed.length);
                continue;
            case "divide":
                result = result / expressionCalculator(parsed.value);
                expr = crop(expr, parsed.length);
                continue;
            case "expression":
                result = expressionCalculator(parsed.value);
                expr = crop(expr, parsed.length);
        }
    }
    return result;
}


function parseToken(expr, verbose = false) {
    const token = expr[0];
    if (verbose) {
        console.log("token=" + token)
    }
    switch (true) {
        case /\d/.test(token):
            return parseNumber(expr);
        case token === '(':
            return parseExpression(expr);
        case token === '+':
            return parseSum(expr);
        case token === '*':
            return parseMult(expr, verbose);
        case token === '-':
            return parseSubtract(expr);
        case token === '/':
            return parseDiv(expr);
        case token === ' ':
            return {type: 'whitespace', value: ' ', length: 1}
        default:
            console.log(token);

            throw 'not implemented';
    }
}

function parseSum(str) {
    const expression = str.substr(1);
    return {type: 'sum', value: expression, length: expression.length + 1}
}

function parseMult(str) {
    const expression = getNearestExpression(str.substr(1));
    return {type: 'multiply', value: expression, length: expression.length + 1}
}

function parseSubtract(str) {
    const expression = getNearestExpression(str.substr(1));
    return {type: 'sub', value: expression, length: expression.length + 1}

}


function getNearestExpression(expr) {
    let offset = 0;
    let str = expr;
    while (str.length > 0) {
        const parsed = parseToken(str);
        if (parsed.type === "sum" || parsed.type === "sub") {
            return expr.substr(0, offset);
        } else {
            offset += parsed.length;
            str = crop(str, parsed.length);
        }
    }
    return expr.substr(0, offset);
}

function parseDiv(str) {
    const expression = getNearestExpression(str.substr(1));
    return {type: 'divide', value: expression, length: expression.length + 1}
}

function parseExpression(str) {
    const start = 0;
    let end = 0;
    const stack = [];
    stack.push('(');
    while (stack.length > 0) {
        end += 1;
        if (str[end] === '(') {
            stack.push('(')
        }
        if (str[end] === ')') {
            stack.pop();
        }
        if (stack.length > 0 && str[end] === undefined) {
            throw 'ExpressionError: Brackets must be paired'
        }
    }
    const expression = str.substring(start + 1, end);
    return {type: 'expression', value: expression, length: expression.length + 2};
}

function parseNumber(str) {
    let offset = 0;
    let result = '';
    while (/\d/.test(str[offset])) {
        result += str[offset];
        offset++;
    }
    return {type: 'number', value: parseFloat(result), length: result.length};
}

function crop(expr, num) {
    return expr.substr(num);
}

module.exports = {
    expressionCalculator
}
