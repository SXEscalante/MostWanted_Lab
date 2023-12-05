// PRO TIP: To quickly navigate to a function, right click on its name and select "Go to Definition"

function app(people) {
	//debugger;
	displayWelcome();
	runSearchAndMenu(people);
	return exitOrRestart(people);
}

function displayWelcome() {
	alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
	const searchResults = searchPeopleDataSet(people);

	if (searchResults.length > 1) {
		displayPeople('Search Results', searchResults);
	} else if (searchResults.length === 1) {
		const person = searchResults[0];
		mainMenu(person, people);
	} else {
		alert('No one was found in the search.');
	}
}

function searchPeopleDataSet(people) {
	const searchTypeChoice = validatedPrompt(
		'Please enter in what type of search you would like to perform.',
		['id', 'name', 'trait'],
	);

	let results = [];
	switch (searchTypeChoice) {
		case 'id':
			results = searchById(people);
			break;
		case 'name':
			results = searchByName(people);
			break;
		case 'trait':
			//! TODO
			results = searchByTraits(people);
			break;
		default:
			return searchPeopleDataSet(people);
	}

	return results;
}

function searchByTraits(people){
	const searchTraitChoice = validatedPrompt(
		"Please enter the trait you would like to search for", 
		['gender', 'dob', 'height', 'weight', 'eyecolor', 'occupation']
	);
	
	let results = [];
	let trait;
	switch (searchTraitChoice) {
		case 'gender':
			trait = prompt("What gender is the person you are searching for")
			results = people.filter((person) => person.gender === trait)
			break;
		case 'dob':
			trait = prompt("What is the Date of Birth of the person you are searching for")
			results = people.filter((person) => person.dob === trait)
			break;
		case 'height':
			trait = prompt("What height is the person you are searching for")
			results = people.filter((person) => person.height === trait)
			break;
		case 'weight':
			trait = prompt("What weight is the person you are searching for")
			results = people.filter((person) => person.weight === trait)
			break;
		case 'eyecolor':
			trait = prompt("What is the eye color of the person you are searching for")
			results = people.filter((person) => person.eyeColor === trait)
			break;
		case 'occupation':
			trait = prompt("What occupation is the person you are searching for")
			results = people.filter((person) => person.occupation === trait)
			break;
		case 'search':
			break;
	}
	return results;
}

function searchById(people) {
	const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
	const idToSearchForInt = parseInt(idToSearchForString);
	const idFilterResults = people.filter((person) => person.id === idToSearchForInt);
	return idFilterResults;
}

function searchByName(people) {
	const firstNameToSearchFor = prompt(
		'Please enter the the first name of the person you are searching for.',
	);
	const lastNameToSearchFor = prompt(
		'Please enter the the last name of the person you are searching for.',
	);
	const fullNameSearchResults = people.filter(
		(person) =>
			person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() &&
			person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase(),
	);
	return fullNameSearchResults;
}

function mainMenu(person, people) {
	const mainMenuUserActionChoice = validatedPrompt(
		`Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
		['info', 'family', 'descendants', 'quit'],
	);

	switch (mainMenuUserActionChoice) {
		case 'info':
			//! TODO
			displayPersonInfo(person, people);
			break;
		case 'family':
			//! TODO
			let personFamily = findPersonFamily(person, people);
			displayPeople('Family', personFamily);
			break;
		case 'descendants':
			//! TODO
			// let personDescendants = findPersonDescendants(person, people);
			// displayPeople('Descendants', personDescendants);
			break;
		case 'quit':
			return;
		default:
			alert('Invalid input. Please try again.');
	}

	return mainMenu(person, people);
}

function findPersonFamily(person, people){
	let family = [];
	parents = relativesSearch(person.parents, people);
	for(parent of parents){
		family.push(parent)
	}
	let spouseId = [person.currentSpouse]
	let siblings = relativesSearch(spouseId, people)
	for(sibling of siblings){
		family.push(sibling)
	}
	let siblingsIds = findSiblings(person, people);
	siblings = relativesSearch(siblingsIds, people);
	for(sibling of siblings){
		family.push(sibling)
	}
	return family;
}

function relativesSearch(relatives, people){
	let relativesProfiles = people.filter((relative) => relatives.includes(relative.id));
	return relativesProfiles;
}

function findSiblings(person, people){
	let parentsIds = person.parents;
	let siblings = people.filter(function(sibling){
		if(person.parents === sibling.parents){
			return true;
		}
	});
	let siblingsIds = siblings.map((sibling) => sibling.id);
	return siblingsIds;
}

function getFullNames(people){
	let names = []
	for(person of people){
		if(person != undefined){
			names.push(`${person.firstName} ${person.lastName}`)
		}
	}
	return names;
}

function displayPersonInfo(person, people){
	parents = relativesSearch(person.parents, people)
	let parentsNames = getFullNames(parents)
	let spouseId = [person.currentSpouse]
	spouse = relativesSearch(spouseId, people)
	let spouseName = getFullNames(spouse)
	alert(`Name: ${person.firstName} ${person.lastName}\nGender: ${person.gender}\nDob: ${person.dob}\nHeight: ${person.height}\nWeight: ${person.weight}\nEye color: ${person.eyeColor}\nOccupation: ${person.occupation}\nParents: ${parentsNames}\nCurrent spouse: ${spouseName}`)
}

function displayPeople(displayTitle, peopleToDisplay) {
	const formatedPeopleDisplayText = peopleToDisplay
		.map(function(person){
			if(person != null || undefined){
				return `${person.firstName} ${person.lastName}`
			}
			
		})
		.join('\n');
	alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
	acceptableAnswers = acceptableAnswers.map((aa) => aa.toLowerCase());

	const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers
		.map((aa) => `\n-> ${aa}`)
		.join('')}`;

	const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

	if (acceptableAnswers.includes(userResponse)) {
		return userResponse;
	} else {
		alert(
			`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers
				.map((aa) => `\n-> ${aa}`)
				.join('')} \n\nPlease try again.`,
		);
		return validatedPrompt(message, acceptableAnswers);
	}
}

function exitOrRestart(people) {
	const userExitOrRestartChoice = validatedPrompt('Would you like to exit or restart?', [
		'exit',
		'restart',
	]);

	switch (userExitOrRestartChoice) {
		case 'exit':
			return;
		case 'restart':
			return app(people);
		default:
			alert('Invalid input. Please try again.');
			return exitOrRestart(people);
	}
}
