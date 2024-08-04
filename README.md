This project present a solution for the BREE interview task.

In the task description was mentioned to require a the Birth Year. 
The OFAC requires the full date (year-month-date)for searching matches using dob.
I decided to ask to input that information on my form.

# Installation And Setup
Backend
```
  cd be
  npm install
  npm run dev
```

Frontend
```
  cd fe
  npm install
  npm run start
```

# Usefull cases to test the form with
Julian Allende 02-10-1992 Mexico (Myself)
Joaquin Guzman 1954-12-25 Mexico (HIT Dob, Name)
Abu Abb   1963-07-15 Algeria (HIT Dob, Name, Citizenship (country) )

# Environment Variables
Please create the following two files

be/.env
```
  OFAC_API_KEY='you api key'
```

The api-key you can get it from the following link. https://www.ofac-api.com/account/sign-up. Free tier should enough for developing.

fe/.env
```
  REACT_APP_API_ENDPOINT=http://localhost:5000
```

# OFAC API
The project implements on the backend a screening check of an individual in different government databases to detect past fraudulent activity matches.
The documentation for this API can we found in the following link: https://docs.ofac-api.com/

Specially relevant for this implementation is the screen API:
Request:
https://docs.ofac-api.com/screening-api/request
Reponse:
https://docs.ofac-api.com/screening-api/response

# Original Task
## Timing

- 48 hours
- We are evaluating the readability, efficiency and cleanliness of your code, as well as the presentation of the UI/UX
- If you get stuck or confused, please don’t hesitate to ask questions

## Objective

We would like you to create a simple but scalable full stack web application that screens customers against the publicly available OFAC Specially Designated Nationals (SDN) list (url [here](https://ofac.treasury.gov/specially-designated-nationals-list-data-formats-data-schemas)).

### **Part 1: Front end**

- We would like you to build a simple, clean and well designed form that allows entry of a person’s **A) Full Name, B) Birth Year and C) Country.**
- The form should have a submit button. The form should fail to submit if any of the three fields is missing (all three fields are required).
- After the submit button is pressed, display the result of the backend response:
    - `Hit / Clear` → If a customer has any of the three fields match against the SDN list, display “Hit”. If a customer is not on the list, display “Clear”
    - If a customer is a “Hit”, display which parameters are a match. For example, if the customer’s name is a match, but year of birth and country are not matches, this partial match should be displayed as such e.g. (Name: ✅ DoB: ❌ Country: ❌)

### **Part 2: Back end**

Use the publicly available data to perform an API call.. You can also utilize publicly available APIs that allow querying against the SDN list if you choose to do so. One of these are listed below (free tier is sufficient for this assignment):

- https://ofac-api.com/documentation/v3/index.html

## Deliverables

- Share your code via Github and send repo to adam@trybree.com along with Part 2 of this submission
- Provide a detailed but concise description in your readme
- Provide a publicly accessible url to access the web app
- You are invited to make this project as production-ready as possible. Feel free to propose or implement any optimizations that you feel would be important or additive
