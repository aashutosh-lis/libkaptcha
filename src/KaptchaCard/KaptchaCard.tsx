import React, { useEffect, useRef, useState } from 'react'
import ReplayIcon from '@mui/icons-material/Replay';
import './styles.css'

export interface KaptchaCardProps {
  url:String,
}

// { title }: KaptchaCardProps
export function KaptchaCard({url}:KaptchaCardProps) {

  const [captchaData, setCaptchaData] = useState({
    image_id: '',
    image: '',
    expiry_time: 0,
  });
 

  const [timer, setTimer] = useState<number>(0); // 3 minutes in seconds
  const [ans , setAns] = useState<string>("");
  const [validationMsg, setValidationMsg] = useState<string>("")

  useEffect(() => {

    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        // Handle timer expiration 
      }
    }, 1000);

// Cleanup the interval when the component unmounts
    return () => clearInterval(countdown);
  }, [timer]);

  // Convert the remaining seconds to the "mm:ss" format
  const minutes: number = Math.floor(timer / 60);
  const seconds: number = timer % 60;
  const formattedTime: string = `${minutes}:${seconds.toString().padStart(2, '0')}`;




  const fetchCaptcha = async () => {
    try {
      const response = await fetch(url+'/get-captcha', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('POST request successful', data);
      setCaptchaData((prevData) => ({
        ...prevData,
        ...data,
      }));
      console.log("state var",captchaData);
      

    } catch (error) {
      console.error('POST request error', error);
    }
  };


  //Verify by sending ans and uuid to is-human route.
  const verify = async() => {
    try{
        const res = await fetch(url+'/is-human',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
           },
          body: JSON.stringify({
            uuid:captchaData.image_id,
            answer:ans
          }),
        })

        const result = await res.json();

        if (result['is_human'] === true) {
          setValidationMsg("Successful in Validation");
          setTimer(0);

        } else {
          setValidationMsg("Please try again");
          fetchCaptcha();
        }

        setAns("");
    }

    catch(error){
      console.log("Error in verify  /is-human route.",error);
    }
  }


  useEffect(()=>{
    fetchCaptcha();
  },[])
    
  useEffect(() => {
    if (captchaData.expiry_time) {
      const timestamp = Math.floor(captchaData.expiry_time);
      const currTime = Math.floor(Date.now());
      const expTime = Math.floor((timestamp - currTime) / 1000);
      setTimer(expTime);
    }
  }, [captchaData]);


  return (
    <div className = "captcha-container" >
    <div className ="left">
        <span>{validationMsg}</span>
        <img src = {captchaData.image} alt="Captcha Image"/>
    </div>
    <div className = "right">
        <div className="input-timer"> 
            <input type="text" placeholder="Captcha" value={ans} className='captcha-input' onChange={(e)=>{setAns(e.target.value)}}/>
            <div className="timer">{formattedTime}</div>
        </div>
        <div className="reload-verify">
            <div onClick={fetchCaptcha}>
                <ReplayIcon fontSize="large" style={{ transform: 'scaleX(-1)' }}/>
            </div>
            <button className="verify"  onClick={verify}>Verify</button>
        </div>
    </div>
</div>
  );
}
