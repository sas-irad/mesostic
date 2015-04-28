(function(context) {

    //initialize or overwrite public mesostomatic API
    var public = context.mesostomatic || {};

    
    //actually do the parsing
    function doParse() {
        return {
            'parsed': true,
            'parsing': [
                {
                    'left': 'some text',
                    'spine': 'J',
                    'right': 'some text'
                },
                {
                    'left': 'some more text',
                    'spine': 'o',
                    'right': 'more text'
                }
            ]
        };
    }

    //public parse function
    public.parse= function(spineWord, text, options) {
        //detail
        return doParse();
    }
    

    //set the mesostomatic parser to the public api
    context.mesostomatic = public;

})(this);
