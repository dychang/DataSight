var reader = new FileReader();

reader.onload = function(e) {
  var text = reader.result;
  console.log(text);
}

function printFile(){
	var selectedFile = $('#input').get(0).files[0];
	console.log(selectedFile);

	reader.readAsText(selectedFile);
}