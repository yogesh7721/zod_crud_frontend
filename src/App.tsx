

import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './componants/Navbar'
// import FormData from './peges/Zod'
import Profile from './peges/Profile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import FormDataComponent from './peges/Zod'


const App = () => <>
  <ToastContainer />
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<> <Navbar /> <Outlet /></>}>
        {/* <Route path='/form' element={<FormData />} /> */}
        <Route path='/' element={<FormDataComponent />} />
        <Route path='/profile' element={<Profile />} />

      </Route>
      <Route path='*' element={<h1>Page Not Found</h1>} />
    </Routes>
  </BrowserRouter>
</>

export default App

