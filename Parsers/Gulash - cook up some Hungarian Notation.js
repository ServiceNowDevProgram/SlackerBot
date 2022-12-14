/*
activation_example:!gulash
regex:^(!gulash|!gu)
flags:gi
*/
var Gulash = Class.create();
Gulash.prototype = {
    initialize: function(grChat) {
        this._init(grChat);
    },
    // !gulash var gr incident
    // !gu var gr incident

    parse: function() {
        return this._parse();
    },

    // PRIVATE FUNCTIONS
    _init: function(grChat) {
        this.grChat = grChat;
        var regex = /^(!gulash|!gu)/;
        this.objChat = {
            'channel': grChat.getValue('channel') || '',
            'text': grChat.getValue('text').replace(regex, '').trim() || '',
            'thread_ts': grChat.getValue('thread_ts') || '',
            'ts': grChat.getValue('ts') || '',
            'user': grChat.getValue('user') || '',
        };
    },
    _getCamelCase: function(strDisplayName) {
        strDisplayName = strDisplayName || '';
        strDisplayName = strDisplayName.toLowerCase();
        var arrNames = strDisplayName.split(' ');
        for (var iName = 0; iName < arrNames.length; iName++) {
            var strName = arrNames[iName];
            arrNames[iName] = strName.charAt(0).toUpperCase() + strName.slice(1);
        }
        return arrNames.join('');
    },
    _getVariableName: function() {
        var arrArguments = this.arrArguments || [];
        var strTypeVariable = arrArguments[1] || '';
        var str = '';
        switch (strTypeVariable.toLowerCase()) {
            case 'gr':
            case 'gliderecord':
            case 'glide record':
                str = '`' + this._getVariableTable() + ' = new GlideRecord(\'' + arrArguments[2] + '\');`';
                return str;
            case 'arr':
            case 'array':
            case 'list':
                var arr = [];
                str = '`' + this._getVariableArray() + ' = [];`';
                return str;
            case 'str':
            case 'string':
            case 'text':
            case 'word':
            case 'words':
                str = '`' + this._getVariableString() + ' = \'\';`';
                return str;
            case 'num':
            case 'number':
            case 'integer':
            case 'int':
            case 'decimal':
                str = '`' + this._getVariableNumber() + ' = \'\';`';
                return str;
            case 'id':
            case 'sys id':
            case 'sys_id':
                str = '`' + this._getVariableIdName() + ' = \'\';`';
                return str;
            default:
                return '`Invalid inputs. Do not be afraid to try {} , we will catch {} you.`';
        }
    },
    _getVariableArray: function() {
        var arrArguments = this.arrArguments || [];
        var strName = this._getWordsFromArguments(2);
        return 'var arr' + this._getCamelCase(strName);
    },
    _getVariableId: function() {
        var arrArguments = this.arrArguments || [];
        var strName = this._getWordsFromArguments(2);
        return 'var id' + this._getCamelCase(strName);
    },
    _getVariableNumber: function() {
        var arrArguments = this.arrArguments || [];
        var strName = this._getWordsFromArguments(2);
        return 'var num' + this._getCamelCase(strName);
    },
    _getVariableString: function() {
        var arrArguments = this.arrArguments || [];
        var strName = this._getWordsFromArguments(2);
        return 'var str' + this._getCamelCase(strName);
    },
    _getVariableTable: function() {
        var arrArguments = this.arrArguments || [];
        var strTableName = arrArguments[2] || ''; // incident, sn_compliance_control, etc
        var grTableName = new GlideRecord(strTableName);
        if (grTableName.isValid())
            strTableName = grTableName.getClassDisplayValue();
        return 'var gr' + this._getCamelCase(strTableName);
    },
    _getWordsFromArguments: function(numStart /* optional */ ) {
        var arrArguments = this.arrArguments || [];
        numStart = numStart || 2;
        var strName = '';
        for (var iArg = numStart; iArg < arrArguments.length; iArg++) {
            strName += ' ' + arrArguments[iArg];
        }
        return strName;
    },
    _parse: function() {
        var strMessage = this.objChat.text; // var gr sn_compliance_control
        this.arrArguments = strMessage.split(' ');
        var strTypeObject = this.arrArguments[0] || '';

        switch (strTypeObject) {
            case 'fun':
                return '`Functions are fun.`';
            case 'function':
                return '`Function functionality to follow.`';
            case 'let':
            case 'const':
                return '`You need to upgrade to Tokyo and enable ES2021 for your Scoped Application if you want to use ES6+`';
            case 'var':
            case 'variable':
                return this._getVariableName();
            default:
                return ':stew: Welcome to Gulash :stew:\nHere you can cook up some Hungarian Notation for ServiceNow JavaScript with a few simple ingredients :thumbsup:\nUse: `!gu [var|function] [gr|arr|str] [tablename|list of words to describe the variable or function]` \nSuch as: \n`!gu var gr incident` will return \n`var grIncident = new GlideRecord(\'incident\'); // TODO: only works well, when table exists.` \nThanks for using :stew: Gulash, to cook up your variable names. Standardised practices such as strong naming conventions, especially in loosely typed languages like JavaScript, can help make for more maintainable code.';
        }

    },

    type: 'Gulash'
};

var strResponse = new x_snc_slackerbot.Gulash(current).parse() || '';
try{
    new x_snc_slackerbot.Slacker().send_chat( current, strResponse, true );
}
catch( e ){
    gs.error( "An error occured when SlackerBot tried to send a response back to Slack.\nError: " + e.name + ": " + e.message );
}
