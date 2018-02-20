function checkInt(x){

	for (i = 0; i < x.length; i++) {
		var check = isNaN(x.charAt(i));
		if (check){
			return false;
		}
	}
	return parseInt(x);
}

utilities = {
	checkInt: checkInt
}

module.exports = utilities;