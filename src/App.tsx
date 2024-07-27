import { useEffect, useRef, useState } from 'react'
import MyGlobe from './components/globe';
import { Link } from 'react-router-dom';
import { IoExtensionPuzzleSharp, IoSettingsSharp } from 'react-icons/io5';
import { MdPrivacyTip, MdPublic } from 'react-icons/md';
import { IoIosInformationCircle } from 'react-icons/io';
import { FaArrowRightLong } from 'react-icons/fa6';
function App() {
  const [runningServer, setRunningServer] = useState<any>(false)

  return (
    <div className='select-none'>
      <MyGlobe />

      <div className="absolute bottom-0 left-0 z-50 w-full text-black p-2 space-y-1">
        <div className="flex flex-col">
          <span>total server: 44</span>
          <span>isConnected: true</span>
          <span>serverNumber: 43</span>

          <span>ip: 423.234.2534.</span>
          <span>city: dhaka</span>
          <span>country: bangladesh</span>
          <span>region: asd</span>
          <span>timezone: asia/dhaka</span>
        </div>

        <div className="flex gap-2">
          <button
            className={`btn serverBtn ${runningServer ? 'connect' : 'disconnect'}`}
            onClick={() => setRunningServer(!runningServer)}
          >{runningServer ? 'Connected' : 'Connect'}</button>
          {
            runningServer && <button className="material-icons"><FaArrowRightLong className='text-3xl text-[#59d5c8]' /></button>
          }
        </div>
        <button onClick={()=>{
          chrome.runtime.sendMessage({type: 'disableProxy'});
        }}>disable</button>

        <div className='flex items-center justify-between'>
          <span className='text-md'>safe your privacy</span>
          <div className='flex items-center gap-1 text-primary'>
            <Link title="provider" to="/provider"><IoExtensionPuzzleSharp className='text-2xl' /></Link>
            <Link title="countries" to="/countrySelect" ><MdPublic className='text-2xl' /></Link>
            <Link title="options" to="/settings" target="_blank"><IoSettingsSharp className='text-2xl' /></Link>
            <Link title="about us" to="/aboutus" ><IoIosInformationCircle className='text-2xl' /></Link>
            <Link title="privacy policy" to="/privacy" target="_blank"><MdPrivacyTip className='text-2xl' /></Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
