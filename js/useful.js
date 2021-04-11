function range(start, end, step=1) {
    // Returnerer en Array fra start til end med steglengde step.

    // Lag en Array med antall elementer som til slutt skal være i den
    // f.eks. range(4, 9, step=2) => [0, 1, 2] <=> [0, 1, 2].length == ceil((9-4)/2) == ceil(2.5)
    var numberOfElements = Math.ceil((end-start)/step);
    var arr = [...Array(numberOfElements).keys()];

    // Legg til startverdi og multipliser hvert element med step
    // f.eks. [0, 1, 2, 3] => [4 + 0*2, 4 + 1*2, 4 + 2*2] <=> [4, 6, 8]
    return arr.map(t => start+t*step);
}

function sum(iterator) {
    return iterator.reduce((total, t) => total+t);
}

function max(...args) {
	return args.reduce((acc, cur) => acc<cur? cur: acc);
}

function min(...args) {
	return args.reduce((acc, cur) => acc>cur? cur: acc);
}

function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		// Bytt med tilfeldige indekser tidligere i arrayen
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

function random() {
	return Math.random();
}

function randint(a, b) {
	return Math.floor(Math.random()*(b-a)+a);
}

function choice(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}

function rgb() {
	return `rgb(${randint(0, 256)}, ${randint(0, 256)}, ${randint(0, 256)})`;
}

function hsl() {
	return `hsl(${randint(0, 361)}, 100, 50)`;
}


Array.prototype.append = (...args) => this.push(...args);
Array.prototype.insert = (index, ...args) => this.splice(index, 0, ...args);


var random = {
	// I et tappert forsøk på å gjøre det mer python-liknende
	shuffle: shuffle,
	randint: randint,
	random: random,
	choice: choice,
	rgb: rgb,
	hsl: hsl
}

/*
module.exports = {
	random: random,
	range: range,
	sum: sum,
	max: max,
	min: min,
}
*/