import { 
   Button, InputLabel, MenuItem, Select, TextField 
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import swal from 'sweetalert';
import {Controller, useForm} from 'react-hook-form';

import { categorias } from '../libs/categoria';
import { FormMain } from '../styles/Style';
import { Product, ProductContext } from './../context/ProductContext';

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
      const valor = Number(newProduct.preco);
      if(valor <= 0){
         await swal({
            title: 'Não foi possivel salvar o produto!', 
            text: 'Preços iguais ou menor do que 0 não são permitidos', 
            icon: 'warning'
         });
         return ;
      }
      if(newProduct.sku <= 0){
         await swal({
            title: 'Não foi possivel salvar o produto!', 
            text: 'Codigo SKU iguais ou menor do que 0 não são permitidos', 
            icon: 'warning'
         });
         return ;
      }
      if(newProduct.sku.toString().includes('.') || newProduct.sku.toString().includes(',')){
         await swal({
            title: 'Não foi possivel salvar o produto!', 
            text: 'Pontos e Virgulas não são permitidos no codigo SKU', 
            icon: 'warning'
         });
         return ;
      } 

      if(isEditable){
         onEdit(newProduct);
         setIsEditable(false);
      }
      else{
         try{
            onSave(newProduct);
         }catch(error){
            swal({
               title: 'Não foi possivel salvar o produto',
               text: `Codigo SKU ${newProduct.sku} já existe`,
               icon: 'warning',
            });
         }
      } 
      //Limpar os campos
      reset();
  }

  useEffect(() => {
     if(isEditable){
        console.log(product);
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
               style={{marginBottom: 10, width: '20%'}}
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
            rules={{ required: true, minLength: 5 }}
            render={({ field }) => (
            <TextField
               style={{marginBottom: 10, width: '20%'}} 
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
            rules={{required: true }}
            render={({ field }) => (
               <TextField
               style={{marginBottom: 10, width: '20%'}} 
               id="standard-basic"
               type="number" 
               label="Preço"
               
               required
               {...field}
             />)}
         />
        <InputLabel id="demo-simple-select-label" style={{marginBottom: 10, width: '20%'}}>Escolha uma Categoria</InputLabel>
        <Controller
            name="categoria"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
            <Select
            style={{marginBottom: 15, width: '20%'}}
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
        <Button variant="contained" type="submit" color="primary">
          <FaSave style={{marginRight: 5}}/> Salvar
        </Button>
        </FormMain>
   );
}