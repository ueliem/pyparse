function makeTreeFromTokens(tokens) {
    return { type: "Program", body: makeStatement(tokens, 0) };
}

function makeStatement(tokens, index) {
    if(tokens[index].type !== null) {
        if(python_keywords.indexOf(tokens[index]) != -1) {
            switch (tokens[index]) {
                case "print":
                    return [{
                                "type": "ExpressionStatement",
                                "expression": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "MemberExpression",
                                        "computed": false,
                                        "object": {
                                            "type": "Identifier",
                                            "name": "console"
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "log"
                                        }
                                    },
                                    "arguments": makeStatement(tokens, index+1)
                                }
                            }];
            }
        }
    }
    else {
        switch (tokens[index].type) {
            case tokenTypesEnum.STRING:
                return [{
                            "type": "Literal",
                            "value": tokens[index].value,
                            "raw": tokens[index].value
                        }];
            case tokenTypesEnum.NUMBER:
                return [{
                            "type": "Literal",
                            "value": tokens[index].value,
                            "raw": parseInt(tokens[index].value)//Only does integers so far
                        }];
            case tokenTypesEnum.PLUS:
                return [{
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "BinaryExpression",
                                "operator": "+",
                                "left": makeStatement(token[index-1], index-1),
                                "right": makeStatement(token[index+1], index+1),
                            }
                        }];
            case tokenTypesEnum.MINUS:
                return [{
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "BinaryExpression",
                                "operator": "-",
                                "left": makeStatement(token[index-1], index-1),
                                "right": makeStatement(token[index+1], index+1),
                            }
                        }];
        }
    }
}
