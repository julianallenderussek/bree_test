import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
const app = express();
const port = 5000;
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.get('/api', (req, res) => {
  res.send('Api online!');
});

app.post('/api/check', async (req: Request, res: Response) => {
  let { fullName, birthYear, country, birthMonth, birthDay } = req.body;

  if (!fullName || !birthYear || !country || !birthMonth || !birthDay) {
    return res.status(400).json({ message: 'All fields (name, birthDay, birthMonth, birthYear and country) are required' });
  }

  // Normalizing birthDay and birthMonth from one to two digits (2 -> 02)
  if (birthMonth.length === 1) {
    birthMonth = `0${birthMonth}`;
  }
  if (birthDay.length === 1) {
    birthDay = `0${birthDay}`;
  }
  
  let dob = `${birthYear}-${birthMonth}-${birthDay}`
  
  try {
    let data = JSON.stringify({
      minScore: 95,
      sources: ['sdn', 'nonsdn', 'un', 'ofsi', 'eu', 'dpl', 'sema', 'bfs', 'mxsat', 'lfiu'],
      cases: [
        {
          "name": fullName,
          "nationality": country,
          "dob": dob,
          "citizenship": country
        }
      ]
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.ofac-api.com/v4/screen',
      headers: { 
        "apiKey": process.env.OFAC_API_KEY, 
        "Content-Type": "application/json"
      },
      data : data
    };

    const response = await axios.request(config);
    const result = response.data.results[0];

    let responseData = {
      name: false,
      dob: false,
      country: false
    }
    
    if (result.matchCount === 0) {
      return res.status(200).json({
        status: 'Clear',
        screeningResults: responseData
      });
    }

    for (let i = 0; i < result.matches.length; i++) {
      const match = result.matches[i];
      for (let j = 0; j < match.matchSummary.matchFields.length; j++) {
        const summary = match.matchSummary.matchFields[j];
        if (summary.fieldName === "Name") {
          responseData.name = true
        }

        if (summary.fieldName === "DOB") {
          responseData.dob = true
        }

        if (summary.fieldName === "Citizenship") {
          responseData.country = true
        }
      }
    }

    return res.status(200).json({ status: 'Hit', screeningResults: responseData});
    
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
