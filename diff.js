window.onload = function () {

	var left = document.getElementById('left');
	var right = document.getElementById('right');
	var remove = document.getElementById('remove');
	var tableBody = document.getElementById('result');
	var table = document.getElementsByTagName('table')[0];

	var outputRow = function (x, y, content) {
		var tr = document.createElement('tr');
		if (arguments.length > 3) {
			tr.className = arguments[3] ? 'plus' : 'minus';
		}
		var text = arguments.length > 3 ? getContent(content, arguments[3]) : getContent(content);
		
		tr.appendChild(getCell(true, x));
		tr.appendChild(getCell(true, y));
		tr.appendChild(getCell(false, text));
		
		var tableBody = document.getElementById('result');
		tableBody.appendChild(tr);
	};

	var getContent = function (content) {
		var indicator = arguments.length > 1 ? (arguments[1] ? '+' : '-') : ' ';
		return indicator + ' ' + content;
	};

	var getCell = function (isLine, text) {
		var td = document.createElement('td');
		td.className = isLine ? 'line-number' : 'content';
		td.appendChild(document.createTextNode(text));
		return td;
	};

	var outputDiff = function (diff, x, y) {
		if (x > 0 && y > 0 && diff.left[y-1] === diff.right[x-1]) {
			outputDiff(diff, x-1, y-1);
			outputRow(y, x, diff.left[y-1]);
		} else {
			if (x > 0 && (y === 0 || diff.matrix[y][x-1] >= diff.matrix[y-1][x])) {
				outputDiff(diff, x-1, y);
				outputRow('', x, diff.right[x-1], true);
			} else {
				if (y > 0 && (x === 0 || diff.matrix[y][x-1] < diff.matrix[y-1][x])) {
					outputDiff(diff, x, y-1);
					outputRow(y, '', diff.left[y-1], false);
				}
			}
		}
	};

	var getMatrix = function (left, right) {
		var matrix = new Array(left.length + 1);
		for (var y = 0; y < matrix.length; y++){
			matrix[y] = new Array(right.length + 1);
			for (var x = 0; x < matrix[y].length; x++){
				matrix[y][x] = (x > 0 && y > 0) ? (left[y-1] === right[x-1] ? 1 + matrix[y-1][x-1] : Math.max(matrix[y-1][x], matrix[y][x-1])) : 0;
			}
		}
		
		return matrix;
	};

	var getDiff = function (left, right, removeSpace) {
		var diff = new Object();
		diff.left = getDataArray(left, removeSpace);
		diff.right = getDataArray(right, removeSpace);
		diff.matrix = getMatrix(diff.left, diff.right);
		return diff;
	};
	
	var initResults = function (body) {
		while (body.hasChildNodes()) {
			body.removeChild(body.lastChild);
		}
	};
	
	var getDataArray = function (object, removeSpace) {
		var value = removeSpace ? object.value.trim() : object.value;
		var array = value.length > 0 ? value.split('\n') : new Array();
		if (removeSpace) {
			for (var count = 0; count < array.length; count++) {
				array[count] = array[count].trim();
				if (array[count].length === 0) {         
					array.splice(count, 1);
					count--;
				}
			}
		}
		return array;
	};

	document.getElementById('compare').onclick = function () {
		initResults(tableBody);
		var diff = getDiff(left, right, remove.checked);
		if (diff.right.length > 0 || diff.left.length > 0) {
			outputDiff(diff, diff.right.length, diff.left.length);
			table.className = 'show';
		} else {
			table.className = 'hide';
		}
	};
};
