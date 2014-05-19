test( "Sanity test", function() {
    ok( 1 == "1", "Passed!" );
});

test( "tokenize1", function() {
    ok( tokenize("hello"), "hello" );
});

test( "tokenize2", function() {
    ok( tokenize("print \"hello world\""), "print \"hello world\"");
});

test( "tokenize3", function() {
    ok( tokenize("testvar = 1"), "testvar = 1");
});

test( "tokenize3", function() {
    ok( tokenize("testvar=1"), "testvar=1");
});
