window.mesostic = function() {

    //initialize or overwrite public mesostomatic API
    var sourceArray;
    var spineArray;
    var resultObject;
    var options;
    var pub = {}; 

    function createSourceArray(sourceText) {
        sourceArray = sourceText.split(" ");
    }

    // Creates a spineArray and stores it in private variable
    // Returns true if created, false if not
    function createSpineArray(sourceText, spineWord) {
        createSourceArray(sourceText);

        var spine = spineWord.split(""),
            spineLength = spine.length(),
            currentSpineArray = new Array(), // Working Spine word
            resultArray, // Only full spine words
            rule = options.rule || '50',
            loops = options.spineLoops || 1,
            i = 0, // spine index
            j = 0; // source index
        
        while (i < spineLength * loops) {
            var currentSpineLetter = spine[i % spineLength],
                nextSpineLetter = spine[(i+1) % spineLength],
                prevSpineLetter = spine[(i-1) % spineLength],
                currentWord = sourceArray[j % sourceArray.length],
                letterIndex = currentWord.indexOf(currentSpineLetter) ;

            if (letterIndex > -1) { // Spine Letter is in there
                var success = {'spineLetter': currentSpineLetter, 'index': j,
                    'pre': letterIndex, 'post': currentWord.length - (letterIndex + 1)}
                if (rule === 'basic') {
                    currentSpineArray[] = success;
                }
                else if (rule === '50') {
                    if (currentWord.indexOf(nextSpineLetter === -1)) {
                        currentSpineArray[] = success;
                    }
                }
                else if (rule === '100') {
                    if (currentWord.indexOf(nextSpineLetter) === -1 && 
                        currentWord.indexOf(prevSpineLetter) === -1) {
                            currentSpineArray[] = success;
                    }
                }
            }

            i++; // Easier mod math if we increment first
            if (i % spineLetter === 0) {
                resultArray = resultArray.concat([currentSpineArray]);
                currentSpineArray = new Array();
            }
            j++;
        }
        spineArray = resultArray;
        if (resultArray.length > 0) {
            return true;
        } else {
            return false;
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
        var lines = resultObject.lines;
        for(var i = 0; i < lines.length; i++) {
            text = text + pad(lines[i]['left'], 45, ' ', STR_PAD_LEFT);
            text = text + lines[i]['spine'];
            text = text + pad(lines[i]['right'], 45, ' ', STR_PAD_LEFT);
        }    
        return text;
    };

//set the mesostomatic parser to the public api
    return pub;

}();
