import { TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';

interface InputSeachProps{
   filterProducts: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputSearch = ({filterProducts}: InputSeachProps) => (
   <TextField
     type="search"
     style={{backgroundColor: '#eee', fontSize: 15, padding: '0 1%'}}
     onChange={filterProducts}
     className="MuiInput-inputTypeSearch"
     placeholder="  Filtrar por nome"
   />
);