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

    function parseLineWords( spineArraySlot1, spineArraySlot2) {


	if (spineArraySlot1 == null)  // first letter in spine array
        {
	    // no splitbreak between null letter and first letter

	    startBookend = '';
	    preLineBreak = '';
	    // no line break
	    
	    endBookend = spineArray[spineArraySlot2].spineLetter;
	    postLineBreak = sourceArray[ spineArray[spineArraySlot2].index ];  // need to chop here based on pre/post

	    count = 0;
	    count = count + spineArray[spineArraySlot2].pre;

	    // start the walk back to null
	    for ($i = spineArray[spineArraySlot2].index-1; $i >= 0; $i--) {

		if ( sourceArray[i].length + count <= 45) {

		    // need to check for 0/50/100 rule
		    
		    if getRandomBoolean() {
			    postLineBreak = sourceArray[i] + postLineBreak;
			}


	    }


	}
	else if (spineArraySlot2 == null)  // last letter in spine array
	{
	    // no splitbreak between last letter and null letter



	}
	else  // everything in between
	{
	    // get the random splitbreak between slots in the spine array
	    var split = getRandomSplit( spineArray[spineArraySlot1].index, spineArray[spineArraySlot2].index );
	    

	}


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

	//special case - first element of spineArray
	resultArray[0] = parseLineWords( null, 0 );

	// the "middle" cases
        for(var i = 0; i < spineArray.length-1; i++) {

            resultArray[i+1] = parseLineWords( i, i+1 );
        }

	// special case - last element of spineArray, null
	resultArray[spineArray.length] = parseLineWords( spineArray.length-1, null);
        
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
