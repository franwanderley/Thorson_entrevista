import { TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';

interface InputSeachProps{
   filterProducts: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputSearch = ({filterProducts}: InputSeachProps) => {
   return (
      <TextField
      type="search"
      onChange={filterProducts}
      style={{backgroundColor: '#eee', textAlign: 'center', fontSize: 15,margin: '1% 15%', padding: '0 1%'}}
      placeholder="  Filtrar por nome"
      />
   );
}