//TODO: Add tokenize strings based on multiple quotes.

var python_keywords = ['and', 'as', 'assert', 'break', 'class', 'continue',
    'def', 'del', 'elif', 'else', 'except', 'exec', 'finally', 'for',
    'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'not',
    'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 'yield'];
var text_characters;
var special_characters = ["{", "}", "(", ")", ".", ",", ":", ";", "@", "`"];
var followed_by_equals = ["=", "!", "%", "*", "/", "+", "-", "<", ">"];
var digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

statesEnum = Object.freeze({
    STARTSTATE : 0,
    EQUALSSTATE : 1,
    STRINGSTATE : 2,
    LINECOMMSTATE : 3,
    INTSTATE : 4
});

//This function will split a string of python code into tokens
function tokenize(code) {
    var current_state;
    var tokens = [];
    var current_token = "";
    var col_start = 0;
    var row_start = 0;
    var col_end = 0;
    var row_end = 0;
    var token_type;
    current_state = statesEnum.STARTSTATE;
    var start_of_token, end_of_token = 0;
    var indent_depth_current;
    var indent_depth_previous;

    function pushToken(token) {
        if(token !== "") {
            tokens.push(new Token(token, recognize_token_type(token), row_start, col_start, row_end, col_end));
            current_token = "";
            col_start = 0;
            token_start = 0;
            col_end = 0;
            token_end = 0;
        }
    }
    function pushTokenWithType(token, type) {
        if(token !== "") {
            tokens.push(new Token(token, type, row_start, col_start, row_end, col_end));
            current_token = "";
            col_start = 0;
            token_start = 0;
            col_end = 0;
            token_end = 0;
        }
    }



    //Iterate through the inputted code character by character
    for (var i = 0, len = code.length; i < len; i++) {
        if (current_state == statesEnum.STARTSTATE) {
            if (code[i] == "\t") {
                current_token += code[i];
                pushToken(current_token);
                indent_depth_current++;
            }
            else {//Something other than a tab or whitespace beginning a line
                current_token += code[i];
                current_state = statesEnum.MIDSTATE;
            }
        }
        else if (current_state == statesEnum.MIDSTATE) {
            if (special_characters.indexOf(code[i]) == -1) {
                if (code[i] == " ") {
                    pushToken(current_token);
                }
                else if (code[i] == "\"") {
                    pushToken(current_token);
                    //current_token += code[i];
                    current_state = statesEnum.STRINGSTATE;
                }
                else if (code[i] == "\t") {
                    pushToken(current_token);
                    current_token += code[i];
                    pushToken(current_token);
                }
                else if (code[i] == "\n") {//TODO: Allow for statements to wrap multiple lines
                    pushToken(current_token);
                    current_token += code[i];
                    pushToken(current_token);
                    current_state = statesEnum.STARTSTATE;
                }
                else if (followed_by_equals.indexOf(code[i]) != -1) {
                    pushToken(current_token);
                    current_token += code[i];
                    current_state = statesEnum.EQUALSSTATE;
                }
                else if (digits.indexOf(code[i]) != -1) {
                    console.log("DIGIT");
                    pushToken(current_token);
                    current_token += code[i];
                    current_state = statesEnum.INTSTATE;
                }
                else if (code[i] == "#") {
                    pushToken(current_token);
                    current_state = statesEnum.LINECOMMSTATE;
                }
                else {
                    current_token += code[i];
                }
            }
            else {
                pushToken(current_token);
                current_token += code[i];
                pushToken(current_token);
            }
        }
        else if (current_state == statesEnum.EQUALSSTATE) {
            if(followed_by_equals.indexOf(code[i]) != -1) {
                if(code[i] == "=") {
                    current_token += code[i];
                    pushToken(current_token);
                    current_state = statesEnum.MIDSTATE;
                }
                else if(current_token == "-" && digits.indexOf(code[i]) != -1) {
                    current_token += code[i];
                    current_state = statesEnum.INTSTATE;
                }
                else {
                    current_token += code[i];
                    //pushToken(current_token);
                    //current_state = statesEnum.MIDSTATE;
                }
            }
            else {
                pushToken(current_token);
                if (code[i] != " ") {
                    if(digits.indexOf(code[i]) != -1) {
                        console.log("HAPPENING");
                        current_token += code[i];
                        current_state = statesEnum.INTSTATE;
                    }
                    else if(code[i] == "\"") {
                        current_state = statesEnum.STRINGSTATE;
                    }
                }
                else {
                    current_state = statesEnum.MIDSTATE;
                }
            }
        }
        else if (current_state == statesEnum.STRINGSTATE) {
            //if (special_characters.indexOf(code[i]) == -1) {
                if (code[i] == "\"") {
                    //current_token += code[i];
                    pushTokenWithType(current_token, tokenTypesEnum.STRING);
                    //pushToken(current_token);
                    current_state = statesEnum.MIDSTATE;
                }
                else {
                    current_token += code[i];
                }
            //}
        }
        else if (current_state == statesEnum.INTSTATE) {
            if (digits.indexOf(code[i]) == -1) {
                pushTokenWithType(current_token, tokenTypesEnum.NUMBER);
                if(code[i] == "\n") {
                    pushTokenWithType(code[i], tokenTypesEnum.NEWLINE);
                }
                current_state = statesEnum.MIDSTATE;
            }
            else {
                current_token += code[i];
            }
        }
        else if (current_state == statesEnum.LINECOMMSTATE) {
            if(code[i] == "\n") {
                pushTokenWithType(code[i], tokenTypesEnum.NEWLINE);
                current_state = statesEnum.MIDSTATE;
            }
            else {
                //Do nothing, its a comment.
            }
        }
    }
    //Push the final token
    switch (current_state) {
        case statesEnum.STARTSTATE:
            //Probably should not happen
            break;
        case statesEnum.EQUALSSTATE:
            pushToken(current_token);
            break;
        case statesEnum.STRINGSTATE:
            pushTokenWithType(current_token, tokenTypesEnum.STRING);
            break;
        case statesEnum.LINECOMMSTATE:
            //Shouldn't need anything
            break;
        case statesEnum.INTSTATE:
            pushTokenWithType(current_token, tokenTypesEnum.NUMBER);
            break;
        default:
            pushToken(current_token);
            break;
    }
    //pushToken(current_token);

    console.log("DONE");
    return tokens;
}

function recognize_token_type(token) {
    switch (token) {
        //token.ENDMARKER
        //token.NAME
        //token.NUMBER
        //token.STRING
        case "\n":
            return tokenTypesEnum.NEWLINE;
        case "\t":
            return tokenTypesEnum.INDENT;
        //token.DEDENT¶
        case "(":
            return tokenTypesEnum.LPAR;
        case ")":
            return tokenTypesEnum.RPAR;
        case "[":
            return tokenTypesEnum.LSQB;
        case "]":
            return tokenTypesEnum.RSQB;
        case ":":
            return tokenTypesEnum.COLON;
        case ",":
            return tokenTypesEnum.COMMA;
        case ";":
            return tokenTypesEnum.SEMI;
        case "+":
            return tokenTypesEnum.PLUS;
        case "-":
            return tokenTypesEnum.MINUS;
        case "*":
            return tokenTypesEnum.STAR;
        case "|":
            return tokenTypesEnum.VBAR;
        case "&":
            return tokenTypesEnum.AMPER;
        case "<":
            return tokenTypesEnum.LESS;
        case ">":
            return tokenTypesEnum.GREATER;
        case "=":
            return tokenTypesEnum.EQUAL;
        case ".":
            return tokenTypesEnum.DOT;
        case "%":
            return tokenTypesEnum.PERCENT;
        case "`":
            return tokenTypesEnum.BACKQUOTE;
        case "{":
            return tokenTypesEnum.LBRACE;
        case "}":
            return tokenTypesEnum.RBRACE;
        case "==":
            return tokenTypesEnum.EQEQUAL;
        case "!=":
            return tokenTypesEnum.NOTEQUAL;
        case "<=":
            return tokenTypesEnum.LESSEQUAL;
        case ">=":
            return tokenTypesEnum.GREATEREQUAL;
        case "~":
            return tokenTypesEnum.TILDE;
        case "^":
            return tokenTypesEnum.CIRCUMFLEX;
        case "<<":
            return tokenTypesEnum.LEFTSHIFT;
        case ">>":
            return tokenTypesEnum.RIGHTSHIFT;
        case "**":
            return tokenTypesEnum.DOUBLESTAR;
        case "+=":
            return tokenTypesEnum.PLUSEQUAL;
        case "-=":
            return tokenTypesEnum.MINEQUAL;
        case "*=":
            return tokenTypesEnum.STAREQUAL;
        case "/=":
            return tokenTypesEnum.SLASHEQUAL;
        case "%=":
            return tokenTypesEnum.PERCENTEQUAL;
        case "&=":
            return tokenTypesEnum.AMPEREQUAL;
        case "|=":
            return tokenTypesEnum.VBAREQUAL;
        case "^=":
            return tokenTypesEnum.CIRCUMFLEXEQUAL;
        case "<<=":
            return tokenTypesEnum.LEFTSHIFTEQUAL;
        case ">>=":
            return tokenTypesEnum.RIGHTSHIFTEQUAL;
        case "**=":
            return tokenTypesEnum.DOUBLESTAREQUAL;
        case "//":
            return tokenTypesEnum.DOUBLESLASH;
        case "//=":
            return tokenTypesEnum.DOUBLESLASHEQUAL;

        //token.AT
        //token.OP
        //token.ERRORTOKEN
        //token.N_TOKENS
        //token.NT_OFFSET
        default:
            if (python_keywords.indexOf(token) != -1) {
                //IS A KEYWORD
            }
            else {//Either a name, or malformed
                return tokenTypesEnum.NAME;//Assume name, for now
            }
            return null;
    }
}
