import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

export function Header(){
   return (
      <AppBar style={{marginBottom: '3%'}} position="static" color="default">
         <Toolbar>
            <img src="logo.png" style={{width: '5%', margin: '0.5% 0'}} alt="Logo do Site"/>
            <Typography color="textSecondary" variant="h4">
            Thorson
            </Typography>
         </Toolbar>
      </AppBar>
   );
}