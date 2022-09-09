## Teamwork

## Description

Project Overview
Teamwork is an ​ internal social network for employees of an organization. The goal of this
application is to facilitate more interaction between colleagues and promote team bonding.
An in-depth paragraph about your project and overview of use.

## Getting Started

### Dependencies

-   npm, node, postgress, are needed before installing program.

### Installing

2.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/Project-Name.git
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```
4.  Create a .env file `.env` and update with database details (check the .env.sample)

        ```
        DATABASE_URL= <DB_CONNECTION_STRING>
        PORT= <PORT>
        TOKEN_SECRET= <SECRET>
        ```

    <p align="right">(<a href="#top">back to top</a>)</p>

### Executing program

1. `npm run dev`
   Runs the app in the development mode.\

The page will reload when you make changes.\
You may also see any lint errors in the console.

2. `npm test`
   Launches the test runner in the interactive watch mode.\

3. `npm run seeddb`
   seeds the database with users data.\

## Help

Any advise for common problems or issues.

### How do I add a new migration?
For context, a migration is basically a file that is run to make changes to the existing database structure or schema. For example, adding a new column, making a column required/optional/unique, dropping a column, inserting data and more. 

To create a new migration. Kindly follow the steps outlined below:

1. Create a migration and name it to suit what the migration will be doing. This is done by running 

```bash
npm run migrate create {migration-name} 
```
 **NB: Change `{migration-name}` to the actual name of the migration. The name should represent the change you're making so it is readable. See the existing names in the `migrations` folder**

2. A new migration file will be created.
3. The content of the migration to be added will depend mainly on the task being done. [Here is a guide](https://salsita.github.io/node-pg-migrate/#/migrations) which shows how to define the migration based on the specific task in question.

## Authors

Contributors names and contact info

ex. Dominique Pizzie  
ex. [@DomPizzie](https://twitter.com/dompizzie)

## Version History

-   0.2
    -   Various bug fixes and optimizations
    -   See [commit change]() or See [release history]()
-   0.1
    -   Initial Release

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

-   [![Next][next.js]][next-url]

<p align="right">(<a href="#top">back to top</a>)</p>
## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.

-   [awesome-readme](https://github.com/matiassingers/awesome-readme)
-   [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
-   [dbader](https://github.com/dbader/readme-template)
-   [zenorocha](https://gist.github.com/zenorocha/4526327)
-   [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)
