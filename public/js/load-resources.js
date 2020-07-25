function choosePageContent() {
	var splitted_href = window.location.href.split('/');
	var temp = splitted_href[splitted_href.length - 1];

	switch(temp) {
		case '#forecast':
			loadForecast();
			break;
		case '#about':
			loadAbout();
			break;
		case '#':
		default:
			loadHome();
			break;
	}
}


function loadNav() {
	$(function() {
		$("#navbar").load("nav.html");
	});
}

function loadAbout() {
	$(function() {
		$("main").load("about.html .center-content");
	})
}

function loadHome() {
	$(function() {
		$("main").load("home.html .center-content");
	})
}

function loadForecast() {
	$(function() {
		$("main").load("forecast.html .center-content", renderForecastPage);
	});
}