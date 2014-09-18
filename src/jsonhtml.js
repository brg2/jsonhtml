var jsonhtml = {
	getHTML: function(arrJSON, tabsize) {
		if(typeof arrJSON != 'object') arrJSON = eval('(' + arrJSON + ')');
		if(typeof tabsize == 'undefined') tabsize = 1;
		var nextel;
		var strEl = "";
		
		//This converts a JSON object to a string of HTML attributes
		var obj2Attribs = function (obj) {
			var val;
			var arrAttribs = [];
			for(var key in obj) {
				val = obj[key];
				if(typeof val == 'object') {
					if(key.toLowerCase() == 'style') val = this.obj2Style(val);
					else val = this.obj2Attribs(val);
				} else if(typeof val == 'string') {
					val = val.replace(/"/ig, '\\"');
				}
				arrAttribs.push(key + '="' + val + '"');
			}
			val = arrAttribs.join(" ");
			if(val != '') val = ' ' + val;
			return val;
		};
		
		//This converts a JSON object to a style string
		var obj2Style = function (obj) {
			var val;
			var arrAttribs = [];
			for(var key in obj) {
				val = obj[key];
				arrAttribs.push(key + ':' + val);
			}
			return arrAttribs.join("; ");
		};
		
		//This assumes arrJSON is a list of JSONHTML elements 
		// (i.e. [['element-name',{id:123},[['child-element-name']]]])
		for(var i = 0; i < arrJSON.length; i++) {
			//Get the next element in the list
			nextel = arrJSON[i];
			//Add tabs to the beginning of the line
			strEl += Array(tabsize).join("\t");
			//The element could be a string, number, etc
			if(typeof nextel != 'object') {
				strEl += nextel + "\n";
				continue;
			}
			//Otherwise, create a new tag
			strEl += '<' + nextel[0];
			//Add the attributes
			if(nextel[1]) strEl += obj2Attribs(nextel[1]);
			//End the tag
			strEl += ">\n";
			//Append the children elements
			if(nextel[2]) strEl += this.getHTML(nextel[2], tabsize + 1);
			//Close the tag
			strEl += Array(tabsize).join("\t") + '</' + nextel[0] + ">\n";
		}
		
		return strEl;
	}
};