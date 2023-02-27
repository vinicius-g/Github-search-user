const initialScreen = document.getElementById("initial-screen");
const message = document.getElementById("message");
const initialLoad = document.getElementById("initial-load");
const repoLoad = document.getElementById("repo-load");
const techLoad = document.getElementById("tech-load");

const userInfo = document.getElementById("user-info");
const userData = document.getElementById("user-data");
const userComplement = document.getElementById("user-complement");
const userTech = document.getElementById("user-tech");

const userActivity = document.getElementById("user-activity");
const userRepos = document.getElementById("user-repos");

const searchbar = document.getElementById("searchbar");
const searchbarButton = document.getElementById("search-button");

const showRepos = document.getElementById("show-repos");
const resultsNumber = document.getElementById("results-number");

const token = "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";
const headers = new Headers();
headers.append("Authorization", "Bearer " + token);

class User {
	constructor(mainContainer) {
		this.mainContainer = mainContainer;
	}

	async fetchData(user) {
		this.fetchLoad();
		this.initFetch(searchbarButton);

		try {
			const response = await fetch(`https://api.github.com/users/${user}`, { headers });

			this.#handleErrorsUser(response, user);

			const res = await response.json();

			return res;
		} catch (err) {
			this.finishFetch(searchbarButton);
			this.showErrorPage(err.message);
			return false;
		}
	}

	#handleErrorsUser(response, user) {
		if (!response.ok) {
			throw new Error(`Usuário ${user} não encontrado`);
		}
	}

	makePage(res) {
		this.checkData(res.avatar_url, "img", this.mainContainer, "element-image");

		this.checkData(res.name, "h1", this.mainContainer, "element");

		this.checkData(res.bio, "p", this.mainContainer, "element");
	}

	#showPageLoad() {
		initialScreen.classList.remove("hide");
		message.classList.add("hide");
		initialLoad.classList.remove("hide");

		userInfo.classList.add("hide");
		userActivity.classList.add("hide");
	}

	#resetResults() {
		userData.innerHTML = "";
		userComplement.innerHTML = "";
		userTech.innerHTML = "";
		userRepos.innerHTML = "";
	}

	initFetch(button) {
		this.isFetching = true;
		button.classList.add("disabled");
	}

	fetchLoad() {
		this.#showPageLoad();
		this.#resetResults();
	}

	finishFetch(button) {
		this.isFetching = false;
		button.classList.remove("disabled");
	}

	showErrorPage(errorMessage) {
		initialScreen.classList.remove("hide");
		message.classList.remove("hide");
		initialLoad.classList.add("hide");

		userInfo.classList.add("hide");
		userActivity.classList.add("hide");
		message.innerText = errorMessage;
	}

	checkData(data, element, fatherElement, type, options = null) {
		if (data !== undefined && data !== null && data !== "") {
			switch (type) {
				case "element":
					{
						this.constructElement(data, element, fatherElement);
					}
					break;

				case "element-image":
					{
						this.constructElementImage(data, element, fatherElement);
					}
					break;

				case "element-icon":
					{
						this.constructElementIcon(data, element, fatherElement, options);
					}
					break;

				case "element-icon-link":
					{
						this.constructElementIconLink(data, element, fatherElement, options);
					}
					break;
			}
		}
	}

	createElement(element) {
		let createdElement = document.createElement(element);

		return createdElement;
	}

	addAttribute(attributeName, attributeValue, element) {
		element.setAttribute(attributeName, attributeValue);
	}

	appendData(element, data) {
		element.append(data);
	}

	appendElement(fatherElement, childElement) {
		fatherElement.appendChild(childElement);
	}

	constructElement(data, element, fatherElement) {
		let createdElement = this.createElement(element);

		this.appendData(createdElement, data);

		this.appendElement(fatherElement, createdElement);
	}

	constructElementImage(data, element, fatherElement) {
		let createdElement = this.createElement(element);

		this.addAttribute("src", data, createdElement);

		this.appendElement(fatherElement, createdElement);
	}

	constructElementIcon(data, element, fatherElement, options) {
		let createdElement = this.createElement(element);

		let createdElementIcon = this.createElement("i");

		this.addAttribute("class", options.get("class"), createdElementIcon);

		this.appendElement(createdElement, createdElementIcon);

		this.appendData(createdElement, data);

		this.appendElement(fatherElement, createdElement);
	}

	constructElementIconLink(data, element, fatherElement, options) {
		let createdElement = this.createElement(element);

		let createdElementLink = this.createElement("a");

		let createdElementIcon = this.createElement("i");

		this.addAttribute("class", options.get("class"), createdElementIcon);

		this.addAttribute("href", options.get("href"), createdElementLink);

		this.addAttribute("target", options.get("target"), createdElementLink);

		this.appendElement(createdElementLink, createdElementIcon);

		this.appendData(createdElementLink, data);

		this.appendElement(createdElement, createdElementLink);

		this.appendElement(fatherElement, createdElement);
	}
}

class UserComplementary extends User {
	makePage(res) {
		const options = new Map();

		options.set("class", "bx bx-pin");
		this.checkData(res.location, "li", this.mainContainer, "element-icon", options);

		options.set("class", "bx bx-briefcase-alt");
		this.checkData(res.company, "li", this.mainContainer, "element-icon", options);

		options.set("class", "bx bxl-github");
		options.set("href", res.html_url);
		options.set("target", "_blank");
		this.checkData(res.login, "li", this.mainContainer, "element-icon-link", options);

		options.set("class", "bx bxl-twitter");
		options.set("href", `https://twitter.com/${res.twitter_username}`);
		this.checkData(res.twitter_username, "li", this.mainContainer, "element-icon-link", options);

		options.set("class", "bx bx-world");
		options.set("href", res.blog);
		this.checkData(res.blog, "li", this.mainContainer, "element-icon-link", options);

		options.set("class", "bx bx-envelope");
		options.set("href", `mailto:${res.email}`);
		this.checkData(res.email, "li", this.mainContainer, "element-icon-link", options);

		this.#fetchResults();
	}

	#fetchResults() {
		initialScreen.classList.add("hide");
		message.classList.remove("hide");
		initialLoad.classList.add("hide");

		userInfo.classList.remove("hide");
		userActivity.classList.remove("hide");
	}
}

class Repos extends User {
	async fetchData(user, showReposNumber = 10, filter = "pushed", sort = "desc") {
		this.fetchLoad();
		this.initFetch(showRepos);

		try {
			const responseTotalRepos = await fetch(`https://api.github.com/search/repositories?q=user:${user}&per_page=100&page=1`, { headers });

			this.#handleErrorRepos(responseTotalRepos);

			const res = await responseTotalRepos.json();

			const requests = this.#fetchMultiRepos(res);

			const responses = await Promise.all(requests);

			const data = await Promise.all(responses.map((response) => response.json()));

			data.push(res);

			const dataAllInOne = data.flatMap((res) => res.items);

            const numberPages = Math.ceil(dataAllInOne.length / showReposNumber);

			this.#sortRepos(filter, sort, dataAllInOne);

			return { dataAllInOne, numberPages, showReposNumber };
		} catch (err) {
			this.finishFetch(showRepos);
			this.#showErrorRepos(err.message);
			return false;
		}
	}

	#handleErrorRepos(response) {
		if (!response.ok) {
			if (response.status === 422) {
				throw new Error("Usuário não possui repositórios!");
			}

			if (response.status === 403) {
				throw new Error("Limite de busca de repositórios! Aguarde um momento.");
			}

			throw new Error("Erro ao procurar repositórios!");
		}
	}

	makePage(data, numberPages, resultsNumber) {
		const options = new Map();

		const root = this.#setPagesProperties(numberPages);

		for (let i = 0; i < numberPages; i++) {
			let reposContainer = this.createElementContainer("div", this.mainContainer);
			this.addAttribute("class", "repo-page", reposContainer);

			let reposPage = data.slice(i * resultsNumber, (i + 1) * resultsNumber);

			reposPage.forEach((repo) => {
                if (!repo) {
                    this.constructElement("Número de repositórios excedeu o limite!", "h2", reposContainer);
                } else {
                    this.constructRepo(repo, reposContainer, options);
                }
			});
		}

		this.#paginationController(root, numberPages);

		this.finishFetch(showRepos);
		this.#fetchResults();
	}

	fetchLoad() {
		userRepos.innerHTML = "";
		repoLoad.classList.remove("hide");
	}

	#fetchMultiRepos(res) {
		let requestsNeeded = Math.ceil(res.total_count / 100);

		let requests = [];
		for (let page = 2; page <= requestsNeeded; page++) {
			const request = fetch(`https://api.github.com/search/repositories?q=user:${user}&per_page=100&page=${page}`, { headers });

			requests.push(request);
		}

		return requests;
	}

	#sortRepos(filter, sort, data) {
		switch (filter) {
			case "pushed":
				{
					if (sort === "desc") {
						data.sort((a, b) => {
							return new Date(b.pushed_at) - new Date(a.pushed_at);
						});
					} else {
						data.sort((a, b) => {
							return new Date(a.pushed_at) - new Date(b.pushed_at);
						});
					}
				}
				break;

			case "stars":
				{
					if (sort === "desc") {
						data.sort((a, b) => {
							return new Date(b.stargazers_count) - new Date(a.stargazers_count);
						});
					} else {
						data.sort((a, b) => {
							return new Date(a.stargazers_count) - new Date(b.stargazers_count);
						});
					}
				}
				break;

			case "forks":
				{
					if (sort === "desc") {
						data.sort((a, b) => {
							return new Date(b.forks_count) - new Date(a.forks_count);
						});
					} else {
						data.sort((a, b) => {
							return new Date(a.forks_count) - new Date(b.forks_count);
						});
					}
				}
				break;
		}
	}

	#fetchResults() {
		repoLoad.classList.add("hide");
	}

	#showErrorRepos(errorMessage) {
		this.constructElement(errorMessage, "h2", this.mainContainer);
		this.#fetchResults();
	}

	checkDataContainer(data, element, fatherElement, type, options = null) {
		if (data !== null && data !== undefined && data !== "") {
			switch (type) {
				case "element-container":
					{
						let createdContainer = this.createElementContainer(element, fatherElement);

						return createdContainer;
					}
					break;

				case "element-container-link":
					{
						let createdContainerLink = this.createElementContainerLink(element, fatherElement, options);

						return createdContainerLink;
					}
					break;
			}
		}
	}

	constructRepo(repo, reposContainer, options) {
		let createdContainer = this.checkDataContainer(true, "div", reposContainer, "element-container");

		this.addAttribute("class", "repo", createdContainer);

		options.set("href", repo.html_url);
		options.set("target", "__blank");
		let createdContainerLink = this.checkDataContainer(true, "a", createdContainer, "element-container-link", options);

		options.set("class", "bx bx-folder");
		this.checkData(repo.name, "h3", createdContainerLink, "element-icon", options);

		let lastUpdatedText = this.#setTime(new Date() - new Date(repo.pushed_at));

		this.checkData(lastUpdatedText, "span", createdContainerLink, "element");

		this.checkData(repo.description, "p", createdContainerLink, "element");

		let createdContainerRepoInfo = this.checkDataContainer(true, "div", createdContainerLink, "element-container");

		this.addAttribute("class", "repo-info", createdContainerRepoInfo);

		options.set("class", "bx bx-star");
		this.checkData(repo.stargazers_count, "span", createdContainerRepoInfo, "element-icon", options);

		options.set("class", "bx bx-git-branch");
		this.checkData(repo.forks_count, "span", createdContainerRepoInfo, "element-icon", options);

		this.checkData(repo.language, "span", createdContainerLink, "element");
	}

	createElementContainer(element, fatherElement) {
		let createdElementContainer = this.createElement(element);

		this.appendElement(fatherElement, createdElementContainer);

		return createdElementContainer;
	}

	createElementContainerLink(element, fatherElement, options) {
		let createdElementContainerLink = this.createElement(element);

		this.appendElement(fatherElement, createdElementContainerLink);

		this.addAttribute("href", options.get("href"), createdElementContainerLink);

		this.addAttribute("target", options.get("target"), createdElementContainerLink);

		return createdElementContainerLink;
	}

	#setTime(lastUpdatedTime) {
		const units = [
			{ unit: "second", divisor: 1000 },
			{ unit: "minute", divisor: 60 },
			{ unit: "hour", divisor: 60 },
			{ unit: "day", divisor: 24 },
			{ unit: "month", divisor: 30 },
			{ unit: "year", divisor: 12 },
		];

		let i = 0;

		while (i < units.length && lastUpdatedTime >= units[i].divisor) {
			lastUpdatedTime = lastUpdatedTime / units[i].divisor;
			i++;
		}

		let timeUnit = units[i - 1].unit;

		let lastUpdatedText = this.#setTimeUnit(lastUpdatedTime, timeUnit);

		return lastUpdatedText;
	}

	#setTimeUnit(lastUpdatedTime, timeUnit) {
		let lastUpdatedTimePast = Math.floor(lastUpdatedTime * -1);
		let formatter = new Intl.RelativeTimeFormat("pt-br", { style: "narrow" });

		let lastUpdatedText = formatter.format(lastUpdatedTimePast, timeUnit);

		return lastUpdatedText;
	}

	#setPagesProperties(numberPages) {
		const root = document.querySelector(":root");
		root.style.setProperty("--column-repos", numberPages);
		root.style.setProperty("--actual-page", 0);

		return root;
	}

	#paginationController(root, numberPages) {
		let paginationContainer = this.createElementContainer("span", this.mainContainer);
		this.addAttribute("id", "pagination", paginationContainer);

		let maxNumberPages = numberPages > 5 ? 5 : numberPages;

		for (let i = 1; i <= maxNumberPages; i++) {
			this.constructElement(i, "span", paginationContainer);
		}

		const firstPaginationItem = document.querySelector("#pagination span:first-child");
		firstPaginationItem.classList.add("selected");

		paginationContainer.addEventListener("click", (e) => {
			let selectedPage = Number(e.target.innerText);

			this.#paginationItemsEvent(root, paginationContainer, selectedPage);
			this.#updatePaginationItems(paginationContainer, numberPages, selectedPage);
		});
	}

	#paginationItemsEvent(root, paginationContainer, selectedPage) {
		let childArray = Array.from(paginationContainer.children);
		let page = document.querySelector("#user-repos .repo-page");

		page.addEventListener(
			"transitionend",
			() => {
				userActivity.scrollIntoView({ behavior: "smooth" });
			},
			{ once: true }
		);

		childArray.forEach((child) => {
			child.classList.remove("selected");
		});

		root.style.setProperty("--actual-page", selectedPage - 1);
	}

	#updatePaginationItems(paginationContainer, numberPages, selectedPage) {
		paginationContainer.innerHTML = "";

		const pagesPerBlock = 5;
		let firstItem = Math.max(1, selectedPage - Math.floor(pagesPerBlock / 2));
		let lastItem = Math.min(numberPages, firstItem + (pagesPerBlock - 1));

		if (firstItem > lastItem - 4 && lastItem - 4 > 0) {
			firstItem = lastItem - 4;
		}

		for (let i = firstItem; i <= lastItem; i++) {
			let createdElement = this.#constructPaginationItem(i, paginationContainer);

			if (i === selectedPage) {
				this.addAttribute("class", "selected", createdElement);
			}
		}
	}

	#constructPaginationItem(data, fatherElement) {
		let createdElement = this.createElement("span");
		this.appendData(createdElement, data);
		this.appendElement(fatherElement, createdElement);

		return createdElement;
	}
}

class Techs extends User {
	async fetchData(user) {
		this.fetchLoad();

		try {
			const response = await fetch(`https://api.github.com/search/repositories?q=user:${user}`, { headers });

			this.#handleErrors(response);

			const res = await response.json();

			return res.items;
		} catch (err) {
			this.#showErrorTechs(err.message);
			return false;
		}
	}

	#handleErrors(response) {
		if (!response.ok) {
			switch (response.status) {
				case 403:
					{
						throw new Error("Número de consultas excedido, tente novamente em alguns segundos!");
					}
					break;

				case 422:
					{
						throw new Error("Usuário não trabalha com nenhuma tecnologia!");
					}
					break;
			}

			throw new Error("Erro ao procurar tecnologias!");
		}
	}

	async makePage(res) {
		let languages = new Set();

		const requests = res.map((repo) => this.#fetchLanguages(repo));
		const responses = await Promise.all(requests).catch((err) => {
			this.#showErrorTechs(err.message);
		});

		responses.forEach((res) => {
			Object.keys(res).forEach((language) => {
				languages.add(language);
			});
		});

		languages.forEach((language) => {
			this.constructElement(language, "span", this.mainContainer);
		});

		this.#fetchResults();
	}

	fetchLoad() {
		techLoad.classList.remove("hide");
	}

	#fetchResults() {
		techLoad.classList.add("hide");
	}

	#showErrorTechs(errorMessage) {
		this.constructElement(errorMessage, "p", this.mainContainer);
		this.#fetchResults();
	}

	async #fetchLanguages(repo) {
		const response = await fetch(repo.languages_url, { headers });

		this.#handleErrors(response);

		const res = await response.json();

		return res;
	}
}

const user = new User(userData);

const userComplementary = new UserComplementary(userComplement);

const techs = new Techs(userTech);

const repos = new Repos(userRepos);

searchbarButton.addEventListener("click", async () => {
	let userSelected = searchbar.value.replace(/\s/g, "");
	sessionStorage.setItem("userSelected", userSelected);

	if (user.isFetching) {
		return;
	}

	let userRes = await user.fetchData(userSelected);

	if (userRes) {
		user.makePage(userRes);
		userComplementary.makePage(userRes);

		let responses = await Promise.all([repos.fetchData(userSelected), techs.fetchData(userSelected)]);

		let { dataAllInOne, numberPages, showReposNumber } = responses[0];

		if (dataAllInOne) {
			repos.makePage(dataAllInOne, numberPages, showReposNumber);
		}

		let techRes = responses[1];

		if (techRes) {
			await techs.makePage(techRes);
		}

		user.finishFetch(searchbarButton);
	}
});

searchbar.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		searchbarButton.click();
	}
});

showRepos.addEventListener("click", async () => {
	if (repos.isFetching) {
		return;
	}

	let userSelected = sessionStorage.getItem("userSelected");
	let resultsNumberSelected = resultsNumber.value ? resultsNumber.value : 0;

	let filterSelected = document.querySelector("[name=filter]:checked") ? document.querySelector("[name=filter]:checked").value : "updated";

	let sortSelected = document.querySelector("[name=sort]:checked") ? document.querySelector("[name=sort]:checked").value : "desc";

	let { dataAllInOne, numberPages, showReposNumber } = await repos.fetchData(userSelected, resultsNumberSelected, filterSelected, sortSelected);

	if (dataAllInOne) {
		repos.makePage(dataAllInOne, numberPages, showReposNumber);
	}
});

resultsNumber.addEventListener("beforeinput", () => {
	let previousValue = resultsNumber.value;

	resultsNumber.addEventListener(
		"input",
		() => {
			if (resultsNumber.value.match(/[^0-9]/g)) {
				resultsNumber.value = previousValue;
			}
		},
		{ once: true }
	);
});

resultsNumber.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		showRepos.click();
	}
});