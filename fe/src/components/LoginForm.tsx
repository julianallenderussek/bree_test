import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { countries } from './countries';
import './LoginForm.css'


interface FormData {
  fullName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  country: string;
}

interface FormErrors {
  fullName?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  country?: string;
}

interface SubmissionResult {
  status?: string;
  screeningResults?: ScreeningResults;
}

interface ScreeningResults {
  name: boolean;
  dob: boolean;
  country: boolean;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ fullName: '', birthYear: '', birthMonth: '', birthDay: '', country: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const currentYear = new Date().getFullYear();
  const startYear = 1920;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: value ? '' : `Please enter your ${name}` });
  };

  useEffect(() => {
    const isFormValid = formData.fullName.trim() !== '' &&
      formData.birthYear.trim() !== '' &&
      formData.birthMonth.trim() !== '' &&
      formData.birthDay.trim() !== '' &&
      formData.country.trim() !== '';
    setIsSubmitDisabled(!isFormValid);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    setResponseStatus(null);
    setSubmissionResult(null);

    if (!isSubmitDisabled) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/check`, formData);

        if (response.status === 200) {
          setResponseStatus(response.status);
          setSubmissionResult(response.data)
        }
      } catch (error) {
        setResponseStatus(500);
      }
    }
  };

  return (
    <div className='main-section'>
      <h1>Bree Interview Test</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <h2>Signup</h2>
            <h4>We are excited to welcome you to the BREE family.</h4>
            <h5>To create your account please provide us with the following information.</h5>
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={formErrors.fullName ? 'error' : ''}
            />
            {formErrors.fullName && <div className="error-message">{formErrors.fullName}</div>}
          </div>
          <div>
            <label htmlFor="fullName">Date of Birth</label>
          </div>
          <div style={{ display: "flex" }}>
            <select
              id="birthDay"
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              className={formErrors.birthDay ? 'error' : ''}
            >
              <option value="">Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              id="birthMonth"
              name="birthMonth"
              value={formData.birthMonth}
              onChange={handleChange}
              className={formErrors.birthMonth ? 'error' : ''}
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              id="birthYear"
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
              className={formErrors.birthYear ? 'error' : ''}
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            {formErrors.birthDay && <div className="error-message">{formErrors.birthDay}</div>}
            {formErrors.birthMonth && <div className="error-message">{formErrors.birthMonth}</div>}
            {formErrors.birthYear && <div className="error-message">{formErrors.birthYear}</div>}
          </div>
          <div>
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={formErrors.country ? 'error' : ''}
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {formErrors.country && <div className="error-message">{formErrors.country}</div>}
          </div>
          <button type="submit" disabled={isSubmitDisabled}>Submit</button>
        </form>
      </div>
      
      <div>
        {
          (responseStatus === 200 && submissionResult && submissionResult.status === "Clear") ?  
          <h1>Clear</h1> : <></>
        }
        {
          (responseStatus === 200 && submissionResult && submissionResult.status === "Hit") ?  
            <div>
              {
                Object.entries(submissionResult.screeningResults ?? {}).map(([key, value]) => (
                  <div className='result-row' key={key}>
                    <h2>{key}: </h2>
                    <p>{value === true ? '✅' : '❌' }</p>
                  </div>
                ))
              }
            </div> : <></>
        }

      </div>
      
    </div>

  );
};

export default LoginForm;
