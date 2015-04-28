window.mesotic = function() {

    //initialize or overwrite public mesostomatic API
    var sourceArray;
    var spineArray;
    var resultObject;
    var options;
    var pub = {}; 

    function createSourceArray(sourceText) {

        sourceArray = ['word1', 'word2'];
    }

    function createSpineArray(sourceText, spineWord) {

        return [
            {'spineLetter': 'J', 'index': 22},
            {'spineLetter': 'J', 'index': 22}
        ];        
    }

    function parseLineWords(sourceIndex1, sourceIndex2, spineLetter1, spineLetter2) {
        return {
            'startBookend': 'J',
            'preLineBreak': 'ohn Burbank',
            //the line break of display poem    
            'postLineBreak': 'in the castl',
            'endBookend': 'E'
        };
    }

    function createLines() {
        resultArray = array();
        resultArray[0] = parseLineWords(null, 0);
        for(var i = 0; i< spineArray.length(); i++) {
            resultArray[i] = parseLineWords();
        }
        resultArray[last] = parseLineWords(last, null);
        
        return resultArray;
    }

    function createResultObject() {
        
        
        //takes create line result and sends back nice line based objects         
        resultObject = {
            'lines': [
                {
                    'left': 'some text for ',
                    'spine': 'J',
                    'right': 'some text'
                },
                {
                    'left': 'some more text',
                    'spine': 'o',
                    'right': 'more text'
                },
                {
                    'left': '',
                    'spine': '',
                    'right': ''
                },
                {
                    'left': 'some more text',
                    'spine': 'o',
                    'right': 'more text'
                },
            ]
        };
    }

    function getRandomBoolean() {
        return true;
    }

    function getRandomSplit(index1, index2) {
        return Math.floor((index1 + index2)/2)
    }

    //public parse function
    pub.parse = function(spineWord, sourceText, myOptions) {
        options = myOptions;

        //create source array
        createSourceArray(sourceText);

        //parse for spine word
        var parsingComplete = createSpineArray(spineWord);
    
        //create and return ResultObject
        createResultObject();
        resultObject.parsingComplete = parsingComplete;
        return resultObject;

    };

    //function to return actual text of the poem
    pub.formatText = function(resultObject, formatType) {
        var text = '';
        for(var i = 0; i++; i < 4) {
            text = text + i;
        }    
        return text;
    };

//set the mesostomatic parser to the public api
    return pub;

}();
