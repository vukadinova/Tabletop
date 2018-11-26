var products, allergens, activeAllergens = [];

function init() {
 	loadJSON('products.json', function(responseProducts) {
    	products = responseProducts;
    	loadJSON('allergens.json', function(responseAllergens) {
    		allergens = responseAllergens;

			// add content to table
			var productsTable = document.getElementById("productsTable");
			addTableContent(productsTable);
			
			// sorting
			document.getElementById('sortBy').onchange = changeEventHandlerSort;

			// add allergens to checkbox
			var allergensDiv = document.getElementById('allergens');
			addAllergensContent(allergensDiv);

			// filtering is in the addAllergensContent function
 		});
 	});
}

function loadJSON(filename, callback) {
	var request = new XMLHttpRequest();
	request.overrideMimeType("application/json");
	request.open('GET', filename, true);
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == "200") {
          	callback(JSON.parse(request.responseText));
    	}
    };
    request.send(null);
}

function addTableContent(productsTable) {
	products.forEach(function(product) {
		if(hasAllActiveAllergens(product)) {
			var row = productsTable.insertRow();
			row.height = 50;

			var nameCell = row.insertCell();
			nameCell.setAttribute('class', 'td1');
			
			var imageCell = row.insertCell();
			imageCell.setAttribute('class', 'td2');
			imageCell.width = 50;
			imageCell.height = 50;
			
			var priceCell = row.insertCell();
			priceCell.setAttribute('class', 'td3');
			
			nameCell.innerHTML = product.name;
			priceCell.innerHTML = "£"+product.price;

			var image = document.createElement("IMG");
			image.src = product.image_path;

			if(!product.image_path) {
				image.src = "/images/noimg.png";
			}
			image.onerror = function() {
				image.src = "/images/noimg.png";
			}

			image.style.width = "100%";
			image.style.height = "auto";
		
			imageCell.appendChild(image);
		}
	})
}

function deleteTableContent(productsTable) {
	productsTable.innerHTML = '';
}

function updateTableContent() {
	var productsTable = document.getElementById("productsTable");
	deleteTableContent(productsTable);
	addTableContent(productsTable);
}

function hasAllActiveAllergens(product) {
	var productAllergens = product.allergens.split(",");
	var productActiveAllergens = [];
	activeAllergens.forEach(function (allergen, index) {
		productActiveAllergens[index] = false;
	})
	productAllergens.forEach(function (productAllergen) {
		productActiveAllergens[productAllergen] = true;
	})

	var all = true;
	activeAllergens.forEach(function (allergen, index) {
		if(allergen && !productActiveAllergens[index]) {
			all = false;
		}
	})
	
	return all;
}

function addAllergensContent(allergensDiv) {
	allergens.forEach(function(allergen) {
		var div = document.createElement("DIV");
		
		var checkbox = document.createElement("INPUT");
		checkbox.setAttribute('type', 'checkbox');
		checkbox.setAttribute('id', allergen.id);
		
		var label = document.createElement("LABEL");
		label.setAttribute('for', allergen.id);
		label.innerHTML = allergen.name;
		activeAllergens[allergen.id] = false;

		div.appendChild(checkbox);
		div.appendChild(label);

		allergensDiv.appendChild(div);

		document.getElementById(allergen.id).onchange = changeEventHandlerFilter;
	})
}

function changeEventHandlerSort(event) {
	if(!event.target.value)
		return;

	if(event.target.value === "price-high-to-low") {
		products = products.sort(function(a, b) {
			return b.price - a.price;
		});
		console.log(products);
	}
	if(event.target.value === "price-low-to-high") {
		products = products.sort(function(a, b) {
			return a.price - b.price;
		});
	}
	if(event.target.value === "name") {
		products = products.sort(function(a, b) {
			if(a.name.toLowerCase() === b.name.toLowerCase()) {
				return 0;
			}
			if(a.name.toLowerCase() < b.name.toLowerCase()) {
				return -1;
			}
			return 1;
		});
	}
	if(event.target.value === "order") {
		products = products.sort(function(a, b) {
			return a.order - b.order;
		});
	}
	updateTableContent();
}

function changeEventHandlerFilter(event) {
	activeAllergens[event.target.id] = event.target.checked;
	updateTableContent();
}

init();
