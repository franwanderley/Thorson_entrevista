import { 
   Button, InputLabel, MenuItem, Select, TextField 
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { FaEraser, FaSave } from 'react-icons/fa';
import swal from 'sweetalert';
import {Controller, useForm} from 'react-hook-form';

import { categorias } from '../libs/categoria';
import { FormMain } from '../styles/Style';
import { Product, ProductContext } from './../context/ProductContext';
import { Validar } from '../libs/validador';

interface FormProductProps{
   product? : Product;
   isEditable: boolean;
   setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
}



export function FormProduct({product, isEditable, setIsEditable}: FormProductProps){
   const {onEdit, onSave} = useContext(ProductContext);
   const { handleSubmit, control, setValue,reset } = useForm<Product>();

   async function onSubmit(newProduct : Product){
      //Validação
      try{
         Validar(newProduct);

         if(isEditable){
            onEdit(newProduct);
            setIsEditable(false);
         }
         else{
            onSave(newProduct);
         }   
      }catch(error){
         swal({
            title: 'Não foi possivel salvar o produto',
            text: `${error}`,
            icon: 'warning',
         });
      } 
      //Limpar os campos
      reset();
  }

  useEffect(() => {
     if(isEditable){
        console.log(product?.preco);
        product?.sku && setValue('sku', product?.sku);
        product?.nome && setValue('nome', product?.nome);
        product?.preco && setValue('preco', product?.preco);
        product?.categoria && setValue('categoria', product?.categoria);
     }
  }, [product, isEditable, setValue]);

   return (
      <FormMain onSubmit={handleSubmit(onSubmit)} >
         <Controller
            name="sku"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
            <TextField 
               style={{marginBottom: 10, width: 300, textAlign: 'center'}}
               id="standard-basic" 
               type="text"
               label="Codigo SKU"
               {...field}
               disabled={isEditable}
            />)}
         />
         <Controller
            name="nome"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
            <TextField
               style={{marginBottom: 10, width: 300}} 
               id="standard-basic"
               type="text" 
               label="Nome do Produto"
               required
               {...field}
             />)}
         />
         <Controller
            name="preco"
            control={control}
            defaultValue=""
            rules={{required: true  }}
            render={({ field }) => (
               <TextField
               style={{marginBottom: 10, width: 300}} 
               id="standard-basic"
               type="text" 
               label="Preço"
               
               required
               {...field}
             />)}
         />
        <InputLabel id="demo-simple-select-label" style={{marginBottom: 10, width: 300}}>Escolha uma Categoria</InputLabel>
        <Controller
            name="categoria"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
            <Select
            style={{marginBottom: 15, width: 300}}
               labelId="demo-simple-select-label"
               id="demo-simple-select"
               required
               {...field}
            >  
            {categorias.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
        </Select>)}
         />
         <div style={{display: 'flex', flexDirection: 'row', width: 250, justifyContent: 'space-evenly'}}>
         <Button variant="contained" type="submit" color="primary">
            <FaSave style={{marginRight: 5}}/> Salvar
         </Button>
         <Button 
            onClick={() => {reset(); setIsEditable(false)}} 
            variant="contained" 
            type="reset" 
            color="secondary"
         >
            <FaEraser style={{marginRight: 5}}/> Limpar
         </Button>
        </div>
      </FormMain>
   );
}