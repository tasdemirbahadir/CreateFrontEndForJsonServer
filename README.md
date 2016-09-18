# CreateFrontEndForJsonServer
Ginger payments job recruitment session assignment

## Getting Started

Clone/download project into a folder on your machine. After setting up the environment, your project will be ready to run.

### Prerequisities

To be able to use npm,
Install node.js : https://nodejs.org/en/download/

To be able to run json server,
Install json server : ```npm install -g json-server```

To be able to run e2e tests,
Install Procractor : ```npm install -g protractor```

To be able to run Selenium server,
run : ```webdriver-manager update```


## Run

* Go to directory <project-source>/sever
* Start json server : ```json-server --watch db.json```
* Go to index.html file location <project-source>/frontend, open it on the browser
* See that project is up and running

## Testing

* Start selenium server : ```webdriver-manager start```
* In another terminal, go to <project-source>/frontend/js/e2eTests
* Run tests : ```protractor protractor.conf.js```
* The results must be : 
```
  6 specs, 0 failures
```

## Versioning

* 1.0

## Authors

* **Bahadir Tasdemir** - *Owner* - [btasdemir.com](http://www.btasdemir.com)
