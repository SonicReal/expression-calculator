function eval() {
    // Do not use eval!!!
    return;
}

const ex = '2+1';
console.log(ex)
console.log(expressionCalculator(ex));

function expressionCalculator(expr) {
    let result = null;
    for (let cursor = -1; cursor < expr.length; cursor++) {

        const token = expr[cursor];
        if (token === ' ') {
            continue;
        }
        const next = getNext(expr, cursor, true);
        console.log(next);
        switch (next.type) {
            case 'number':
                result = next.value;
                cursor = next.cursor;
                console.log('sssss:', next.cursor)
                break;
            case "sum":
                const sum = result + expressionCalculator(next.value);
                console.log('summed = ' + sum);
                return sum;
            case "sub":
                console.log('need to sub ' + next.value)
                result = result - expressionCalculator(next.value);
                cursor = next.cursor - 1;
                break;
            case "multiply":
                result = result * expressionCalculator(next.value);
                console.log('multiplied = ' + result);
                cursor = next.cursor - 1;
                break;
            case "divide":
                result = result / expressionCalculator(next.value);
                console.log('divided = ' + result);
                cursor = next.cursor - 1;
                break;
            case "expression":
                result = expressionCalculator(next.value);
                cursor = next.cursor - 1;
        }

        // if (next.type === 'expression') {
        //     result = expressionCalculator(next.value);
        // }

        cursor--;
    }
    console.log("wrf")
    return result;
}


function getNext(expr, cursor, show = false) {
    const next_cursor = cursor + 1;
    const token = expr[next_cursor];
    if (show) {
        console.log("token=" + token, 'cursor=', cursor)
    }
    switch (true) {
        case /\d/.test(token):
            return parseNumber(expr, next_cursor);
        case token === '(':
            return parseExpression(expr, cursor);
        case token === '+':
            return parseSum(expr, next_cursor);
        case token === '*':
            return parseMult(expr, cursor, show);
        case token === '-':
            return parseSubtract(expr, cursor);
        case token === '/':
            return parseDiv(expr, cursor);
        default:
            console.log(token, cursor);

            throw 'not implemented';
    }
}

function parseSum(str, cursor) {
    const expression = str.substr(cursor);
    return {type: 'sum', value: expression, cursor: cursor + expression.length}
}

function parseMult(str, cursor, show = false) {
    console.log('parse multipliing')
    const length = getMultiplyExpressionLength(str.substr(cursor + 1), show);
    const expression = str.substr((cursor + 1), length)
    if (show) {
        console.log(length)
        console.log('so expression will be: ', expression, 'cursor:', cursor + expression.length + 1)
    }
    return {type: 'multiply', value: expression, cursor: cursor + expression.length + 1}

}

function parseSubtract(str, cursor) {
    const length = getMultiplyExpressionLength(str.substr(cursor + 1));
    const expression = str.substr((cursor + 1), length)
    return {type: 'sub', value: expression, cursor: cursor + expression.length + 1}

}

function parseDiv(str, cursor) {
    const length = getMultiplyExpressionLength(str.substr(cursor + 1));
    const expression = str.substr((cursor + 1), length)
    return {type: 'divide', value: expression, cursor: cursor + expression.length + 1}

}

function getMultiplyExpressionLength(str, show = false) {
    console.log(str)
    let length = 0;
    let cursor = 0;

    let next;
    while (str.length > 0) {
        next = getNext(str, cursor);
        if (show) {
            console.log('*next:', next)
        }
        if (next.type === 'sub' || next.type === 'sum') {
            if (show) {
                console.log('break, so length=', length)
            }
            return length;
        }
        length += next.cursor;
        str = str.substr(length);
        cursor = 0;
    }
    if (show) {
        console.log("return length", length)
    }
    return length;
}


function parseExpression(str, cursor) {
    const start = cursor;
    const stack = [];
    stack.push('(');
    while (stack.length > 0) {
        cursor += 1;
        if (str[cursor] === '(') {
            stack.push('(')
        }
        if (str[cursor] === ')') {
            stack.pop();
        }
        if (stack.length > 0 && str[cursor] === undefined) {
            throw 'ExpressionError: Brackets must be paired'
        }
    }
    return {type: 'expression', value: str.substring(start + 1, cursor), cursor: cursor + 1};
}

function parseNumber(str, cursor) {
    let result = ''
    while (/\d/.test(str[cursor])) {
        result += str[cursor];
        cursor++;
    }
    return {type: 'number', value: parseFloat(result), cursor: cursor - 1};
}

module.exports = {
    expressionCalculator
}
