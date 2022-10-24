import React  from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';



//여기부터 다시.. 
function SplashScreenOne(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {    
    const target = event.target as HTMLDivElement
    const any = target.click 
        window.location.href ='/SplashScreentwo'
        return(
            <div>
        <div onClick={any}></div>
        <h1>Toong.io</h1>
        </div>
    )
        }


function SplashScreentwo(){
    return(
        <div>
            <h1>ToongGAry</h1>
        </div>
    )
}



function SplashScreen(){
    return(
        <Router>
            <div>
                <Routes>
                    <Route path="/SplashScreentwo">
                        <SplashScreentwo/>
                    </Route> 
                <Route path="/SplashScreenOne">
                    <SplashScreenOne/>                  

                    
                </Route>    
                </Routes>

            </div>
        </Router>

)
    }

export default  SplashScreen
