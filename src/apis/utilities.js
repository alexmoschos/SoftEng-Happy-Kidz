//checks if given input is integer
function checkInt(x){

	for (var i = 0; i < x.length; i++) {
		var check = isNaN(x.charAt(i));
		if (check){
			return false;
		}
	}
	return parseInt(x);
}

//returns a random string of size len
function makeid(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Utility function to check if membership is valid
function isMembershipValid(membership) {
	if (membership && (membership.expiryDate > Math.floor(Date.now() / 1000)) ) {
			return true;
	} else {
			return false;
	}
}

utilities = {
	checkInt: checkInt,
	makeid: makeid,
	isMembershipValid: isMembershipValid
};

module.exports = utilities;