import React, { useState } from "react";
import { Grid, CircularProgress, Typography,Tabs,Tab,TextField,Fade,} from "@material-ui/core";
import {Button} from "@material-ui/core";
import { loginUser } from "../../context/UserContext";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import {Link} from "react-router-dom";
import { useUserDispatch,  } from "../../context/UserContext";
import Footer from "../../pages/home/Footer"
function Login(props) {
  const handleOpen = () => {
    props.history.push('/app/profileregistration/add') 
};
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");
  var [roleValue, setRoleValue] = useState("");
  return (
  
    <Grid container className={classes.container}>
      {/* <div className={classes.logotypeContainer} >
        <img src="https://img.freepik.com/premium-photo/hands-student-boy-using-wooden-material-montessori-school_47726-6358.jpg?w=2000"
         alt="logo" className={classes.logotypeImage} style={{ width: '820px',  height: '1000px'}}/>
      </div> */}
      <div className={classes.formContainer}>
        <div className={classes.form}>

         {/* <h2 style={{fontFamily: 'unset',color: '#0fb880', fontSize: '20px', fontWeight: 'revert',   
       
        }}>Welcome To Sure shot Survey </h2> */}
      
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" style={{color:"#ff6b81"}} classes={{ root: classes.tab }} />
          </Tabs>
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              {/* <FormControl variant="standard" fullWidth>
                            <InputLabel id="demo-simple-select-standard-label">Select Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                label="Select Login"
                                name="status"
                                placeholder="Select Role"
                               value={roleValue}
                               onChange={e => setRoleValue(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'SCHOOLE'}>Admin </MenuItem>
                                <MenuItem value={'BOOTH'}>Booth </MenuItem>
                              
                            </Select>
                        </FormControl> */}
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>
                      
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                        roleValue
                      )
                    }
                    variant="contained"
                    color="primary"
                    style={{backgroundColor:"#ff6b81", }}
                    size="large"
                  >
                    Login
                  </Button>
                )}
                {/* /app/profileregistration/add */}
                 <Link to="/sriqr/profileregistration"
                  color="primary"
                  size="large" style={{color:"#ff6b81", fontSize: "initial"}}
                  className={classes.forgetButton}
                >
                get registerd
                </Link>
                
              </div>
              
            </React.Fragment>
         
           
        </div>
       
      </div>
      <div>
      
        </div>
    </Grid>
    
  );

}

export default withRouter(Login);
