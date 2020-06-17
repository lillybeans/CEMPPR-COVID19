# CEMPPR-COVID19 Poll Tracker

Collaboration on Emergency Management, Policy, and Preparedness Research COVID-19 Project

This project contains all the code for the Poll Tracker website, as well as the Tableau dashboard

## About the Poll Tracker

The Poll Tracker is a website that allows volunteers to create, view, update and delete surveys used for COVID19 policy research.

Front-end: HTML, CSS/SASS, Handlebars (for templating)
Backend: Node.js
Database: MySQL

## Folders

### src
Contains all the source code the website

### SQL
There is a subfolder called "Backups" that contains database backups. 

To restore the database, just import using the file `Backup20200608.sql`.

### Google Form
contains script for the Google Form (our old data entry portal)

### Google Sheets
contains script for the Google Sheet (our old data entry portal)


## Deployment

If you want to deploy the website locally:

1. Install node. If you are on Mac: `brew install node`. If you already have node installed, run: `node -v` and `npm -v` and make sure you have the latest versions.
2. Clone this repository
3. Make sure you are at root of the repo, then  `cd src`
4. Then run the command `nodemon server.js`
5. Open web browser, go to `localhost:3000`. You should now be able to see the homepage of the website.
