import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import {RotateCcw } from "lucide-react";
import './styles.css'

export interface urlProps{
    url:string;
}

export function KaptchaCard({url}:urlProps){
    
    const [verificationResult, setVerificationResult] = useState<Boolean | null>(null);
    const [captchaAnswer, setCaptchaAnswer] = useState<string>("");
    const [disableButton, setdisableButton] = useState<boolean>(false);

    const [captchaData, setCaptchaData] = useState({
        image_id: "",
        image: "",
        expiry_time: 0,
      });
      
      const fetchCaptcha = async () => {
        try {
          const response = await fetch(url+"/get-captcha", {
            method: "POST",
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const data = await response.json();
          console.log("POST request successful", data);
          setCaptchaData(data);
        } catch (error) {
          console.error("POST request error", error);
        }
      };

      const refreshCaptcha = () => {
        setdisableButton(false);
        setCaptchaAnswer("");
        fetchCaptcha();
      };

      const refreshCaptchaWithMessageClear=()=>{
        setVerificationResult(null);
        refreshCaptcha();
      }


      const verifyCaptcha = async () => {
        try {
          const response = await fetch(url+"/is-human", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answer: captchaAnswer,
              uuid: captchaData.image_id,
            }),
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const data = await response.json();
          console.log("Verification successful", data);
          setCaptchaAnswer("");
          if (data.is_human == true) {
            setVerificationResult(true);
            setdisableButton(true);
            console.log("is human");
          } else {
            setVerificationResult(false);
            console.log("is not human");
            refreshCaptcha();
          }
        } catch (error) {
          console.error("Verification error", error);
          setVerificationResult(null);
        }
      };
      const handleOtpChange = (value: string) => {
        setCaptchaAnswer(value);
      };
    
      useEffect(() => {
        // Call the fetchCaptcha function when the component mounts
        fetchCaptcha();
      }, []);
    
      // Timer functionalities
      const [timer, setTimer] = useState<number>(0); // 3 minutes in seconds
      useEffect(() => {
        const countdown = setInterval(() => {
          if (timer > 0) {
            setTimer(timer - 1);
          } else {
            refreshCaptcha();
            clearInterval(countdown);
            setVerificationResult(null);
            // Handle timer expiration
          }
        }, 1000);
    
        // Cleanup the interval when the component unmounts
        return () => clearInterval(countdown);
      }, [timer]);
    
      const minutes: string = Math.floor(timer / 60).toString().padStart(2,'0');
      const seconds: number = timer % 60;
      const formattedTime: string = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
    
      useEffect(() => {
        if (captchaData.expiry_time) {
          const timestamp = Math.floor(captchaData.expiry_time);
          const currTime = Math.floor(Date.now());
          const expTime = Math.floor((timestamp - currTime) / 1000);
          setTimer(expTime);
        }
      }, [captchaData]);
    
      return (
        <div className="captchacomp">
          <div className="child captchasec">
            <img
              className="captchaimg_refreshbutton captchaimage"
              src={captchaData.image}
              alt="captcha-image"
            />
            <button 
              disabled={disableButton}
              className={`captchaimg_refreshbutton refreshbutton ${disableButton?'disabled':''}`}
              onClick={refreshCaptchaWithMessageClear}>
              <RotateCcw />
            </button>
          </div>
          <div className="child messagenote">
            <p>
              {verificationResult !== null ? (
                verificationResult ? (
                  <span id="correct">Validation Successful</span>
                ) : (
                  <span id="incorrect">Validation Error</span>
                )
              ) : (
                <div id="message"></div>
              )}
            </p> 
          </div>
          <div className="child answerfield">
            <OtpInput
              value={captchaAnswer}
              onChange={handleOtpChange}
              numInputs={5}
              renderSeparator={<span> </span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
    
                    margin: "5px",
                    border:"1px Solid Grey",
                    textAlign:"center",
                    borderRadius:"10px",
                    width: "40px", // Set the width as per your requirement
                    height: "40px", // Set the height as per your requirement
                    fontSize: "16px", // Optional: Set the font size
                  }}
                />
              )}
            />
             <div className="timer">{formattedTime}</div>
          </div>
          
          <div className="child cancelvalidate">
          <button
            className={`btnvalidate ${disableButton ? 'disabled' : ''}`}
            disabled={disableButton}
             onClick={verifyCaptcha}
          >
              Validate
            </button>
          </div>
        </div>
      );
  
}

