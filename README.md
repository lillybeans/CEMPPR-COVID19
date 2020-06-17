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

1. install Node
2. Clone repository
3. Make sure you are at root,  `cd src`
2. Then run the command `nodemon server.js`
