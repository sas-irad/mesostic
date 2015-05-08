/**
 * Unit tests for mesostic function
 */


QUnit.test('Startup Test', function(assert) {
    assert.ok(1 == "1", "QUnit Started Up");
});

QUnit.test( "createSourceArray", function( assert ) {
    var testFunc = mesostic._createSourceArray;
    var sourceText;
    var sourceArray;
    var expectedResult = ['Here', 'is', 'the', 'source', 'text'];
    var options = {
        stripPunctuation: true,
    };
    
    //test vanilla example
    sourceText = 'Here is the source text';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'test vanilla')

    //test some double spaces
    sourceText = ' Here   is     the source  text ';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'ignore double spaces');
    
    //test some line breaks
    sourceText = 'Here\nis the \n text\n\nsource\n';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'ignore line breaks');
    
    //test some tabs
    sourceText = '\tHere\tis the \t text\n\t\nsource\n';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'ignore tabs');
    
    //test some punctuation
    sourceText = 'Here! is. the?  text "source"';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'strip punctuation');

    //Try leaving in an apostrophe
    expectedResult = ['Here', 'is', 'Bob\'s', 'text'];
    sourceText = 'Here is Bob\'s text!';
    sourceArray= testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'leave an apostrophe');

    //try leaving in punctuation
    expectedResult = ['Here!', 'is,', 'Bob\'s,', '!text'];
    sourceText = 'Here! is, Bob\'s, !text'];
    sourceArray= testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'leave punctuation');
});




QUnit.test( "hello test2", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
