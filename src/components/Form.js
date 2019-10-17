import React, { useState, useEffect } from 'react';
import { withFormik, Field, Form} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const OnboardingForm = ({ values, touched, errors, status }) => {
  const [userData, setUserData] = useState([]) // setting the values returned from handleSubmit's setState

  // runs every time state/status is changed
  useEffect(() => {
    status && setUserData(userData => [...userData, status])
  }, [status])

  return (
    <div>
      <h1>User Onboarding Form</h1>
      <Form>
        <Field type='text' name='name' placeholder='Name'/>
        {touched.name && errors.name && (<p>{errors.name}</p>
        )}
        <Field type='email' name='email' placeholder='Email'/>
        {touched.email && errors.email && (<p>{errors.email}</p>)}
        <Field type='password' name='password' placeholder='Password'/>
        {touched.password && errors.password && (<p>{errors.password}</p>)}
        <Field type='password' name='confirmPassword' placeholder='Confirm Password'/>
        {touched.confirmPassword && errors.confirmPassword && (<p>{errors.confirmPassword}</p>)}
        <label>
          I have read and agreed to the Terms of Service
        <Field type='checkbox' name='tos' checked={values.tos}/>
        {touched.tos && errors.tos && (<p>{errors.tos}</p>)}
        </label>       
        <button>Submit</button>
      </Form>
      {/* renders only if there is status to display*/}    
      {status && 
        <h3>Welcome to the Team!</h3>
      }

      {userData.map(user => {
        return(
          <div>
            <ul key={user.id}>
              <li>Name: {user.name}</li>
              <li>Email: {user.email}</li>
            </ul>
          </div>
        )
      })}

    </div>  
  )
}

const FormikOnboarding = withFormik ({
  mapPropsToValues({ name, email, password, confirmPassword, tos }) {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      confirmPassword: confirmPassword || '',
      tos: tos || false
    }
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required('Please enter your name'),
    email: Yup.string().required('We need your email!'),
    password: Yup.string().required('Please enter a password'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Password does not match').required(), //Yup.ref creates a reference to another sibling or sibling descendant field
    tos: Yup.boolean().oneOf([true], 'You must accept our Terms of Service to continue').required() 

  }),

  handleSubmit(values, { setStatus, resetForm }) {
    resetForm()
    axios.post('https://reqres.in/api/users/', values)
      .then(res => {setStatus(res.data)})
      .catch(err => console.log(err))
  }
})(OnboardingForm)

export default FormikOnboarding