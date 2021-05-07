import { Button } from '@material-ui/core';
import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface ButtonRemoveProps{
   deleteProduct : () => void;
}

export const ButtonRemove = ({deleteProduct} : ButtonRemoveProps) => (
   <Button onClick={deleteProduct} variant="text" color="secondary">
     <FaTrash/>
   </Button>
 );