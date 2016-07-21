$(function() {
	$( window ).resize(function() {
		$('#pic').css('height', $(document).height());
		$('#pic').css('width', $(document).width());
	});

	$.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', (j) => {

		const arr = j.monthlyVariance;

		const margin = { top: 120, bottom: 70, left: 100, right: 60}

		const width = 1030;
		const height = 600;

		const innerHeight = height - margin.top - margin.bottom;
		const innerWidth = width - margin.left - margin.right;

		const barHeight = innerHeight/12; // one for each month in the year
			// don't really need a y scale for this data set


		const svg = d3.select('body').append('svg')
			.attr('width', width)
			.attr('height', height);

		const innerBox = svg.append('g')
			.attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')');

		const xScale = d3.scaleLinear()
			.domain(d3.extent(arr, function(d) { return d.year }))
			.range([0, innerWidth]);
		const xAxis = d3.axisBottom(xScale).ticks(15)
			.tickFormat(function(d) {
				return d.toString().replace(/\D/g, '');
			});

		const bars = innerBox.selectAll('rect').data(arr);
		var timeout = '';

		bars.enter().append('rect')
			.attr('transform', function(d) { return 'translate(' + xScale(d.year) + ' ' + (d.month - 1) * barHeight  + ')'})
			.attr('height', barHeight)
			.attr('width', innerWidth/((arr.length + 3)/12)) // The data is missing the last 3 months of 2015.
			.attr('class', function(d) {
				let temps = [2.7, 3.9, 5, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7];
				let i = 0;
				for (i; i < temps.length; i++) {
					if (temps[i] > (8.66 + d.variance))
						break;
				}
				return 't' + i;
			}).on('mouseover', function(d) {
				$('#box').html(months[d.month - 1] + ' ' + d.year + '<br>' +  (8.66 + d.variance).toFixed(3) + '°C');
				$('#box').show();
				$('#box').css('top', d3.event.pageY + 10).css('left', d3.event.pageX + 10);
			}).on('mouseleave', function(d) {
				$('#box').hide();
			});

		innerBox.append('g')
			.call(xAxis)
			.attr('transform', 'translate(0 ' + innerHeight + ')');
		innerBox.append('text')
			.attr('class', 'label')
			.attr('transform', 'translate(' + (innerWidth/2 - 24) + ' ' + (innerHeight + 40) + ')')
			.text('Year');


		let months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		months.forEach(function(mon, i) {
			innerBox.append('text')
				.attr('class','label')
				.attr('text-anchor', 'end')
				.attr('transform', 'translate(' + (-5) + ' ' + ((i * barHeight) + barHeight/2 + 4) + ')')
				.text(mon);
		});

		innerBox.append('text')
			.attr('class', 'title')
			.attr('transform', 'translate(50 -50)')
			.text('Global Land-Surface Temperature from 1753 to 2015');

		let colours = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
		let temps = [0, 2.7,3.9,5,6.1,7.2,8.3,9.4,10.5,11.6,12.7];
		colours = colours.reverse();
		temps = temps.reverse();

		colours.forEach((colour, i) => {
			innerBox.append('rect')
				.attr('transform', 'translate(' + ((innerWidth/2 +130) - (i*30)) + '-20)')
				.style('fill', colour)
				.attr('width', 31)
				.attr('height', 10);

			innerBox.append('text')
				.attr('transform', 'translate(' + ((innerWidth/2 +136) - (i*30)) + '-27)')
				.style('font-size', '10px')
				.text(temps[i]);

		});
	});
});
