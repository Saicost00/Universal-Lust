var MalJpGain = Game_Actor.prototype.gainJp;
Game_Actor.prototype.gainJp = function(value, classId) {
		MalJpGain.call(this, value, classId);
		var totalJp = this.jp(classId);
		for (var i = 0; i < $dataClasses.length; i++) {
			this.setJp(totalJp, i);
		};
};

var MalJpLose = Game_Actor.prototype.loseJp;
Game_Actor.prototype.loseJp = function(value, classId) {
	MalJpLose.call(this, value, classId);
	var totalJp = this.jp(classId);
	for (var i = 0; i < $dataClasses.length; i++) {
		this.setJp(totalJp, i);
	};
};